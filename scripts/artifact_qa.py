"""Development local structural QA. No prediction of real ATS vendor behavior."""
import hashlib
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import urlparse
from zipfile import ZipFile, BadZipFile
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'


def normalized(text):
    return re.sub(r'\s+', ' ', text).strip()


def inspect_artifact(path, expected, *, expected_pages=None, visual_reviewed=False):
    path = Path(path); risks = []; checks = []; pages = None; links = []
    try:
        if path.suffix.lower() == '.docx':
            with ZipFile(path) as z:
                root = ET.fromstring(z.read('word/document.xml'))
                text = '\n'.join(''.join(t.text or '' for t in p.iter(W+'t')) for p in root.iter(W+'p'))
                if any(True for _ in root.iter(W+'tbl')): risks.append('Tables need reading-order review')
                if any(True for _ in root.iter(W+'txbxContent')): risks.append('Textbox content risk')
                if any(int(c.get(W+'num', '1')) > 1 for c in root.iter(W+'cols')): risks.append('Multiple columns')
                for name in z.namelist():
                    if re.fullmatch(r'word/(header|footer)\d+\.xml', name):
                        section = ET.fromstring(z.read(name))
                        if any(t.text for t in section.iter(W+'t')): risks.append('Header/footer text needs review')
                if 'word/_rels/document.xml.rels' in z.namelist():
                    for rel in ET.fromstring(z.read('word/_rels/document.xml.rels')):
                        if rel.get('Type', '').endswith('/hyperlink'): links.append(rel.get('Target', ''))
            method = 'OOXML body paragraphs, including hyperlink runs'
        elif path.suffix.lower() == '.pdf':
            if not shutil.which('pdftotext') or not shutil.which('pdfinfo'):
                return {'qa_status':'NOT_CHECKED','reason':'Poppler unavailable; no extraction observed'}
            text = subprocess.run(['pdftotext','-enc','UTF-8',str(path),'-'], check=True,
                                  capture_output=True,text=True).stdout
            info = subprocess.run(['pdfinfo',str(path)],check=True,capture_output=True,text=True).stdout
            pages = int(re.search(r'^Pages:\s+(\d+)',info,re.M).group(1))
            # Link annotations require separate observation; text URLs alone are not annotation QA.
            links = re.findall(r'https?://\S+', text)
            method = 'Poppler pdftotext/pdfinfo; no OCR'
        else:
            raise ValueError('Unsupported file format')
    except (OSError,ValueError,KeyError,BadZipFile,ET.ParseError,subprocess.SubprocessError) as error:
        return {'qa_status':'ATS-Broken','reason':str(error)}
    observed = normalized(text); cursor = 0
    for value in expected:
        fragment = normalized(value)
        position = observed.find(fragment,cursor)
        checks.append({'check':value,'result':'PASS' if fragment and position >= 0 else 'FAIL',
                       'observation':'Exact normalized text in expected order'})
        if position >= 0: cursor = position + len(fragment)
    for link in links:
        parsed = urlparse(link)
        if parsed.scheme not in ['http','https','mailto'] or parsed.username or not (parsed.netloc or parsed.scheme=='mailto'):
            risks.append('Invalid or credential-bearing hyperlink')
    if expected_pages is not None and pages != expected_pages:
        risks.append('Page count not verified or differs from requested count')
    if not visual_reviewed: risks.append('Visual review pending')
    broken = not observed or '\ufffd' in observed or any(c['result']=='FAIL' for c in checks)
    return {'qa_status':'ATS-Broken' if broken else 'ATS-Risky' if risks else 'ATS-Ready',
            'format':path.suffix[1:].upper(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),
            'page_count':pages,'extracted_text':text,'method':method,'checks':checks,'risks':risks,
            'links':links,'limitation':'Local readability; actual portal parsing and live link reachability unverified'}

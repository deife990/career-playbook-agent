"""Real file extraction checks on an explicitly fictional bilingual resume."""
import shutil
from zipfile import ZipFile
import pytest
from scripts.common import ROOT, load
from scripts.artifact_qa import inspect_artifact

FIXTURES = ROOT/'fixtures/screening'
EXPECTED = load(FIXTURES/'artifact-expected.json')


def require_poppler():
    assert shutil.which('pdftotext') and shutil.which('pdfinfo'), 'Install Poppler for the artifact gate'


def test_real_docx_contains_name_company_title_dates_and_bullets_in_order():
    report = inspect_artifact(FIXTURES/'synthetic-resume.docx', EXPECTED, visual_reviewed=True)
    assert report['qa_status'] == 'ATS-Ready'
    assert all(row['result'] == 'PASS' for row in report['checks'])
    assert '김하윤' in report['extracted_text']


def test_real_pdf_extracts_korean_and_all_resume_content_on_one_page():
    require_poppler()
    report = inspect_artifact(FIXTURES/'synthetic-resume.pdf', EXPECTED, expected_pages=1, visual_reviewed=True)
    assert report['qa_status'] == 'ATS-Ready'
    assert report['page_count'] == 1
    assert all(row['result'] == 'PASS' for row in report['checks'])


@pytest.mark.parametrize('expected', [EXPECTED+['Invented outcome'], list(reversed(EXPECTED))])
def test_missing_content_or_bad_reading_order_blocks_artifact(expected):
    assert inspect_artifact(FIXTURES/'synthetic-resume.docx', expected)['qa_status'] == 'ATS-Broken'


def test_extraction_does_not_self_certify_visual_balance():
    result = inspect_artifact(FIXTURES/'synthetic-resume.docx', EXPECTED)
    assert result['qa_status'] == 'ATS-Risky'
    assert 'Visual review pending' in result['risks']


def test_wrong_page_count_is_risk():
    require_poppler()
    result = inspect_artifact(FIXTURES/'synthetic-resume.pdf', EXPECTED, expected_pages=2, visual_reviewed=True)
    assert result['qa_status'] == 'ATS-Risky'


def test_missing_pdf_tools_remains_unchecked(monkeypatch):
    monkeypatch.setattr(shutil, 'which', lambda _: None)
    assert inspect_artifact(FIXTURES/'synthetic-resume.pdf', EXPECTED)['qa_status'] == 'NOT_CHECKED'


def test_invalid_docx_is_broken_instead_of_crashing(tmp_path):
    file = tmp_path/'broken.docx'; file.write_text('Not a ZIP')
    assert inspect_artifact(file, EXPECTED)['qa_status'] == 'ATS-Broken'


def test_hyperlink_runs_are_extracted_but_unsafe_target_flagged(tmp_path):
    path = tmp_path/'hyperlink.docx'
    with ZipFile(path, 'w') as archive:
        archive.writestr('word/document.xml', '''<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:hyperlink><w:r><w:t>Portfolio</w:t></w:r></w:hyperlink></w:p></w:body></w:document>''')
        archive.writestr('word/_rels/document.xml.rels', '''<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="r1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="file:///private/secret" TargetMode="External"/></Relationships>''')
    report = inspect_artifact(path, ['Portfolio'], visual_reviewed=True)
    assert report['qa_status'] == 'ATS-Risky'
    assert 'Invalid or credential-bearing hyperlink' in report['risks']


def test_image_only_docx_is_broken(tmp_path):
    path = tmp_path/'image.docx'
    with ZipFile(path,'w') as archive:
        archive.writestr('word/document.xml', '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:drawing/></w:r></w:p></w:body></w:document>')
    assert inspect_artifact(path, ['Name'])['qa_status'] == 'ATS-Broken'

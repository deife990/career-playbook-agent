from pathlib import Path
import json, re, yaml
from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource
ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ['Purpose','Trigger','Required context','Steps','Evidence rules','Output','State updates','Fallbacks','Do not']
def load(path): return json.loads(Path(path).read_text())
def schema_validator(name):
    schemas = [load(p) for p in (ROOT/'schemas').glob('*.schema.json')]
    registry = Registry().with_resources((s['$id'],Resource.from_contents(s)) for s in schemas)
    return Draft202012Validator(load(ROOT/f'schemas/{name}.schema.json'), registry=registry, format_checker=FormatChecker())
def frontmatter(path):
    text = Path(path).read_text()
    if not text.startswith('---\n') or '\n---\n' not in text[4:]: raise ValueError(f'Missing frontmatter: {path}')
    header, body = text[4:].split('\n---\n',1)
    meta = yaml.safe_load(header)
    if not isinstance(meta,dict): raise ValueError(f'Invalid frontmatter: {path}')
    return meta, body
def validate_skill(path, sections=False):
    meta, body = frontmatter(path)
    if not re.fullmatch('[a-z0-9-]{1,64}',meta.get('name','')): raise ValueError(f'Invalid skill name: {path}')
    if not isinstance(meta.get('description'),str) or not 1 <= len(meta['description']) <= 200: raise ValueError(f'Invalid description: {path}')
    if len(Path(path).read_text().splitlines()) > 500: raise ValueError(f'Skill exceeds line limit: {path}')
    if Path(path).parent.name != meta['name']: raise ValueError(f'Folder/name mismatch: {path}')
    if sections:
        for section in SECTIONS:
            if f'## {section}\n' not in body: raise ValueError(f'Missing {section}: {path}')
    return meta
def validate_links(root):
    root = Path(root).resolve()
    errors=[]
    for path in root.rglob('*.md'):
        if any(x in path.relative_to(root).parts for x in ['.venv','.git','dist','work']): continue
        for url in re.findall(r'!?\[[^\]]*\]\(([^)]+)\)',path.read_text()):
            if re.match(r'^[a-z][a-z0-9+.-]*:',url) or url.startswith('#'): continue
            target=url.split('#')[0].strip('<>')
            if not target: continue
            dest=(path.parent/target).resolve()
            if not dest.is_relative_to(root) or not dest.exists(): errors.append(f'{path.relative_to(root)}: {target}')
    if errors: raise ValueError('Broken/escaping links: '+ '; '.join(errors))

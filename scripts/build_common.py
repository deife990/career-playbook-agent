from pathlib import Path
import json, shutil
from scripts.common import ROOT, validate_links, validate_skill
from scripts.generate_adapters import generate
from scripts.validate_manifest import validate_manifest

def catalog():
    data=json.loads((ROOT/'.agents/plugins/marketplace.json').read_text())
    data['plugins'][0]['source']['path']='./'
    return data

def build(platform):
    source=generate(platform)
    if any(p.is_symlink() for p in source.rglob('*')): raise ValueError('Runtime symlink forbidden')
    destination=ROOT/'dist'/platform/'careerpilot'
    if destination.exists(): shutil.rmtree(destination)
    shutil.copytree(source,destination,ignore=shutil.ignore_patterns('README.md','.gitkeep'))
    if platform=='chatgpt':
        (destination/'host.md').unlink(missing_ok=True)
        validate_manifest(destination)
        path=destination/'.agents/plugins/marketplace.json';path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(json.dumps(catalog(),indent=2)+'\n')
    for p in destination.rglob('*'):
        if p.is_symlink(): raise ValueError('Runtime symlink forbidden')
        if p.is_file() and p.suffix not in ['.md','.json','.yaml']:
            raise ValueError(f'Unexpected runtime artifact: {p.name}')
    for p in destination.rglob('SKILL.md'): validate_skill(p,platform=='chatgpt')
    validate_links(destination)
    return destination

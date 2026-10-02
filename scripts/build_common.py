from pathlib import Path
import json, shutil
from scripts.common import ROOT, validate_links, validate_skill
from scripts.generate_adapters import generate, write_if_changed
from scripts.validate_manifest import validate_manifest
from scripts.package_inventory import inventory

def catalog():
    data=json.loads((ROOT/'.agents/plugins/marketplace.json').read_text())
    data['plugins'][0]['source']['path']='./'
    return data

def build(platform):
    source=generate(platform)
    if any(p.is_symlink() for p in source.rglob('*')): raise ValueError('Runtime symlink forbidden')
    destination=ROOT/'dist'/platform/'careerpilot'
    destination.mkdir(parents=True,exist_ok=True)
    for relative in inventory(source,platform):
        path=destination/relative; path.parent.mkdir(parents=True,exist_ok=True)
        if path.is_symlink() or not path.resolve().is_relative_to(destination.resolve()): raise ValueError('Unsafe output path')
        write_if_changed(path,(source/relative).read_bytes())
    if platform=='chatgpt':
        validate_manifest(destination)
        path=destination/'.agents/plugins/marketplace.json';path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(json.dumps(catalog(),indent=2)+'\n')
    paths=inventory(destination,platform)+(['.agents/plugins/marketplace.json'] if platform=='chatgpt' else [])
    for relative in paths:
        p=destination/relative
        if p.is_symlink(): raise ValueError('Runtime symlink forbidden')
        if p.is_file() and p.suffix not in ['.md','.json','.yaml']:
            raise ValueError(f'Unexpected runtime artifact: {p.name}')
    for relative in paths:
        if relative.endswith('/SKILL.md') or relative=='SKILL.md': validate_skill(destination/relative,platform=='chatgpt')
    validate_links(destination)
    return destination

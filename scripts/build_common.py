from pathlib import Path
import shutil
from scripts.common import ROOT, load, validate_links, validate_skill
def build(platform):
    source=ROOT/'adapters'/platform
    destination=ROOT/'dist'/platform/'careerpilot'
    if destination.exists(): shutil.rmtree(destination)
    shutil.copytree(source if platform=='chatgpt' else source/'careerpilot', destination)
    if platform=='chatgpt':
        manifest=load(destination/'plugin.json')
        if manifest['name']!='careerpilot' or manifest['version']!=ROOT.joinpath('VERSION').read_text().strip(): raise ValueError('Manifest/version mismatch')
        if any(k in manifest for k in ['mcpServers','apps']): raise ValueError('Unexpected service dependency')
    for p in destination.rglob('SKILL.md'): validate_skill(p,platform=='chatgpt')
    validate_links(destination)
    return destination

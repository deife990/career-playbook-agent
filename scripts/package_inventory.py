"""Canonical runtime file inventory, independent of incidental filesystem duplicates."""
from pathlib import PurePosixPath
from scripts.common import ROOT,load

def inventory(root,platform):
    paths={'core-index.json','references/host.md'}
    for path in load(root/'core-index.json'):
        relative=PurePosixPath(path)
        if relative.is_absolute() or '..' in relative.parts or relative.parts[0] not in ['core','schemas','templates']:
            raise ValueError('Unsafe canonical inventory path')
        paths.add('references/'+path)
        if platform=='claude' and relative.parts[0]=='templates':paths.add(path)
    if platform=='chatgpt':
        paths.add('plugin.json')
        paths.add('.codex-plugin/plugin.json')
        paths.update(f"skills/{e['name']}/SKILL.md" for e in load(ROOT/'adapters/skills.json'))
    elif platform=='claude':
        paths.add('SKILL.md')
        paths.update(f'references/w{i:02}.md' for i in range(1,10))
        paths.update(f'references/{name}.md' for name in ['state','evidence','research','artifacts'])
    else:raise ValueError('Unknown platform')
    for relative in paths:
        path=root/relative
        if not path.is_file() or path.is_symlink():raise ValueError('Missing/unsafe runtime file: '+relative)
    return sorted(paths)

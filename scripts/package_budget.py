"""Measure declared initial reads, excluding selected-workflow/on-demand menu links."""
import re
from scripts.common import ROOT, load
from scripts.package_inventory import inventory

LINK = re.compile(r'\[[^\]]*\]\(([^)]+)\)')


def initial_files(root, entry):
    text = entry.read_text()
    sections = re.split(r'^## ', text, flags=re.M)[1:]
    initial = [section for section in sections if section.splitlines()[0] in
               {'Trigger', 'Required context', 'Required loading and routing'}]
    files = {entry.resolve()}
    for link in LINK.findall('\n'.join(initial)):
        path = (entry.parent / link.split('#')[0]).resolve()
        if not path.is_relative_to(root.resolve()) or not path.is_file():
            raise ValueError('Unsafe or missing initial reference: ' + link)
        files.add(path)
        # The policy index explicitly instructs reading its linked policies. Other
        # files' menus are progressive references, not universal initial reads.
        if path.name == 'index.md' and path.parent.name == 'principles':
            for child in LINK.findall(path.read_text()):
                target = (path.parent / child.split('#')[0]).resolve()
                if not target.is_relative_to(root.resolve()) or not target.is_file():
                    raise ValueError('Unsafe or missing policy reference: ' + child)
                files.add(target)
    if len(files) == 1:
        raise ValueError('Entry has no declared initial reference contract')
    return sorted(files)


def measure(root, platform):
    entries = [root / 'SKILL.md'] if platform == 'claude' else sorted(root.glob('skills/*/SKILL.md'))
    return {'file_count': len(inventory(root, platform)), 'entries': {
        entry.relative_to(root).as_posix(): {
            'bytes': sum(path.stat().st_size for path in initial_files(root, entry)),
            'files': [path.relative_to(root.resolve()).as_posix() for path in initial_files(root, entry)]
        } for entry in entries}}


def check_budget(root, platform, limits=None):
    limits = limits or load(ROOT / 'evals/package-budgets.json')
    actual = measure(root, platform)
    cap = limits['platforms'][platform]
    if actual['file_count'] > cap['file_count']:
        raise ValueError(f"{platform}: runtime file count {actual['file_count']} > {cap['file_count']}")
    if set(actual['entries']) != set(cap['entries']):
        raise ValueError('Entry inventory changed; requires explicit budget review')
    for name, row in actual['entries'].items():
        if row['bytes'] > cap['entries'][name]['bytes']:
            raise ValueError(f"{platform}/{name}: initial bytes {row['bytes']} > {cap['entries'][name]['bytes']}")
    return actual

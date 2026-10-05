import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.common import ROOT, validate_skill
def main():
    paths=list((ROOT/'adapters').rglob('SKILL.md'))
    for p in paths: validate_skill(p, 'chatgpt' in p.parts)
    print(f'Frontmatter: {len(paths)} skills valid')
if __name__ == '__main__': main()

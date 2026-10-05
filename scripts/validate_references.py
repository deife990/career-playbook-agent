import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.common import ROOT, validate_links
def main():
    validate_links(ROOT)
    print('Internal references valid')
if __name__ == '__main__': main()

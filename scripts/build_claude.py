import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.build_common import build
def main():
    print(build('claude'))
if __name__ == '__main__': main()

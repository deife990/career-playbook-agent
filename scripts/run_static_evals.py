import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.validate_frontmatter import main as frontmatter
from scripts.validate_schemas import main as schemas
from scripts.validate_references import main as references
from scripts.validate_workflows import main as workflows
from scripts.validate_manifest import main as manifest
from scripts.build_all import main as builds
def main():
    schemas(); workflows(); manifest(); frontmatter(); references(); builds()
    print('Static evals PASS (not a live model evaluation)')
if __name__ == '__main__': main()

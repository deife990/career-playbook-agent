from scripts.validate_frontmatter import main as frontmatter
from scripts.validate_schemas import main as schemas
from scripts.validate_references import main as references
from scripts.build_all import main as builds
def main():
    schemas(); frontmatter(); references(); builds()
    print('Static evals PASS (not a live model evaluation)')
if __name__ == '__main__': main()

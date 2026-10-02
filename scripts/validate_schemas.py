from scripts.common import ROOT, load, schema_validator
from jsonschema import Draft202012Validator
def main():
    for p in (ROOT/'schemas').glob('*.schema.json'): Draft202012Validator.check_schema(load(p))
    aliases={'context-manifest':'context-manifest','interview-log':'interview'}
    for p in (ROOT/'templates').glob('*.json'): schema_validator(aliases.get(p.stem,p.stem)).validate(load(p))
    print('Schemas and default templates valid')
if __name__ == '__main__': main()

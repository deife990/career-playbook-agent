"""Validate portable manifest against a pinned official schema, offline."""
import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from jsonschema import Draft202012Validator
from scripts.common import ROOT, load

def validate_manifest(root):
    manifest=load(root/'plugin.json')
    schema=load(ROOT/'fixtures/platform/plugin.schema.json')
    Draft202012Validator(schema).validate(manifest)
    if manifest.get('name')!='careerpilot' or manifest.get('version')!=(ROOT/'VERSION').read_text().strip():
        raise ValueError('Manifest/version mismatch')
    if any(k in manifest for k in ['mcpServers','apps','auth','dependencies']):
        raise ValueError('Unexpected service dependency')
    # Portable schema validity alone does not establish ChatGPT archive acceptance.
    # Keep the documented skills-only upload metadata complete before native tests.
    if not manifest.get('author', {}).get('name', '').strip():
        raise ValueError('ChatGPT upload requires author.name')
    interface=manifest.get('extensions', {}).get('com.openai', {}).get('interface', {})
    for name,limit in [('displayName',80),('shortDescription',240),
                       ('longDescription',4000),('developerName',120)]:
        value=interface.get(name)
        if not isinstance(value,str) or not value.strip() or len(value)>limit:
            raise ValueError('Invalid ChatGPT upload interface.'+name)
    if '\n' in interface['shortDescription']:
        raise ValueError('ChatGPT shortDescription must fit on one line')

def main(): validate_manifest(ROOT/'adapters/chatgpt'); print('Official portable manifest schema PASS')
if __name__=='__main__': main()

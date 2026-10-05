"""Validate portable manifest against a pinned official schema, offline."""
import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from jsonschema import Draft202012Validator
from pathlib import PurePosixPath
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
    onboarding=manifest.get('extensions', {}).get('com.openai', {}).get('onboardingSkill')
    if onboarding is not None:
        if not isinstance(onboarding,str) or not onboarding.startswith('./'):
            raise ValueError('onboardingSkill must be a ./skills/<name>/SKILL.md path')
        path=PurePosixPath(onboarding)
        if len(path.parts)!=3 or path.parts[0]!='skills' or path.parts[2]!='SKILL.md' or '..' in path.parts:
            raise ValueError('Invalid onboardingSkill path')
        if not (root/path).is_file() or (root/path).is_symlink():
            raise ValueError('onboardingSkill must reference an included skill')

def main(): validate_manifest(ROOT/'adapters/chatgpt'); print('Official portable manifest schema PASS')
if __name__=='__main__': main()

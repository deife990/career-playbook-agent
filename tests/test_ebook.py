import yaml
from scripts.common import ROOT,load,frontmatter,schema_validator

def test_all_verified_book_chapters_have_workflow_links():
    index=load(ROOT/'fixtures/ebook/chapter-index.json');mapping=yaml.safe_load((ROOT/'docs/ebook-map.yaml').read_text())
    assert mapping['manuscript_sha256']==index['sha256']
    assert [c['number'] for c in mapping['chapters']]==list(range(1,25))
    assert [{k:c[k] for k in ['id','number','title']} for c in mapping['chapters']]==index['chapters']
    workflows={frontmatter(p)[0]['id'] for p in (ROOT/'core/workflows').glob('w*.md')}
    for chapter in mapping['chapters']: assert set(chapter['workflows'])<=workflows and chapter['workflows']
    for topic in mapping['topics']:
        assert set(topic['chapters'])<={c['id'] for c in index['chapters']}
        for cap in topic['capabilities']: assert (ROOT/f'core/capabilities/{cap}.md').is_file()
    assert len(mapping['minimum_files'])==6

def test_global_interview_round_types_are_portable():
    for kind in ['TEAMMATE','REGIONAL','GLOBAL','REFERENCE','BACKGROUND_CHECK']:
        schema_validator('interview').validate({'id':'i','opportunity_id':'alpha','round':{'id':'r','opportunity_id':'alpha','type':kind}})

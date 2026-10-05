import copy, pytest
from jsonschema import ValidationError
from scripts.common import ROOT, load, schema_validator
from scripts.validate_schemas import main
def test_all_schemas_and_templates(): main()
def test_unknown_fields_fail():
    p=load(ROOT/'templates/career-profile.json'); p['invented']='bad'
    with pytest.raises(ValidationError): schema_validator('career-profile').validate(p)
def test_versions_fail_closed():
    p=load(ROOT/'templates/context-manifest.json'); p['schema_version']='9.0.0'
    with pytest.raises(ValidationError): schema_validator('context-manifest').validate(p)
def test_wrong_type_and_invalid_status():
    for schema, sample, key, value in [('career-profile','career-profile','experience_years','five'),('opportunity','opportunity','status','GUESS')]:
        p=load(ROOT/f'templates/{sample}.json'); p[key]=value
        with pytest.raises(ValidationError): schema_validator(schema).validate(p)

import copy
import pytest
from scripts.common import ROOT, load
from scripts.context_pack import export, import_pack, validate
from scripts.submission_oracle import freeze, select_submitted_resume


def fixture():
    pack = load(ROOT/'fixtures/state/two-opportunities.json')
    app = pack['applications/alpha.json']
    app['resume_versions'] = [{'id':'resume-a','opportunity_id':'alpha','kind':'TAILORED',
        'summary':'Testing contributor','bullets':[{'text':'Tested 12 cases',
        'evidence_ids':['e-1'],'action':'KEEP','bullet_key':'a-1'}]}]
    pack['applications/alpha.json'] = freeze(app, 'resume-a', 'submission-a',
        '2026-10-09T09:00:00+09:00', 'Test cases required', user_confirmed=True)
    return pack


def test_frozen_roundtrip_and_new_master_does_not_replace_submission():
    p = fixture()
    p['career-profile.json']['resume_versions'] = [{'id':'master-new','kind':'MASTER',
        'opportunity_id':None,'summary':'Later positioning'}]
    restored = import_pack(export(p))
    assert restored['applications/alpha.json'] == p['applications/alpha.json']
    assert select_submitted_resume(restored['applications/alpha.json'])['id'] == 'resume-a'


@pytest.mark.parametrize('field', ['summary','bullets'])
def test_hash_rejects_frozen_resume_edits(field):
    p = fixture()
    p['applications/alpha.json']['resume_versions'][0][field] = None
    with pytest.raises(ValueError, match='Frozen'): validate(p)


@pytest.mark.parametrize('edit', ['delete','answer','unhash'])
def test_import_prevents_submitted_record_loss_or_mutation(edit):
    old = fixture(); new = copy.deepcopy(old); new['manifest.json']['revision'] += 1
    records = new['applications/alpha.json']['submissions']
    if edit == 'delete': records.clear()
    if edit == 'answer': records[0]['cover_letter'] = 'New letter'
    if edit == 'unhash': records[0]['resume_sha256'] = None
    with pytest.raises(ValueError, match='Submitted'): import_pack(export(new), old)


def test_cross_company_and_round_reference_are_rejected():
    p = fixture(); p['applications/alpha.json']['submissions'][0]['resume_version_id'] = 'beta'
    with pytest.raises(ValueError, match='same-opportunity'): validate(p)
    p = fixture(); p['applications/beta.json']['interviews'] = [{'id':'int-b',
        'opportunity_id':'beta','round':{'id':'round-b','opportunity_id':'beta',
        'submission_id':'submission-a','resume_version_id':'resume-a'}}]
    with pytest.raises(ValueError, match='mismatch'): validate(p)


def test_freeze_requires_actual_confirmation_and_does_not_change_status():
    p = fixture(); app = p['applications/alpha.json']
    with pytest.raises(ValueError, match='confirmation'): freeze(app,'resume-a','s-new',None,'JD')
    assert app['opportunity']['status'] == 'DISCOVERED'
    assert select_submitted_resume(p['applications/beta.json']) is None


def test_null_hash_still_immutable_and_ambiguous_dates_require_selection():
    p = fixture(); p['applications/alpha.json']['submissions'][0]['resume_sha256'] = None
    new = copy.deepcopy(p); new['manifest.json']['revision'] += 1
    new['applications/alpha.json']['resume_versions'][0]['summary'] = 'Changed'
    with pytest.raises(ValueError, match='Submitted'): import_pack(export(new), p)
    app = freeze(p['applications/alpha.json'],'resume-a','second','2026-10-09','JD',user_confirmed=True)
    with pytest.raises(ValueError, match='Clarify'): select_submitted_resume(app)
    assert select_submitted_resume(app,'submission-a')['id'] == 'resume-a'

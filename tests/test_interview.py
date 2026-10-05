from scripts.mock_contract import turn
from scripts.common import ROOT
def test_feedback_requires_explicit_end():
    session={'status':'ACTIVE','transcript':[]}
    same,action=turn(session,'FEEDBACK_REQUEST','How did I do?'); assert action=='QUESTION'; assert same['status']=='ACTIVE'
    updated,action=turn(same,'ANSWER','I supported testing'); assert action=='QUESTION'; assert updated['transcript'][0]['text']=='I supported testing'
    ended,action=turn(updated,'END','끝내자'); assert action=='REVIEW'; assert ended['explicit_end']
    assert session['transcript']==[]
def test_cheat_sheet_is_compact_and_not_answer_book():
    template=(ROOT/'templates/artifacts/interview-cheat-sheet.md').read_text()
    assert template.count('## ')==7
    assert 'at_most_five' in template
def test_debrief_collection_order():
    t=(ROOT/'core/workflows/w08-interview-debrief.md').read_text()
    assert 'Questions → Follow-ups → User answers → Interviewer reactions → Repeated' in t
    assert t.index('Collect in order')<t.index('Compare previous hypotheses')

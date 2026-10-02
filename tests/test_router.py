import pytest
from scripts.router_oracle import route
@pytest.mark.parametrize('text,workflow',[('이직 준비 시작하고 싶어','W01'),('커리어 로드맵','W02'),('공고 찾아줘','W03'),('이 공고 어때?','W04'),('여기 지원할래','W05'),('면접 잡혔어','W06'),('모의면접 하자','W07'),('면접 끝났어','W08'),('오퍼 받았어','W09'),('면접 끝났어. 오퍼 받았어','W08'),('모의면접 하자. 면접 준비','W07'),('이 공고 이력서 만들어줘','W05')])
def test_precedence_examples(text,workflow): assert route(text)['workflow']==workflow
def test_multi_opportunity_requires_selection():
    assert route('면접 잡혔어',active_ids=['a','b'])['action']=='CLARIFY_OPPORTUNITY'
    assert route('면접 잡혔어',active_ids=['a','b'],selected_id='b')['opportunity_id']=='b'
def test_mock_end_and_no_coaching_interrupt():
    assert route('좋은 답변이야?',mock_active=True)['action']=='QUESTION'
    assert route('종료',mock_active=True)['action']=='REVIEW'
def test_context_capability(): assert route('경력 정보 내보내줘')['capability']=='career-state'

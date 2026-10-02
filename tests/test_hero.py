from scripts.common import ROOT, frontmatter
def test_independent_candidate_stage_order():
    meta,_=frontmatter(ROOT/'core/workflows/w04-job-intelligence.md')
    assert meta['stages']==['jd_acquisition','jd_decomposition','company_business','industry_context','historical_hiring','public_people_patterns','org_hypothesis','hiring_reason_90_days','independent_ideal_candidate','user_evidence_mapping','candidate_positioning','risks_unknowns_verification','brief_sources']
def test_candidate_brief_all_sections():
    template=(ROOT/'templates/artifacts/candidate-strategy.md').read_text()
    assert template.count('\n## ')==15
    assert template.index('## Ideal Candidate')<template.index('## Your Strong Evidence')

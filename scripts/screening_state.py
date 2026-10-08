"""Development integrity checks; semantic truth still requires evidence/model review."""
from pathlib import PurePosixPath


def validate_screening(pack):
    resumes = {r['id']:r for path,value in pack.items() if path!='manifest.json'
               for r in value.get('resume_versions') or [] if r}
    for path, value in pack.items():
        if path == 'manifest.json': continue
        scope = path[13:-5] if path.startswith('applications/') else None
        for resume in value.get('resume_versions') or []:
            if not resume: continue
            parent = resume.get('derived_from_id')
            if parent and (parent not in resumes or resumes[parent].get('opportunity_id') not in [None,scope]):
                raise ValueError('Resume derivation missing or cross-company')
            for artifact in resume.get('artifacts') or []:
                if not artifact: continue
                relative = artifact.get('path')
                if relative and (PurePosixPath(relative).is_absolute() or '..' in relative.split('/')
                                 or '\\' in relative or ':' in relative):
                    raise ValueError('Unsafe artifact sidecar path')
        for answer in value.get('answers') or []:
            if not answer: continue
            text, limit, unit = answer.get('answer'), answer.get('limit'), answer.get('limit_unit')
            if text is not None and limit is not None and unit:
                count = len(text.encode('utf-8')) if unit=='BYTES' else len(text.split()) if unit=='WORDS' else len(text)
                if count > limit: raise ValueError('Application answer exceeds field limit')
            if answer.get('status')=='USER_APPROVED':
                if answer.get('user_confirmed') is not True:
                    raise ValueError('Application answer approval not confirmed')
                if answer.get('type') in ['WHY_COMPANY','WHY_ROLE'] and answer.get('motivation_confirmed') is not True:
                    raise ValueError('Application motivation not confirmed')
        analysis = (value.get('opportunity') or {}).get('job_analysis') or {}
        requirements = {r['key']:r for r in analysis.get('requirements') or [] if r and r.get('key')}
        for requirement in requirements.values():
            if requirement.get('category')=='HIDDEN_INFERRED' and requirement.get('classification')!='INFERENCE':
                raise ValueError('Hidden hiring need promoted to fact')
        screening = value.get('screening') or {}
        rid = screening.get('resume_version_id')
        if rid and (rid not in resumes or resumes[rid].get('opportunity_id')!=scope):
            raise ValueError('Screening resume scope mismatch')
        for row in screening.get('coverage') or []:
            if not row: continue
            if row.get('requirement_key') and row['requirement_key'] not in requirements:
                raise ValueError('Unknown JD requirement key')
            if row.get('match') in ['DIRECT_MATCH','TRANSFERABLE','PARTIAL'] and not row.get('evidence_ids'):
                raise ValueError('Coverage match lacks evidence')
        if screening.get('ready') is True:
            stages = {s.get('name'):s.get('status') for s in screening.get('stages') or [] if s}
            required = ['ASSERTION_AUDIT','ATS_STRUCTURAL_QA','JD_COVERAGE','RECRUITER_SCAN',
                        'HM_CREDIBILITY','DIFFERENTIATION','HUMAN_VOICE','CROSS_SURFACE',
                        'RENDERING','EXTRACTION_QA','FINAL_RED_TEAM']
            if any(stages.get(name)!='PASS' for name in required):
                raise ValueError('Final submission readiness lacks completed checks')


def observe_vendor(url, *, identity_confirmed=False):
    from urllib.parse import urlparse
    parsed = urlparse(url); host = (parsed.hostname or '').lower()
    if parsed.scheme not in ['http','https'] or not host or parsed.username:
        return {'vendor':None,'status':'UNKNOWN','observed_url':None}
    domains = {'myworkdayjobs.com':'Workday','myworkdaysite.com':'Workday',
               'boards.greenhouse.io':'Greenhouse','job-boards.greenhouse.io':'Greenhouse',
               'jobs.lever.co':'Lever','jobs.ashbyhq.com':'Ashby','icims.com':'iCIMS',
               'taleo.net':'Taleo','successfactors.com':'SAP SuccessFactors','sapsf.com':'SAP SuccessFactors',
               'jobs.smartrecruiters.com':'SmartRecruiters','apply.workable.com':'Workable'}
    vendor = next((v for d,v in domains.items() if host==d or host.endswith('.'+d)),None)
    return {'vendor':vendor,'status':'CONFIRMED' if vendor and identity_confirmed else 'LIKELY' if vendor else 'UNKNOWN',
            'observed_url':url,'company_match_confirmed':identity_confirmed}

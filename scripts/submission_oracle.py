"""Development reference for submitted-version integrity; not product runtime."""
from copy import deepcopy
from datetime import datetime
import hashlib


def resume_hash(resume):
    from scripts.context_pack import canonical
    return hashlib.sha256(canonical(resume)).hexdigest()


def validate_submissions(pack):
    for path, app in pack.items():
        if not path.startswith('applications/'):
            continue
        resumes = {r['id']: r for r in app.get('resume_versions') or [] if r}
        submissions = {s['id']: s for s in app.get('submissions') or [] if s}
        for submission in submissions.values():
            resume = resumes.get(submission.get('resume_version_id'))
            if not resume or submission.get('user_confirmed') is not True:
                raise ValueError('Submission needs confirmed event and same-opportunity resume')
            if not submission.get('submitted_at'):
                raise ValueError('Submission date is Unknown')
            try:
                datetime.fromisoformat(submission['submitted_at'].replace('Z', '+00:00'))
            except ValueError:
                raise ValueError('Invalid actual submission date') from None
            if submission.get('resume_sha256') and submission['resume_sha256'] != resume_hash(resume):
                raise ValueError('Frozen resume hash mismatch')
        for interview in app.get('interviews') or []:
            round_ = interview.get('round') or {}
            sid, rid = round_.get('submission_id'), round_.get('resume_version_id')
            if sid and (sid not in submissions or rid != submissions[sid]['resume_version_id']):
                raise ValueError('Interview submission/resume mismatch')
            if rid and rid not in resumes:
                raise ValueError('Interview resume is not in this opportunity')


def preserve_submissions(current, incoming):
    for path, app in current.items():
        if not path.startswith('applications/'):
            continue
        new = incoming.get(path) or {}
        records = {s['id']: s for s in new.get('submissions') or [] if s}
        resumes = {r['id']: r for r in new.get('resume_versions') or [] if r}
        old_resumes = {r['id']: r for r in app.get('resume_versions') or [] if r}
        for submission in app.get('submissions') or []:
            if not submission:
                continue
            rid = submission['resume_version_id']
            if records.get(submission['id']) != submission or resumes.get(rid) != old_resumes[rid]:
                raise ValueError('Submitted record or frozen resume changed/lost')


def freeze(app, resume_id, submission_id, submitted_at, jd_text, *, user_confirmed=False):
    if not user_confirmed or not submitted_at:
        raise ValueError('Actual submission confirmation/date required')
    datetime.fromisoformat(submitted_at.replace('Z', '+00:00'))
    result = deepcopy(app)
    if any(s and s['id'] == submission_id for s in result.get('submissions') or []):
        raise ValueError('Submission ID already frozen')
    resume = next((r for r in result.get('resume_versions') or [] if r and r['id'] == resume_id), None)
    if not resume or resume.get('opportunity_id') != app['opportunity_id']:
        raise ValueError('Same-opportunity resume required')
    record = {'id': submission_id, 'opportunity_id': app['opportunity_id'],
              'resume_version_id': resume_id, 'submitted_at': submitted_at, 'user_confirmed': True,
              'jd_text': jd_text, 'resume_sha256': resume_hash(resume),
              'answers': deepcopy(app.get('answers')), 'cover_letter': app.get('cover_letter')}
    result['submissions'] = [*(result.get('submissions') or []), record]
    # Lifecycle is a separate explicit event; freezing does not infer status.
    return result


def select_submitted_resume(app, submission_id=None):
    records = [s for s in app.get('submissions') or [] if s and s.get('user_confirmed') is True]
    if submission_id:
        records = [s for s in records if s['id'] == submission_id]
    if not records:
        return None  # Request actual submitted copy, never substitute newest Master.
    if len(records) > 1:
        try:
            def date(s):
                value = datetime.fromisoformat(s['submitted_at'].replace('Z', '+00:00'))
                if value.tzinfo is None:
                    raise ValueError('Timezone missing')
                return value.timestamp()
            latest = max(date(s) for s in records)
            records = [s for s in records if date(s) == latest]
        except (ValueError, KeyError, TypeError):
            raise ValueError('Clarify which actual submitted version applies')
    if len(records) != 1:
        raise ValueError('Clarify which actual submitted version applies')
    record = records[0]
    return deepcopy(next(r for r in app.get('resume_versions') or [] if r and r['id'] == record['resume_version_id']))

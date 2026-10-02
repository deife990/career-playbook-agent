"""Offline requirement coverage check, not automated career decision-making."""
def check_requirements(original,evaluation):
    ids={r['id'] for r in original}; reviewed={r['requirement_id'] for r in evaluation}
    if ids!=reviewed or len(reviewed)!=len(evaluation): raise ValueError('Original requirements must all be reviewed exactly once')
    if any(r['assessment'] not in ['MET','NOT_MET','UNKNOWN'] for r in evaluation): raise ValueError('Invalid assessment')
    return True

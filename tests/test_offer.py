import pytest
from scripts.offer_oracle import check_requirements
def test_original_requirements_cannot_be_dropped():
    original=[{'id':'remote','priority':'MUST'},{'id':'growth','priority':'PREFER'}]
    with pytest.raises(ValueError): check_requirements(original,[{'requirement_id':'growth','assessment':'MET'}])
    assert check_requirements(original,[{'requirement_id':'remote','assessment':'NOT_MET'},{'requirement_id':'growth','assessment':'UNKNOWN'}])

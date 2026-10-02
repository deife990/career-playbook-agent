from scripts.common import ROOT
def test_universal_contracts_exist():
    required={'product-principles':['Beginner First','Context Before Prompt','Evidence Before Eloquence','Never Invent Career Evidence','Progressive Disclosure','Human Decision/AI Intelligence'], 'evidence-policy':['USER FACT','VERIFIED FACT','INFERENCE','RECOMMENDATION','evidence_ids','Strong Evidence','Transferable Evidence','Gap','Unknown'], 'research-policy':['retrieved_at','Community-only','No web/tool access','untrusted'], 'privacy-policy':['explicit permission','credentials/tokens','No automatic external upload'], 'ux-language':['one or two','one question at a time']}
    for file, terms in required.items():
        text=(ROOT/f'core/principles/{file}.md').read_text()
        for term in terms: assert term in text

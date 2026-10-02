from scripts.common import ROOT, frontmatter
def main():
    seen=set()
    for path in sorted((ROOT/'core/workflows').glob('w*.md')):
        meta,body=frontmatter(path)
        if meta['id'] in seen: raise ValueError('Duplicate workflow')
        seen.add(meta['id'])
        if not (ROOT/f"core/artifacts/{meta['artifact']}.md").exists(): raise ValueError('Missing output contract')
        for name in meta['capabilities']:
            if not (ROOT/f'core/capabilities/{name}.md').exists(): raise ValueError('Missing capability')
        for section in ['Purpose','Trigger','Required context','Steps','Evidence rules','Output','State updates','Fallbacks','Do not']:
            if f'## {section}\n' not in body: raise ValueError(f'Missing workflow {section}')
    print(f'Workflow contracts: {len(seen)} valid')
if __name__=='__main__': main()

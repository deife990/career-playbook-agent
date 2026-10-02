"""Deterministic distribution ZIPs; creating archives does not assert release readiness."""
import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import argparse, hashlib, re, zipfile
from scripts.common import ROOT
from scripts.build_common import build

def package():
    version=(ROOT/'VERSION').read_text().strip()
    if not re.fullmatch(r'(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?',version):
        raise ValueError('Invalid semantic version')
    destination=ROOT/'dist/releases';destination.mkdir(parents=True,exist_ok=True)
    outputs=[]
    for platform in ['chatgpt','claude']:
        root=build(platform); archive=destination/f'careerpilot-{platform}-v{version}.zip'
        with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
            for path in sorted(root.rglob('*')):
                if not path.is_file(): continue
                name=path.relative_to(root.parent).as_posix()
                entry=zipfile.ZipInfo(name,(2020,1,1,0,0,0));entry.compress_type=zipfile.ZIP_DEFLATED
                entry.create_system=3;entry.external_attr=0o100644<<16
                z.writestr(entry,path.read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
        outputs.append(archive)
    sums=destination/f'checksums-v{version}.sha256'
    sums.write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in outputs))
    return [*outputs,sums]

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--require-ready',action='store_true');args=parser.parse_args()
    if args.require_ready:
        from scripts.release_readiness import check
        check()
    for output in package(): print(output)
if __name__=='__main__': main()

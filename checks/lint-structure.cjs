// Structure + design-system ratchet. Run before every commit: node checks/lint-structure.cjs
// Fails when a rule is broken or a debt counter grows. `--tighten` lowers the baseline after debt is paid.
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const walk=d=>fs.readdirSync(path.join(root,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const errors=[],fail=m=>errors.push(m);
const css=walk('styles').filter(f=>f.endsWith('.css')),js=walk('src').filter(f=>f.endsWith('.js'));
// 1. Every module is loaded exactly once by index.html, and every loaded file exists.
const html=read('index.html'),loaded=[...html.matchAll(/(?:href|src)="((?:src|styles)\/[^"?]+)/g)].map(m=>m[1]);
for(const f of [...css,...js])if(loaded.filter(x=>x===f).length!==1)fail(`${f}: must be loaded exactly once by index.html`);
for(const f of loaded)if(!fs.existsSync(path.join(root,f)))fail(`index.html loads missing ${f}`);
// 2. No loose runtime files at the root: code lives in src/, styles in styles/.
for(const f of fs.readdirSync(root))if(/\.(js|css)$/.test(f))fail(`${f}: move into src/ or styles/`);
// 3. Colour literals only in the primitive palette.
const strip=t=>t.replace(/url\([^)]*\)/g,'').replace(/\/\*[\s\S]*?\*\//g,'');
for(const f of css)if(f!=='styles/tokens/palette.css'){const m=strip(read(f)).match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/);if(m)fail(`${f}: colour literal ${m[0]} — add/choose a token in styles/tokens/`)}
// 4. Art registry and literal asset paths point at real files.
const cast=vm.runInNewContext(read('src/content/cast.js')+';CP_CAST');
for(const f of [...Object.values(cast.scenes),...Object.values(cast.characters).flatMap(c=>Object.values(c.sprites||{}))])if(!fs.existsSync(path.join(root,'assets',f)))fail(`cast.js: missing assets/${f}`);
for(const f of [...js,'index.html'])for(const m of read(f).matchAll(/['"]assets\/([^'"+]+\.(?:png|webp|svg|jpg))['"]/g))if(!fs.existsSync(path.join(root,'assets',m[1])))fail(`${f}: missing assets/${m[1]}`);
for(const f of css)for(const m of read(f).matchAll(/url\(['"]?(\.\.\/\.\.\/assets\/[^'")]+)/g))if(!fs.existsSync(path.join(root,path.dirname(f),m[1])))fail(`${f}: missing ${m[1]}`);
// 5. Ratchet: debt may shrink, never grow.
const count=(files,re)=>files.reduce((n,f)=>n+(read(f).match(re)||[]).length,0);
const now={important:count(css,/!important/g),primitiveUses:count(css.filter(f=>!f.startsWith('styles/tokens/')),/var\(--p-/g),cssFiles:css.length,patchFiles:css.filter(f=>f.startsWith('styles/patches/')).length};
const basePath=path.join(__dirname,'lint-baseline.json'),base=JSON.parse(fs.readFileSync(basePath,'utf8'));
for(const [k,v] of Object.entries(now))if(v>base[k])fail(`ratchet ${k}: ${v} > baseline ${base[k]} (fix the cause instead of adding an override)`);
if(process.argv.includes('--tighten')&&!errors.length){fs.writeFileSync(basePath,JSON.stringify(Object.fromEntries(Object.entries(now).map(([k,v])=>[k,Math.min(v,base[k])])),null,2)+'\n');console.log('baseline tightened')}
if(errors.length){console.error(errors.map(e=>'FAIL '+e).join('\n'));process.exitCode=1}else console.log('PASS structure',JSON.stringify(now));

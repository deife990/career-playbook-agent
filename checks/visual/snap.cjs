// Visual regression capture: every story step + guide panel steps, desktop and mobile.
// Usage: node checks/visual/snap.cjs <phase>   then   node checks/visual/compare.cjs <before> <after>
const {setup,start,stable}=require('../v0140/browser.cjs');
const fs=require('fs');
const phase=process.argv[2]||'current',root=`checks/visual/output/${phase}`;fs.rmSync(root,{recursive:true,force:true});fs.mkdirSync(root,{recursive:true});
const frame=p=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
(async()=>{for(const [width,height]of [[1440,900],[390,844]]){const {browser,page:p,errors}=await setup({viewport:{width,height}});p.setDefaultTimeout(20000);let n=0;
const shot=async name=>{await frame(p);await p.screenshot({path:`${root}/${width}x${height}-${String(n++).padStart(3,'0')}-${name}.png`})};
try{await shot('title');await start(p);
for(let i=0;i<240;i++){await stable(p);
 const row=await p.evaluate(()=>({label:monogatari.state('label'),step:monogatari.state('step'),tutorial:CP_GUIDE.isOpen(),choice:!!document.querySelector('choice-container')}));
 await shot(`${row.label}-${row.step}`);
 if(row.label==='Finish')break;
 if(row.tutorial){for(const s of ['S01','S04','S05']){await p.evaluate(s=>CP_GUIDE.navigate('example',s),s);await shot(`guide-${s}`)}await p.evaluate(async()=>{CP_GUIDE.navigate('example','S05');await CP_GUIDE.close({reason:'complete'})});continue}
 if(row.choice){const c=p.locator('choice-container button');await (row.label==='E03'?c.filter({hasText:'지금은 이야기 계속'}):c.first()).click();continue}
 await p.evaluate(()=>advance());const now=await p.evaluate(()=>monogatari.state('label')+':'+monogatari.state('step'));if(now===row.label+':'+row.step)await p.evaluate(()=>advance())}
fs.writeFileSync(`${root}/${width}x${height}-errors.json`,JSON.stringify(errors,null,2));console.log(`${width}x${height}: ${n} shots, ${errors.length} page errors`)}finally{await browser.close()}}})().catch(e=>{console.error(e);process.exitCode=1});

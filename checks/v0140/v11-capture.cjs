const {setup,start,jump,stable,fs}=require('./browser.cjs');
const path=require('node:path');const phase=process.argv[2]||'after';const dir='checks/v0140/output/v11/'+phase;fs.mkdirSync(dir,{recursive:true});
(async()=>{const rows=[];for(const [width,height]of [[1440,900],[390,844],[320,667],[800,450]]){
 const {page:p,browser,errors}=await setup({viewport:{width,height}});p.setDefaultTimeout(20000);
 async function next(){await p.evaluate(()=>advance());await stable(p);await frame()}
 const frame=()=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 async function until(f){for(let n=0;n<65;n++){if(await p.evaluate(f))return;await next()}throw Error('scene not reached')}
 async function shot(name){await frame();await p.evaluate(()=>Promise.all([...document.images].filter(x=>x.getClientRects().length).map(x=>x.decode().catch(()=>{}))));const file=`${width}x${height}-${name}.png`;await p.screenshot({path:path.join(dir,file)});rows.push({file,...await p.evaluate(()=>({label:monogatari.state('label'),step:monogatari.state('step'),text:document.querySelector('text-box').innerText,theme:document.body.dataset.messenger,bubble:document.body.dataset.presentation,overflow:document.documentElement.scrollWidth>innerWidth+1}))})}
 try{await start(p);await jump(p,'Start');await shot('salary');await until(()=>String(monogatari.label()[monogatari.state('step')]).startsWith('notice '));await shot('company');await until(()=>document.body.dataset.messenger==='teams');await shot('teams');
 await jump(p,'E01');await shot('caption');await jump(p,'E05');await until(()=>monogatari.label()[monogatari.state('step')]==='s 응.');await shot('reaction');
 await jump(p,'Promise');await until(()=>!!document.querySelector('choice-container'));await shot('choice');
 await jump(p,'E02');await shot('iseo-arrival');await next();await next();await next();await shot('iseo');
 await p.evaluate(()=>monogatari.storage({c3:'A'}));await jump(p,'E05Last');await next();await next();await shot('home-dialogue');
 await jump(p,'CardLesson');await until(()=>!!document.querySelector('choice-container'));await shot('reply-choice');if(errors.length)throw Error(errors.join('\n'));
 }finally{await browser.close()}console.log('captured',phase,width,height)}fs.writeFileSync(path.join(dir,'measurements.json'),JSON.stringify(rows,null,2));})().catch(e=>{console.error(e);process.exitCode=1});

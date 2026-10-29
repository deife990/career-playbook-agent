const {chromium}=require('/Users/jhwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
const phase=process.argv[2]||'after',dir=path.join(process.argv[3]||'checks/v0140/output/alerts-iseo',phase);fs.mkdirSync(dir,{recursive:true});
(async()=>{const browser=await chromium.launch(),rows=[];try{
 for(const [width,height]of [[1440,900],[390,844],[320,667],[800,450]])for(const font of [18,24]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});await context.addInitScript(f=>localStorage.setItem('CPEpisodeFont',String(f)),font);
  const p=await context.newPage();p.setDefaultTimeout(20000);const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8922');await p.waitForFunction(()=>ready);
  const frame=()=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const stable=()=>p.waitForFunction(()=>settled&&!busy&&!restoring&&!transitioning);
  async function next(){await p.evaluate(()=>advance());await stable();await frame()}
  async function jump(label){await p.evaluate(async label=>{CP_GUIDE.reset();bridge.tutorial.active=false;monogatari.action('Choice').blocking=false;document.querySelectorAll('choice-container').forEach(n=>n.remove());await monogatari.run('show scene cafe',false);await monogatari.run('jump '+label,false);syncStoryUI()},label);await stable();await frame()}
  async function until(fn){for(let i=0;i<50;i++){if(await p.evaluate(fn))return;await next()}throw Error('scene not reached')}
  async function shot(name){await frame();await p.evaluate(()=>Promise.all([...document.images].filter(n=>n.getClientRects().length).map(n=>n.decode().catch(()=>{}))));const file=`${width}x${height}-${font}px-${name}.png`;await p.screenshot({path:path.join(dir,file)});const measure=await p.evaluate(()=>{const rect=s=>{const n=document.querySelector(s);return n?{...n.getBoundingClientRect().toJSON(),visible:!n.hidden&&getComputedStyle(n).display!=='none'&&getComputedStyle(n).visibility!=='hidden',scrollHeight:n.scrollHeight,clientHeight:n.clientHeight}:null};return{label:monogatari.state('label'),step:monogatari.state('step'),alert:rect('#message-arrival'),alertText:$('message-arrival').innerText,phone:rect('#story-phone'),caption:rect('text-box'),reaction:rect('.phone-reaction'),iseo:rect('#message-cast .message-iseo'),overflow:document.documentElement.scrollWidth>innerWidth+1}});rows.push({file,width,height,font,name,...measure})}
  await p.locator('#start').click();await stable();await jump('Start');await shot('salary-before');await next();await shot('salary-after');await until(()=>typeof monogatari.label()[monogatari.state('step')]==='string'&&monogatari.label()[monogatari.state('step')].startsWith('notice '));await shot('notice');
  await until(()=>document.body.dataset.messageOnly==='true'&&document.body.dataset.messenger==='teams');await shot('teams');
  await jump('E05');await next();await shot('schedule');
  await jump('E02');await shot('iseo-arrival');await next();await next();await shot('iseo-front');await next();await shot('seoan-reply');await next();await shot('iseo-concerned');await next();await next();await shot('iseo-smile');await next();await shot('pub-return');
  await p.evaluate(()=>monogatari.storage({c3:'A'}));await jump('C3_CALL_A');await shot('ending-message');
  if(errors.length)throw Error(JSON.stringify(errors));await context.close();console.log('captured',phase,width,height,font);
 }
 fs.writeFileSync(path.join(dir,'measurements.json'),JSON.stringify(rows,null,2));console.log('PASS alerts-iseo captures',phase,rows.length);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});

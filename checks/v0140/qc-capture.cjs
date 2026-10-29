const {chromium}=require('/Users/jhwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
const phase=process.argv[2]||'latest',dir=path.join('checks/v0140/output/qc-current',phase);
fs.mkdirSync(dir,{recursive:true});
(async()=>{const browser=await chromium.launch();const rows=[];try{
 for(const [width,height] of [[1440,900],[390,844],[320,667],[800,450]])for(const font of [18,24]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  await context.addInitScript(size=>localStorage.setItem('CPEpisodeFont',String(size)),font);
  const p=await context.newPage();p.setDefaultTimeout(15000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:8922');await p.waitForFunction(()=>ready);
  const stable=()=>p.waitForFunction(()=>settled&&!busy&&!restoring&&!transitioning);
  async function shot(name){
   await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(n=>n.getClientRects().length).map(n=>n.decode().catch(()=>{})));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
   const file=`${width}x${height}-${font}px-${name}.png`;await p.screenshot({path:path.join(dir,file)});
   const measures=await p.evaluate(()=>{const box=selector=>{const n=document.querySelector(selector);if(!n)return null;const r=n.getBoundingClientRect(),s=getComputedStyle(n);return{x:r.x,y:r.y,width:r.width,height:r.height,scrollHeight:n.scrollHeight,clientHeight:n.clientHeight,scrollTop:n.scrollTop,display:s.display,visibility:s.visibility,color:s.color,background:s.backgroundColor,font:s.fontSize}};return{phone:box('#story-phone'),reaction:box('.phone-reaction'),dialogue:box('text-box'),next:box('#next'),close:box('dialog[open] header button'),sheet:box('.character-sheet-image'),header:box('dialog[open] header'),restore:box('.restore-ui'),captures:document.querySelectorAll('#tutorial-dialog .tutorial-capture img').length,readSize:getComputedStyle(document.documentElement).getPropertyValue('--read-size'),label:monogatari.state('label'),step:monogatari.state('step'),overflow:document.documentElement.scrollWidth>innerWidth+1}});
   rows.push({file,name,width,height,font,...measures});
  }
  async function scrollDialog(){await p.locator('dialog[open]').evaluate(n=>{const b=n.querySelector('.guide-body');if(b&&b.scrollHeight>b.clientHeight+1)b.scrollTop=b.scrollHeight;n.scrollTop=n.scrollHeight})}
  async function jump(label){await p.evaluate(async label=>{CP_GUIDE.reset();bridge.tutorial.active=false;monogatari.action('Choice').blocking=false;document.querySelectorAll('choice-container').forEach(n=>n.remove());await monogatari.run('show scene cafe',false);await monogatari.run('jump '+label,false);syncStoryUI()},label);await stable()}
  async function next(){await p.locator('#next').click();await stable()}
  async function until(fn){for(let i=0;i<110;i++){if(await p.evaluate(fn))return;await p.evaluate(()=>advance());await stable()}throw Error('unreachable scene')}
  await shot('title');await p.locator('#welcome').evaluate(n=>n.scrollTop=n.scrollHeight);await shot('title-scrolled');await p.locator('#welcome').evaluate(n=>n.scrollTop=0);
  await p.locator('#title-gallery').click();await shot('gallery');await scrollDialog();await shot('gallery-scrolled');await p.keyboard.press('Escape');
  await p.locator('#title-characters').click();await shot('characters');await scrollDialog();await shot('characters-scrolled');await p.keyboard.press('Escape');
  await p.locator('#start').click();await stable();await shot('opening');
  await jump('Start');await until(()=>CP_ALERTS.current()?.kind==='bank');await shot('salary-before');await next();await shot('salary-after');await next();await next();await shot('notice');
  await until(()=>document.body.dataset.messenger==='teams'&&document.body.dataset.messageOnly==='true');await p.locator('#phone-next').click();await stable();
  await p.locator('#phone-body').evaluate(n=>n.scrollTop=0);await shot('messages');await p.keyboard.press('h');await shot('messages-art');await p.locator('.restore-ui').click();await shot('messages-restored');
  await p.evaluate(()=>CP_GUIDE.open({flow:'install',stepId:'I02',owner:'title',returnTarget:'title'}));await shot('install');await scrollDialog();await shot('install-scrolled');await p.keyboard.press('Escape');
  await p.evaluate(()=>CP_GUIDE.open({flow:'example',stepId:'S04',owner:'title',returnTarget:'title'}));await shot('s04');await p.locator('#tutorial-dialog .guide-footer .guide-primary').click();await shot('s04-corrected');await p.keyboard.press('Escape');
  await p.evaluate(()=>{CP_GUIDE.open({flow:'practice',stepId:'P02',owner:'preparation',returnTarget:'preparation'})});await scrollDialog();await shot('practice-scrolled');await p.keyboard.press('Escape');if(await p.locator('#preparation').evaluate(n=>n.open))await p.keyboard.press('Escape');
  await jump('Start');await until(()=>!!document.querySelector('choice-container'));await shot('choice');
  await jump('Finish');await shot('ending');
  if(errors.length)throw Error(JSON.stringify(errors));await context.close();console.log(`captured ${phase} ${width}x${height} ${font}px`);
 }
 fs.writeFileSync(path.join(dir,'measurements.json'),JSON.stringify(rows,null,2));console.log('PASS qc captures',phase,rows.length);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});

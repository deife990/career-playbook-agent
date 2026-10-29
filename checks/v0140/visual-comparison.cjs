const {chromium}=require('/Users/jhwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const version=process.argv[2]||'after',base=version==='before'?'http://127.0.0.1:8926':'http://127.0.0.1:8922';
const dir=path.join('checks/v0140/output/comparison',version);fs.mkdirSync(dir,{recursive:true});
const sizes=[[1440,900],[390,844],[320,667],[800,450]], rows=[];
(async()=>{const browser=await chromium.launch();try{
 for(const [width,height] of sizes)for(const font of [18,24]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});await context.addInitScript(size=>localStorage.setItem('CPEpisodeFont',String(size)),font);
  const p=await context.newPage();p.setDefaultTimeout(12000);let errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base);await p.waitForFunction(()=>ready);
  async function shot(name){
   await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const file=width+'x'+height+'-'+font+'px-'+name+'.png';await p.screenshot({path:path.join(dir,file)});
   const m=await p.evaluate(()=>{const d=document.querySelector('#tutorial-dialog[open]'),pr=document.querySelector('#preparation[open]'),button=d?.querySelector('.guide-body>.guide-primary,.practice-results>.guide-primary,.guide-footer>.guide-primary'),field=pr?.querySelector('#request');return{dialogHeader:d?.querySelector('.guide-header')?.getBoundingClientRect().height??null,primaryY:button?.getBoundingClientRect().top??null,requestY:pr?.dataset.view==='request'?field?.getBoundingClientRect().top:null,requestActionY:pr?.dataset.view==='request'?document.querySelector('#save-external').getBoundingClientRect().top:null,officeTop:document.querySelector('#office-scene')?.hidden?null:document.querySelector('#office-scene').getBoundingClientRect().top,narrativeTop:document.querySelector('#narrative-art')?.hidden?null:document.querySelector('#narrative-art').getBoundingClientRect().top,active:document.activeElement?.outerHTML?.slice(0,120),overflow:document.documentElement.scrollWidth>innerWidth+1}});
   rows.push({file,width,height,font,name,...m});assert(!m.overflow,file+' horizontal overflow');
  }
  async function stable(){await p.waitForFunction(()=>settled&&!busy&&!restoring&&!transitioning)}
  async function jump(label){await p.evaluate(async label=>{CP_GUIDE.reset();bridge.tutorial.active=false;monogatari.action('Choice').blocking=false;document.querySelectorAll('choice-container').forEach(n=>n.remove());await monogatari.run('show scene cafe',false);await monogatari.run('jump '+label,false);syncStoryUI()},label);await stable()}
  async function until(fn){for(let i=0;i<100;i++){if(await p.evaluate(fn))return;await p.evaluate(()=>advance());await stable()}throw Error('scene unreachable')}
  await shot('title');
  await p.locator('#start').click();await stable();await shot('opening');
  await jump('RecallHold');await shot('recall');
  await jump('E01Talk');await shot('dialogue');await p.evaluate(()=>$('vn-hide').click());await shot('quiet');await p.evaluate(()=>$('vn-hide').click());
  await until(()=>!!document.querySelector('choice-container'));await shot('choice');
  await jump('Start');await until(()=>document.body.dataset.messenger==='teams'&&document.body.dataset.messageOnly==='true');await p.evaluate(()=>advance());await stable();await shot('teams-two');
  await jump('E02');await until(()=>document.body.dataset.messageOnly==='true');await shot('message');
  await p.evaluate(()=>changePanel('cards'));await shot('preparation');await p.evaluate(()=>changePanel('request','first'));await shot('request');
  await p.evaluate(()=>CP_GUIDE.open({flow:'example',stepId:'S04',owner:'preparation',returnTarget:'preparation'}));await shot('s04-before');await p.evaluate(()=>CP_GUIDE.dispatch({type:'REVEAL_CORRECTION'}));await shot('s04-after-dialogue');
  if(width<=700){const tab=p.locator('.tutorial-page-tabs button').last();await tab.click()}await shot('s04-after-notes');
  await p.evaluate(()=>{CP_GUIDE.reset();bridge.practice=null;CP_GUIDE.open({flow:'practice',stepId:'P02',owner:'preparation',returnTarget:'preparation'})});await shot('p02-ready');await p.evaluate(()=>CP_PRACTICE.state('returned'));await shot('p02-returned');
  await p.evaluate(()=>{CP_GUIDE.reset();changePanel('settings')});await shot('settings');
  assert.deepEqual(errors,[]);await context.close();
 }
 fs.writeFileSync(path.join(dir,'measurements.json'),JSON.stringify(rows,null,2));console.log('PASS visual',version,rows.length);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});

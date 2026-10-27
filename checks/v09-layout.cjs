const fs=require('fs');const {chromium}=require('/Users/jhwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='/tmp/cp-v09-qa';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});const errors=[],results=[];try{for(const width of [1440,390]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});await page.goto('http://127.0.0.1:8774/');await page.locator('#start').waitFor({state:'visible'});await page.screenshot({path:out+'/'+width+'-title.png'});await page.locator('#start').click();
 const stable=async()=>{await page.waitForFunction(()=>ready&&settled&&!transitioning&&!busy&&stableStatement(monogatari.label()?.[monogatari.state('step')]),{timeout:20000});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));};await stable();
 const jump=async(label,step=null,service='ChatGPT')=>{await page.evaluate(async({label,service})=>{bridge.service=service;await monogatari.run('jump '+label,false);},{label,service});await stable();if(step!==null){for(let n=0;n<30;n++){const current=await page.evaluate(()=>monogatari.state('step'));if(current>=step)break;await page.evaluate(()=>advance());await stable();}}};
 const shot=async(name)=>{await page.screenshot({path:out+'/'+width+'-'+name+'.png'});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('page overflow '+name);};
 for(const label of ['RecallDesk','RecallPeople','RecallHold','P02','E01Talk']){await jump(label);await shot(label);}
 await jump('E01');const badge=await page.evaluate(()=>CP_STORY.script.E01.findIndex(s=>typeof s==='string'&&s.startsWith('목에 걸린')));await jump('E01',badge);await shot('badge');
 await jump('Start',3);await shot('phone');await jump('Start',7);await shot('teams');
 await jump('E02');await shot('arrival');const ix=await page.evaluate(()=>CP_STORY.script.E02.findIndex(x=>typeof x==='string'&&x.startsWith('i ')));await jump('E02',ix);await shot('iseo');
 for(const service of ['ChatGPT','Claude']){
  await jump('TutorLinear',null,service);await page.evaluate(()=>{bridge.wizardStep=0;document.querySelector('#linear-story').dataset.renderKey='';CP_WIZARD.render(document.querySelector('#linear-story'),true);});
  await shot('wizard-'+service+'-0');const download=page.waitForEvent('download');await page.locator('#linear-story a[download]').click();await download;
  for(let i=0;i<5;i++){if(i===1||i===4)await shot('wizard-'+service+'-'+i);await page.locator('#linear-story .wizard-footer .wizard-next').click();await page.waitForTimeout(70);}
  await stable();if(await page.evaluate(()=>monogatari.state('label'))!=='TutorRequest')throw Error('Wizard did not reach first request');await shot('first-use-'+service);
 }
 await page.evaluate(()=>checkpoint());await page.reload();await page.locator('#resume').click();await stable();await shot('resume');
 await jump('CardLesson',3);await shot('kakao');await jump('Finish');await shot('ending');
 const endButtons=await page.locator('#end-actions button').evaluateAll(ns=>ns.map(n=>({text:n.textContent,h:n.clientHeight,sh:n.scrollHeight,w:n.clientWidth,sw:n.scrollWidth})));if(endButtons.some(n=>n.sh>n.h+2||n.sw>n.w+2))throw Error('Ending button clipped');
 await page.locator('#today').click();if(!await page.locator('#request').isVisible())throw Error('Today button wrong');await page.locator('#close-prep').click();await page.locator('#get-plugin').click();await shot('wizard-service');await page.locator('#linear-panel .wizard-service').filter({hasText:'Claude'}).click();const download=page.waitForEvent('download');await page.locator('#linear-panel a[download]').click();await download;for(let i=0;i<8;i++)await page.locator('#linear-panel .wizard-footer .wizard-next').click();await shot('wizard-complete');
 results.push({width,pass:true,endButtons});await context.close();
 }}finally{await browser.close();}fs.writeFileSync(out+'/results.json',JSON.stringify({results,errors},null,2));if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({results,errors}));})().catch(e=>{console.error(e);process.exitCode=1});

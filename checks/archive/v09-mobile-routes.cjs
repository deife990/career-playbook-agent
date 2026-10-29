const fs=require('fs'),{chromium}=require('/Users/jhwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
fs.mkdirSync('/tmp/cp-v09-qa',{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});const errors=[],routes=[];try{for(const service of ['ChatGPT','Claude']){
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8774/');await page.locator('#start').click();
 const stable=async()=>{await page.waitForFunction(()=>ready&&settled&&!transitioning&&!busy&&stableStatement(monogatari.label()?.[monogatari.state('step')]));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));};await stable();let ended=false;const labels=new Set();
 for(let n=0;n<260;n++){
  if(await page.locator('#preparation').evaluate(n=>n.open))await page.locator('#close-prep').click();await stable();
  const state=await page.evaluate(()=>({label:monogatari.state('label'),step:monogatari.state('step'),choice:!!document.querySelector('choice-container'),end:finished(),phone:document.body.dataset.messageOnly,device:document.body.dataset.device,line:monogatari.label()?.[monogatari.state('step')]}));labels.add(state.label);if(['P02','E01Talk','RecallDesk','RecallPeople','RecallHold','TutorChatGPTContext','TutorClaudeContext'].includes(state.label))await page.screenshot({path:'/tmp/cp-v09-qa/mobile-route-'+service+'-'+state.label+'.png'});
  if(state.end){ended=true;await page.screenshot({path:'/tmp/cp-v09-qa/mobile-route-'+service+'-ending.png'});break;}
  if(state.label==='TutorLinear'){
   const download=page.waitForEvent('download');await page.locator('#linear-story a[download]').click();await download;for(let i=0;i<5;i++)await page.locator('#linear-story .wizard-footer .wizard-next').click();continue;
  }
  if(state.label==='E02'&&typeof state.line==='string'&&state.line.startsWith('i ')){
   if(state.phone!=='true'||!await page.locator('#phone-next').isVisible())throw Error('No Iseo phone '+JSON.stringify(state));await page.screenshot({path:'/tmp/cp-v09-qa/mobile-route-'+service+'-iseo.png'});
  }
  if(state.label==='CardLesson'&&typeof state.line==='string'&&state.line.includes('집에 도착했다는'))await page.screenshot({path:'/tmp/cp-v09-qa/mobile-route-'+service+'-kakao.png'});
  if(state.choice){if(state.label==='TutorInstallPick')await page.locator('choice-container button').filter({hasText:service+'로 시작'}).click();else await page.locator('choice-container button').first().click();}
  else if(await page.locator('#phone-next').isVisible())await page.locator('#phone-next').click();else await page.locator('#next').click();
 }
 if(!ended)throw Error('No ending '+service);routes.push({service,ended,labels:labels.size});await context.close();
 }}finally{await browser.close();}console.log(JSON.stringify({routes,errors}));if(errors.length)throw Error(errors.join('\n'));})().catch(e=>{console.error(e);process.exitCode=1});

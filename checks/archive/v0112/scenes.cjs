const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('/Users/jhwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true}),results=[],errors=[];
 try{
  for(const [width,height] of [[1280,720],[800,450],[375,812]]){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await context.newPage();
   p.on('pageerror',e=>errors.push(e.stack));
   p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
   const stable=async()=>{await p.waitForFunction(()=>ready&&settled&&!busy&&!transitioning&&stableStatement(monogatari.label()?.[monogatari.state('step')]));await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))};
   const scene=async(label,match)=>{
    await p.evaluate(label=>{monogatari.action('Choice').blocking=false;return monogatari.run('jump '+label,false)},label);await stable();
    if(match){await p.evaluate(async({label,match})=>{const list=CP_STORY.script[label],step=list.findIndex(s=>typeof s==='string'&&s.startsWith(match));if(step<0)throw Error('missing '+match);monogatari.state({step});await monogatari.run(list[step],false);syncStoryUI();syncSceneEffects()},{label,match});await stable()}
   };
   const shot=async name=>{await p.evaluate(()=>Promise.all([...document.images].filter(i=>!i.hidden).map(i=>i.decode().catch(()=>{}))));await p.screenshot({path:`review/v0112/${width}-${name}.png`})};
   const bounds=sel=>p.locator(sel).evaluate(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}});
   const phone=async()=>{const r=await bounds('#story-phone');assert(Math.abs(r.x+r.width/2-width/2)<1,'phone not centered');assert(r.y>=0&&r.bottom<=height,'phone outside viewport');assert.equal(await p.locator('.phone-owner').count(),0);return r};
   await p.goto('http://127.0.0.1:8774/?v=0.11.2');await p.waitForFunction(()=>ready);await p.locator('#start').click();await stable();
   for(const label of ['Opening','WalkHome','RecallDesk','RecallPeople','RecallHold','WalkQuestion']){await scene(label);assert.equal(await p.locator('#opening-skip').count(),0);if(label==='RecallHold'){
    assert.equal(await p.locator('.window-lights i').count(),3);assert.equal((await p.locator('.mail-app-brand').innerText()).replace(/\s+/g,' '),'✉ Offlook');assert(await p.locator('#recall-yoon').isVisible());assert.equal(await p.locator('#memory-notice img').count(),0);assert.equal(await p.locator('body').getAttribute('data-voice'),'thought');await shot('mail');
   }}
   await scene('Start','phone 급여');let r=await phone();assert(r.bottom<=(await bounds('text-box')).y,'phone covered by dialogue');assert((await p.locator('.push-app').innerText()).includes('토즈'));assert(await p.locator('#phone-person').isHidden());await shot('salary');
   await scene('Start','notice ');await phone();assert.equal(await p.locator('#phone-app').innerText(),'Offlook');assert((await p.locator('.mobile-mail').innerText()).includes('파크별 세부 운영안은 추후 안내합니다.'));await shot('notice');
   await scene('Start','y ');await phone();assert(!(await p.locator('#story-phone').innerText()).includes('이야기 속'));await shot('teams');
   await scene('E02');const banner=await bounds('#message-arrival');assert(banner.x>=0&&banner.right<=width);await shot('arrival');
   for(const [prefix,pose]of [['i 서안아','front'],['i 나도 맨날','concerned'],['i 그중에','smile']]){
    await scene('E02',prefix);r=await phone();assert(await p.locator('#message-cast').isVisible());assert((await p.locator('#iseo-expression').getAttribute('src')).includes(pose));assert((await p.locator('#phone-avatar').getAttribute('src')).includes(pose));assert((await p.locator('#narrative-image').getAttribute('src')).endsWith('lake-pub-night.png'));assert(await p.locator('#remote-person').isHidden());assert(await p.locator('text-box').evaluate(n=>getComputedStyle(n).visibility==='hidden'));assert(await p.locator('#phone-next').isVisible());await shot('iseo-'+pose);
    if(width>600){const left=await bounds('.message-iseo'),right=await bounds('.message-seoan');assert(left.right<=r.x+1,'Iseo overlaps phone');assert(right.x>=r.right-1,'Seoan overlaps phone')}
   }
   await scene('E02','서안이 답장을');assert(await p.locator('#message-cast').isHidden());
   await scene('TutorInstallPick');for(let i=0;i<3;i++){await p.locator('#next').click();await stable()}await p.waitForSelector('choice-container button[data-service-brand]');assert.equal(await p.locator('choice-container button[data-service-brand]').count(),2);await shot('service');
   // Keep old save coordinates and reload the first Iseo message without any panel.
   await scene('E02','i 서안아');const pos=await p.evaluate(async()=>{await checkpoint();return {label:monogatari.state('label'),step:monogatari.state('step')}});await p.reload();await p.locator('#resume').click();await stable();assert.deepEqual(await p.evaluate(()=>({label:monogatari.state('label'),step:monogatari.state('step')})),pos);assert(await p.locator('#message-cast').isVisible());await phone();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   results.push({width,height,scenes:'recall/mail/push/notice/Teams/Iseo/service/save-resume',passed:true});console.log('PASS scenes',width);await context.close();
  }
  // Motion runs once on scene mode change; no movement with reduced motion.
  for(const reducedMotion of ['no-preference','reduce']){
   const context=await browser.newContext({viewport:{width:1280,height:720},reducedMotion}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.stack));await p.goto('http://127.0.0.1:8774/');await p.waitForFunction(()=>ready);await p.locator('#start').click();await p.waitForFunction(()=>settled&&!transitioning);
   const frames=await p.evaluate(async()=>{await monogatari.run('jump E02',false);const step=CP_STORY.script.E02.findIndex(s=>typeof s==='string'&&s.startsWith('i '));monogatari.state({step});await monogatari.run(CP_STORY.script.E02[step],false);syncStoryUI();const phone=document.getElementById('story-phone');return phone.getAnimations().map(a=>a.effect.getKeyframes().map(f=>f.transform))});
   assert.equal(frames.length>0,reducedMotion==='no-preference');if(frames.length)assert(frames.some(f=>f[0]!==f.at(-1)));
   results.push({motion:reducedMotion,frames,passed:true});await context.close();
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();fs.writeFileSync('review/v0112/scenes.json',JSON.stringify({results,errors},null,2))}
})().catch(e=>{console.error(e);process.exitCode=1});

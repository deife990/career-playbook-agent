const fs=require('fs'),assert=require('node:assert/strict');const {chromium}=require('/Users/jhwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='review/v011';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});const errors=[],routes=[];try{
for(const [width,height]of [[1280,720],[800,450],[375,812]])for(const service of ['Claude','ChatGPT']){
const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});const p=await ctx.newPage();p.setDefaultTimeout(7000);p.on('pageerror',e=>errors.push({width,service,error:e.stack}));p.on('response',r=>{if(r.status()>=400)errors.push({url:r.url(),status:r.status()})});
const stable=async()=>{await p.waitForFunction(()=>ready&&settled&&!transitioning&&!busy&&stableStatement(monogatari.label()?.[monogatari.state('step')]));await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))};
const shot=async tag=>{await p.screenshot({path:out+'/'+width+'-'+service+'-'+tag+'.png'})};
await p.goto('http://127.0.0.1:8774/');await p.waitForFunction(()=>ready);await shot('title');await p.locator('#start').click();await stable();assert.equal(await p.locator('#restart-confirm').evaluate(n=>n.open),false);
let ended=false;const seen=new Set(),screens=new Set(),branch=width===1280?'A':width===800?'B':'C';let last='',repeat=0;
for(let n=0;n<340;n++){
 if(await p.locator('#preparation').evaluate(n=>n.open))await p.locator('#close-prep').click();await stable();await p.evaluate(()=>{CP_LESSON_UI.finishMessage();CP_STAGE.finishTyping()});
 const state=await p.evaluate(()=>({label:monogatari.state('label'),step:monogatari.state('step'),line:monogatari.label()?.[monogatari.state('step')],choice:!!document.querySelector('choice-container'),end:finished()}));const key=state.label+':'+state.step;if(last===key)repeat++;else repeat=0;last=key;if(repeat>4)throw Error('Stuck '+key+' '+JSON.stringify(state.line));seen.add(state.label);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow '+key);
 let tag=['Opening','RecallDesk','RecallPeople','RecallHold','WalkQuestion','P02','E01','E01Talk','E02','TutorRequest','TutorChatGPTContext','TutorClaudeContext','TutorKeep','TutorNext','E03Example','E05','E05Messages','ReplyA','ReplyB','ReplyC'].includes(state.label)?state.label:null;
 if(state.label==='Start'&&typeof state.line==='string'){if(state.line.startsWith('notice '))tag='notice';if(state.line.startsWith('y '))tag='teams';if(state.line==='똑, 똑, 똑.')tag='tap';if(state.line.startsWith('뒤를 돌아보자'))tag='middle';if(state.line.startsWith('s 저기'))tag='entrance';if(state.choice)tag='gate-choice';}
 if(state.label==='CardLesson'&&state.choice)tag='reply-choice';
 if(tag&&!screens.has(tag)){screens.add(tag);await shot(tag);}
 if(state.end){await shot('end');ended=true;break;}
 if(state.label==='TutorLinear'){
   for(let i=0;i<5;i++){assert.equal(await p.locator('#linear-story .wizard-kicker').first().innerText(),service+' · 설치 '+(i+1)+' / 5');assert(await p.locator('#linear-story .wizard-footer .wizard-next').isVisible());await shot('story-install-'+i);await p.locator('#linear-story .wizard-footer .wizard-next').click();}await stable();continue;
 }
 if(['C1_'+branch,'C2_'+branch,'C3_'+branch].includes(state.label)&&typeof state.line==='string'&&state.line.startsWith('me ')){assert(await p.locator('text-box').innerText().then(t=>t.includes(state.line.slice(3))));}
 if(['TutorRequest','TutorNext'].includes(state.label)&&!screens.has(state.label+'copy')){await p.locator('#lesson-copy').click();const copied=await p.evaluate(()=>navigator.clipboard.readText());assert(copied.includes('CareerPilot'));screens.add(state.label+'copy');}
 if(Number.isInteger(await p.evaluate(()=>TUTORIAL_LABELS[monogatari.state('label')]))){const box=await p.locator('#story-use').boundingBox(),top=await p.evaluate(()=>document.querySelector('.toolbar').getBoundingClientRect().height);assert(box.height<=(height-top)*.60+1,'card too tall');assert(await p.locator('#lesson-next').isVisible());}
 if(state.label==='Start'&&state.line==='휴대폰을 주머니에 넣고 다시 걷는다.')assert.equal(await p.locator('#story-phone').isVisible(),false);
 if(state.choice){let selector=['Start','E01Talk','Promise','CardLesson'].includes(state.label)?'choice-container [data-choice="'+branch+'"]':state.label==='TutorInstallPick'?'choice-container [data-choice="'+service+'"]':null;if(selector&&await p.locator(selector).count())await p.locator(selector).click();else await p.locator('choice-container button').first().click();}
 else if(await p.locator('#lesson-next').isVisible())await p.locator('#lesson-next').click();else await p.locator(await p.locator('#phone-next').isVisible()?'#phone-next':'#next').click();
}
assert(ended,'No ending');assert(await p.locator('#end-primary').isVisible());assert.equal(await p.locator('text-box').isVisible(),false);assert((await p.evaluate(()=>monogatari.storage('log'))).some(r=>r.text.includes('나\n')));
routes.push({width,height,service,branch,ended,labels:[...seen],screens:[...screens]});console.log('PASS',width,service,seen.size);fs.writeFileSync(out+'/routes.json',JSON.stringify({routes,errors},null,2));await ctx.close();
}
assert.deepEqual(errors,[]);console.log('ALL ROUTES PASSED');
}finally{await browser.close();fs.writeFileSync(out+'/routes.json',JSON.stringify({routes,errors},null,2))}})().catch(e=>{console.error(e);process.exitCode=1});

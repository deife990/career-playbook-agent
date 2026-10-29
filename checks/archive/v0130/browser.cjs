const {chromium}=require('/Users/jhwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.CP_BASE_URL||'http://127.0.0.1:8921';
async function setup(options={}){const browser=await chromium.launch();const context=await browser.newContext({reducedMotion:'reduce',...options});const page=await context.newPage();page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.waitForFunction(()=>ready);return{browser,context,page,errors}}
const stable=p=>p.waitForFunction(()=>settled&&!busy&&!restoring&&!transitioning);
async function start(p){await p.locator('#start').click();await stable(p)}
async function jump(p,label){await p.evaluate(async label=>{CP_GUIDE.reset();bridge.tutorial.active=false;if(label==='E03Actual')bridge.practice=null;CP_PRACTICE.restore();monogatari.action('Choice').blocking=false;document.querySelectorAll('choice-container').forEach(n=>n.remove());await monogatari.run('show scene cafe',false);await monogatari.run('jump '+label,false);syncStoryUI()},label);await stable(p)}
const step=p=>p.evaluate(()=>CP_GUIDE.state().stepId);
const action=(p,name)=>p.locator('#tutorial-dialog').getByRole('button',{name,exact:true}).click();
function report(name,value){fs.writeFileSync('checks/v0130/'+name+'.json',JSON.stringify(value,null,2));console.log('PASS '+name)}
module.exports={assert,fs,setup,stable,start,jump,step,action,report};

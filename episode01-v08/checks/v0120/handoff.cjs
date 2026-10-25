const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const requests=vm.runInNewContext(fs.readFileSync('request-data.js','utf8')+';REQUESTS');
const context={window:{},navigator:{userAgent:'',maxTouchPoints:0},location:{search:''},URLSearchParams,sessionStorage:{getItem:()=>null},REQUESTS:requests};vm.runInNewContext(fs.readFileSync('ai-handoff.js','utf8'),context);const api=context.window.CP_HANDOFF;
const cases=[
 ['Windows Claude',{provider:'Claude',ua:'Windows NT 10.0',width:1280},['standard_web','claude_desktop']],
 ['Mac small window Claude',{provider:'Claude',ua:'Macintosh',width:375},['standard_web','claude_desktop']],
 ['ChatGPT desktop',{provider:'ChatGPT',ua:'Macintosh',width:1280},['standard_web']],
 ['iPhone Claude',{provider:'Claude',ua:'iPhone OS 19',width:375},['standard_web']],
 ['iPad desktop UA',{provider:'Claude',ua:'Macintosh',maxTouchPoints:5,width:1024},['standard_web']],
 ['Android Claude',{provider:'Claude',ua:'Linux Android',width:375},['standard_web']],
 ['desktop disabled',{provider:'Claude',ua:'Linux',flags:{HANDOFF_CLAUDE_DESKTOP:false}},['standard_web']],
 ['standard disabled',{provider:'Claude',ua:'Windows',flags:{HANDOFF_STANDARD_WEB:false}},['claude_desktop']],
 ['all disabled',{provider:'Claude',ua:'Windows',flags:{HANDOFF_STANDARD_WEB:false,HANDOFF_CLAUDE_DESKTOP:false}},[]],
 ['unknown platform/flags off',{provider:'Claude',ua:'unknown',flags:{HANDOFF_SPLIT_VIEW:true}},['standard_web']],
 ['default',{},['standard_web']]
];for(const[name,input,expected]of cases)assert.deepEqual(Array.from(api.resolve(input)),expected,name);
const p={requestId:'W01_START',service:'Claude',status:'ready',returnLabel:'E04'};for(const state of api.states)assert(api.validPractice({...p,status:state}));for(const bad of[{...p,status:'launching'},{...p,returnLabel:'Start'},{...p,requestId:'evil'},{...p,service:'javascript:alert(1)'},{...p,copied:'yes'}])assert(!api.validPractice(bad));
const report={cases:cases.map(([name])=>({name,passed:true})),validation:true,passed:true};fs.writeFileSync('review/v0120/handoff.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));

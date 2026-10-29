'use strict';
// Authored requests only. This boundary never reads an external tab or AI conversation.
window.CP_HANDOFF=(()=>{
 const URLS=Object.freeze({ChatGPT:'https://chatgpt.com/',Claude:'https://claude.ai/'});
 const STATES=Object.freeze(['ready','external_opened','returned','self_reported_done','skipped','failed']);
 const DEFAULT_FLAGS=Object.freeze({HANDOFF_STANDARD_WEB:true,HANDOFF_CLAUDE_DESKTOP:true});
 let launching=false;
 function resolve(env={}){
  const flags={...DEFAULT_FLAGS,...env.flags},ua=String(env.ua||'');
  const desktop=/Windows|Macintosh|Linux|CrOS/.test(ua)&&!/Android|iPhone|iPad|iPod/.test(ua)&&!(ua.includes('Macintosh')&&Number(env.maxTouchPoints)>1);
  const paths=[];if(flags.HANDOFF_STANDARD_WEB===true)paths.push('standard_web');
  if(env.provider==='Claude'&&desktop&&flags.HANDOFF_CLAUDE_DESKTOP===true)paths.push('claude_desktop');
  // Width affects panel layout, never app selection or an automatic deep link.
  return paths;
 }
 function readFlags(){
  let flags={};try{flags=JSON.parse(sessionStorage.getItem('CPHandoffFlags')||'{}')||{}}catch{}
  const query=new URLSearchParams(location.search).get('ff');
  if(query!==null){for(const entry of query.split(',')){const match=entry.trim().match(/^([+-]?)(HANDOFF_[A-Z_]+)(?:[=:](on|off|true|false|1|0))?$/);if(match&&Object.hasOwn(DEFAULT_FLAGS,match[2]))flags[match[2]]=match[1]==='-'?false:!['off','false','0'].includes(match[3]);}try{sessionStorage.setItem('CPHandoffFlags',JSON.stringify(flags))}catch{}}
  return Object.fromEntries(Object.keys(DEFAULT_FLAGS).map(key=>[key,typeof flags[key]==='boolean'?flags[key]:DEFAULT_FLAGS[key]]));
 }
 const flags=readFlags();
 const routes=provider=>resolve({provider,ua:navigator.userAgent,width:innerWidth,maxTouchPoints:navigator.maxTouchPoints,flags});
 function validPractice(p){return !!p&&typeof p==='object'&&!Array.isArray(p)&&p.requestId==='W01_START'&&Object.hasOwn(REQUESTS,p.requestId)&&Object.hasOwn(URLS,p.service)&&STATES.includes(p.status)&&p.returnLabel==='E04'&&(p.copied===undefined||typeof p.copied==='boolean');}
 async function launch({provider,requestId,sceneId}){
  const result={mode:'standard_web',status:'failed',copied:false,saved:false};
  if(launching||!Object.hasOwn(URLS,provider)||!Object.hasOwn(REQUESTS,requestId)||!routes(provider).includes('standard_web'))return result;
  launching=true;
  try{
   // Both operations start synchronously inside the originating click handler.
   let copy;try{copy=Promise.resolve(navigator.clipboard.writeText(REQUESTS[requestId])).then(()=>true,()=>false)}catch{copy=Promise.resolve(false)}
   let tab=null;try{tab=window.open('about:blank','_blank');if(tab)tab.opener=null}catch{}
   result.copied=await copy;
   try{if(tab&&!tab.closed){tab.location.href=URLS[provider];result.status='external_opened'}}catch{}
   window.CP_PRACTICE?.acceptLaunch(result,{provider,requestId,sceneId});
   try{result.saved=await checkpoint()}catch{}
   return result;
  }finally{launching=false;}
 }
 function select(field,text){if(!field)return;field.hidden=false;field.value=text;field.focus({preventScroll:true});field.select();}
 function present(result,{provider,requestId,field,link,status}){
  const text=REQUESTS[requestId];if(!text||!Object.hasOwn(URLS,provider))return result;
  link.href=URLS[provider];link.hidden=result.status!=='failed';link.target='_blank';link.rel='noopener';
  if(result.status==='failed'){const details=link.closest('details');if(details)details.open=true;}
  if(!result.copied){select(field,text);window.addEventListener('focus',()=>{if(field?.isConnected&&field.getClientRects().length)select(field,text)},{once:true})}
  status(result.status==='failed'?'새 탭이 막혔어요. 아래 링크를 눌러주세요.'+(result.copied?' 요청은 복사됐어요.':' 선택된 요청을 직접 복사해주세요.'):result.copied?'요청을 복사했어요. '+provider+'에 붙여넣고 돌아오면 이어 읽어요.'+(result.saved?' 지금 장면도 저장했어요.':' 장면 저장은 확인하지 못했어요.'):'요청을 직접 복사해주세요. 서비스는 새 탭으로 열었어요. 선택된 문장을 복사해 붙여넣으세요.');
  return result;
 }
 function desktopURL(provider,requestId){return provider==='Claude'&&Object.hasOwn(REQUESTS,requestId)&&routes(provider).includes('claude_desktop')?'claude://claude.ai/new?q='+encodeURIComponent(REQUESTS[requestId]):null;}
 return Object.freeze({resolve,launch,present,validPractice,routes,desktopURL,urls:URLS,flags,states:STATES});
})();

'use strict';
// Practice state belongs to the story save; only UI expansion and launch locks are transient.
window.CP_PRACTICE=(()=>{
 const {el,button,logo,requestBox}=CP_GUIDE;
 let entered=false,expanded=false,picking=false,launching=false,installing=false,hidden=false,returnPending=false,resumingTerminal=false,epoch=0;
 const active=()=>playing()&&monogatari.state('label')==='E03Actual';
 const fresh=()=>({requestId:'W01_START',service:bridge.service,status:'ready',returnLabel:'E04'});
 function restore(){entered=false;expanded=picking=launching=installing=hidden=returnPending=false;epoch++;bridge.practice??=null;bridge.practicePrivacySeen??=false;resumingTerminal=monogatari.state('label')==='E03Actual'&&['skipped','self_reported_done'].includes(bridge.practice?.status);if(bridge.practice?.status==='external_opened')bridge.practice.status='returned';}
 async function save(){await new Promise(requestAnimationFrame);for(let i=0;i<120;i++){if(ready&&!restoring&&settled&&!busy&&stableStatement(monogatari.label()?.[monogatari.state('step')]))return checkpoint();await new Promise(requestAnimationFrame)}return false;}
 function context(){
  if(!active()){entered=false;return null;}
  if(!entered){entered=true;epoch++;if(resumingTerminal){resumingTerminal=false;requestAnimationFrame(()=>leave(bridge.practice.status));return null;}if(!CP_HANDOFF.validPractice(bridge.practice)||['skipped','self_reported_done'].includes(bridge.practice.status))bridge.practice=fresh();expanded=picking=launching=false;void save();}
  const p=bridge.practice,collapsed=innerWidth<1000&&p.status==='external_opened'&&!expanded;
  return{kind:'practice',index:0,story:true,service:p.service,status:p.status,collapsed,part:[p.status,collapsed,picking,launching,epoch].join('-')};
 }
 function refresh(){CP_GUIDE.sync();}
 async function state(status){if(!active()||!CP_HANDOFF.states.includes(status))return;bridge.practice.status=status;expanded=picking=false;epoch++;refresh();await save();}
 function acceptLaunch(result,info){if(!active()||info.sceneId!=='E03Actual'||info.requestId!=='W01_START')return;bridge.practice.service=info.provider;bridge.service=bridge.guideService=info.provider;bridge.practice.copied=result.copied;bridge.practice.status=result.status;bridge.practicePrivacySeen=true;expanded=false;epoch++;}
 async function start(){if(launching||!active())return;launching=true;const p=bridge.practice;
  // Do not await or route through the story engine before this call.
  const task=CP_HANDOFF.launch({provider:p.service,requestId:p.requestId,sceneId:'E03Actual'});refresh();
  try{const result=await task;if(active()){if(p.status==='ready')acceptLaunch(result,{provider:p.service,requestId:p.requestId,sceneId:'E03Actual'});launching=false;epoch++;refresh();if(!p.copied)selectRequest();}}
  finally{launching=false;if(active()){if(returnPending&&p.status==='external_opened'){returnPending=false;void state('returned')}else refresh();}}
 }
 async function leave(status,label='E04'){
  if(launching)return;bridge.practice.status=status;bridge.practicePrivacySeen=true;await save();
  monogatari.global('block',false);monogatari.action('Choice').blocking=false;
  await monogatari.run('jump '+label,false);syncStoryUI();await save();
 }
 async function example(){if(launching)return;await save();monogatari.global('block',false);await monogatari.run('jump E03Example',false);syncStoryUI();}
 function servicePicker(body){const row=el('div','practice-services');for(const service of ['ChatGPT','Claude']){const b=button('','guide-service',async()=>{bridge.practice.service=bridge.service=bridge.guideService=service;try{localStorage.setItem('CPPreferredService',service)}catch{}picking=false;epoch++;monogatari.storage({bridge});refresh();await save()});b.append(logo(service),el('strong','',service));row.append(b)}body.append(row);}
 function field(body){requestBox(body);body.querySelector('textarea').setAttribute('aria-label','복사할 실습 요청');body.querySelector('.guide-request button').textContent='다시 복사';return body.querySelector('textarea');}
 function selectRequest(){const f=document.querySelector('.guide-panel[data-kind="practice"] textarea');if(f){f.focus({preventScroll:true});f.select();}}
 function link(text,href,fn){const a=el('a','practice-link',text);a.href=href;a.target='_blank';a.rel='noopener';a.onclick=fn;return a;}
 function desktop(body,service){const url=CP_HANDOFF.desktopURL(service,'W01_START');if(!url)return;body.append(link('Claude 데스크톱 앱으로 열기',url,()=>{bridge.practice.copied=false;bridge.practicePrivacySeen=true;void state('external_opened')}));}
 async function install(){installing=true;bridge.wizardStep=-1;await changePanel('install');}
 const oldClose=closePanel;closePanel=async function(){if(installing&&active()){installing=false;bridge.practice.status='ready';bridge.practice.service=bridge.service;epoch++;}await oldClose();refresh();};$('close-prep').onclick=$('skip').onclick=closePanel;
 function updateDialogue(c){const text=document.querySelector('text-box [data-content="text"]');if(!text)return;text.textContent=c.status==='returned'?'돌아왔네. 어땠어? 한 가지라도 정리됐다면 그걸로 시작한 거야.':`이번엔 네 이야기로 해보자. 네가 쓰는 ${c.service}에서 바로 시작해 볼까?`;}
 function render(panel,c){
  panel.setAttribute('aria-label','CareerPilot 실습');panel.removeAttribute('aria-labelledby');updateDialogue(c);
  if(c.collapsed){const compact=el('div','practice-compact');compact.append(el('span','guide-tag','실습 중 · '+c.service),el('p','',bridge.practice.copied?'✓ 요청 복사됨 · 다른 탭에서 '+(c.service==='Claude'?'/careerpilot':'@CareerPilot')+'을 고르고 붙여넣어요':'요청 복사 필요 · 펼쳐서 첫 요청을 직접 복사해주세요'));const actions=el('div','practice-compact-actions');const expand=button('⌃','guide-outline',()=>{expanded=true;epoch++;refresh()});expand.setAttribute('aria-label','실습 안내 펼치기');expand.setAttribute('aria-expanded','false');actions.append(button('실습 마쳤어요','guide-primary',()=>state('returned')),expand);compact.append(actions);panel.append(compact);return;}
  const header=el('header','guide-header'),top=el('div','practice-top');top.append(el('span','guide-tag',c.status==='external_opened'?'실습 중 · '+c.service:c.status==='returned'?'실습 · 다녀온 뒤':c.status==='failed'?'실습 · 새 탭 확인':'실습 · 내 이야기로'));
  const close=button('×','practice-close',()=>leave('skipped'));close.setAttribute('aria-label','닫고 이야기 계속');close.disabled=launching;top.append(close);header.append(top);
  const heading=el('h2','',c.status==='ready'?'CareerPilot으로 첫 질문부터':c.status==='external_opened'?c.service+' 탭에서 이렇게 해요':c.status==='returned'?'어땠어요?':'새 탭을 직접 열어요');heading.id='guide-panel-heading';panel.setAttribute('aria-labelledby',heading.id);const title=el('div','guide-heading');title.append(heading);header.append(title);
  const body=el('div','guide-body');body.tabIndex=0;body.setAttribute('role','region');body.setAttribute('aria-label','실습 안내 본문 · 스크롤해서 계속 읽기');
  if(c.status==='ready'){
   const service=button('지금 쓰는 서비스: '+c.service+' · 바꾸기','guide-text',()=>{picking=!picking;epoch++;refresh()});body.append(service);if(picking)servicePicker(body);
   body.append(el('p','',c.service+'가 새 탭에서 열리고, 첫 요청은 자동으로 복사돼요. 게임은 이 장면에서 기다려요.'));
   if(!bridge.practicePrivacySeen)body.append(el('p','guide-privacy','🔒 게임은 AI 대화 내용을 읽거나 저장하지 않아요.'));desktop(body,c.service);
  }else if(c.status==='external_opened'){
   body.append(el('p','practice-status','✓ 새 탭 열림 · '+(bridge.practice.copied?'✓ 요청 복사됨':'요청 복사 필요')));
   const steps=el('ol','practice-instructions');for(const text of[(c.service==='Claude'?'/careerpilot을 고르거나 CareerPilot 이름을 넣어요.':'@로 CareerPilot을 선택해요.'),'복사된 요청을 붙여넣고 보내요.','첫 질문에 한두 문장으로 답해요. 모르는 건 모른다고 해도 돼요.'])steps.append(el('li','',text));body.append(steps);field(body);
   body.append(link(c.service+' 탭 다시 열기 ↗',CP_HANDOFF.urls[c.service],()=>state('external_opened')),button('새 탭이 안 열렸나요?','guide-text',()=>state('failed')));desktop(body,c.service);
   if(innerWidth<1000){const fold=button('⌄','guide-outline',()=>{expanded=false;epoch++;refresh()});fold.setAttribute('aria-label','실습 안내 접기');fold.setAttribute('aria-expanded','true');body.append(fold)}
  }else if(c.status==='returned'){
   body.append(el('p','','어떤 걸 골라도 이야기는 이어져요. 대화 내용은 묻지 않아요.'));const choices=el('div','practice-results');for(const [text,fn]of[['아직 상담 중이에요',()=>state('external_opened')],['설치나 실행에서 막혔어요',install],['지금은 넘어갈게요',()=>leave('skipped')]])choices.append(button(text,'guide-outline',fn));choices.append(el('p','guide-privacy','나중에 내 준비에서 다시 할 수 있어요.'));body.append(choices);
  }else if(c.status==='failed'){
   body.append(el('p','','새 탭이 막혔어요. 아래 링크를 눌러주세요.'));field(body);
  }
  const footer=el('footer','guide-footer'),secondary=el('div','guide-secondary');
  if(c.status==='ready')secondary.append(button('서안의 예시 먼저','guide-text',example));
  if(c.status!=='returned')secondary.append(button(c.status==='ready'?'지금은 이야기 계속':'지금은 넘어갈게요','guide-text',()=>leave('skipped')));
  const help=button('?','guide-help-button',()=>{const old=body.querySelector('.guide-help');if(old){old.remove();help.setAttribute('aria-expanded','false');return}const box=el('div','guide-help');box.append(el('p','','게임은 AI 대화를 확인하지 않아요. 새 탭에서 요청을 보내고, 돌아와 직접 진행 상태를 골라주세요.'),button('설치 안내 보기','guide-text',install));body.prepend(box);body.scrollTop=0;help.setAttribute('aria-expanded','true')});help.setAttribute('aria-label','실습 도움말');help.setAttribute('aria-expanded','false');secondary.append(help);
  const primary=c.status==='failed'?link(c.service+' 열기 ↗',CP_HANDOFF.urls[c.service],()=>{bridge.practicePrivacySeen=true;void state('external_opened')}):button(c.status==='ready'?(launching?'열고 있어요…':'CareerPilot으로 실습하기 ↗'):c.status==='returned'?'실습했어요 · 이야기 계속':'다녀왔어요','guide-primary',c.status==='ready'?start:c.status==='returned'?()=>leave('self_reported_done'):()=>state('returned'));primary.classList.add('guide-primary');primary.disabled=launching;secondary.querySelectorAll('button').forEach(b=>b.disabled=launching);footer.append(secondary,primary);panel.append(header,body,footer);
  if(c.status==='failed'||c.status==='external_opened'&&!bridge.practice.copied)queueMicrotask(selectRequest);else if(!launching)queueMicrotask(()=>primary.focus({preventScroll:true}));
  if(!reducedMotion())body.animate([{opacity:0},{opacity:1}],{duration:180});
 }
 function returned(){if(!active())return;if(launching){returnPending=true;return}if(bridge.practice?.status==='external_opened')void state('returned');}
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){hidden=true;return}if(hidden){hidden=false;returned()}});
 window.addEventListener('pageshow',returned);
 window.addEventListener('resize',()=>{if(active())refresh()});
 return{context,render,acceptLaunch,restore,state};
})();

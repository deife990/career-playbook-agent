'use strict';
// Practice never changes the engine's dialogue DOM. Completion is a user report.
window.CP_PRACTICE=(()=>{
 const {el,button,requestBox}=CP_GUIDE;
 let launching=false,epoch=0,entered=false,saveFailed=false,hidden=false,returnPending=false,leaving=false;
 const current=()=>CP_GUIDE.isOpen()&&CP_GUIDE.state()?.flow==='practice';
 const fresh=()=>({requestId:'W01_START',service:bridge.service,status:'ready',returnLabel:'E04'});
 function enter(){if(!CP_HANDOFF.validPractice(bridge.practice)||['self_reported_done','skipped'].includes(bridge.practice.status))bridge.practice=fresh();entered=true;void save();}
 function restore(){entered=false;cancel();if(bridge.practice?.status==='external_opened')bridge.practice.status='returned';}
 function cancel(){epoch++;launching=false;returnPending=false;CP_HANDOFF.cancel();}
 async function save(){const token=epoch,ok=await CP_GUIDE.persist();if(token!==epoch)return ok;const changed=saveFailed===ok;saveFailed=!ok;if(changed&&current())CP_GUIDE.render(false);return ok}
 function history(status){bridge.practiceHistory=CP_TUTORIAL_STATE.history(bridge.practiceHistory,{status});}
 async function state(status){if(!current()||!CP_HANDOFF.states.includes(status))return;bridge.practice.status=status;history(status);CP_GUIDE.render(false);await save()}
 async function start(){if(launching||!current())return;const p=bridge.practice,service=p.service,token=++epoch,s=CP_GUIDE.state(),context=[s.owner,s.returnTarget,s.stepId].join(':');launching=true;
  const valid=()=>token===epoch&&current()&&bridge.practice===p&&p.service===service&&[CP_GUIDE.state().owner,CP_GUIDE.state().returnTarget,CP_GUIDE.state().stepId].join(':')===context;
  const task=CP_HANDOFF.launch({provider:service,requestId:'W01_START',sceneId:monogatari.state('label'),isCurrent:valid,onOpened:()=>{if(valid())history('external_opened')}});CP_GUIDE.render(false);
  try{const result=await task;if(!valid()||result.stale)return;p.copied=result.copied;p.status=result.status;saveFailed=!result.saved;bridge.practicePrivacySeen=true;history(p.status);if(returnPending&&p.status==='external_opened')p.status='returned';}
  finally{if(token===epoch){launching=false;returnPending=false;if(current()){CP_GUIDE.render(false);await save()}}}
 }
 async function leave(status){if(leaving||!current())return;leaving=true;cancel();bridge.practice.status=status;history(status);await save();try{await CP_GUIDE.close({reason:'complete'})}finally{leaving=false;entered=false}}
 function install(){CP_GUIDE.dispatch({type:'OPEN_INSTALL'})}
 function servicePicker(body){const group=el('div','tutorial-services');for(const service of ['ChatGPT','Claude']){const b=button(service,'guide-outline',()=>CP_GUIDE.dispatch({type:'SET_SERVICE',service}));b.setAttribute('aria-pressed',String(bridge.service===service));group.append(b)}body.append(group)}
 function helpWords(body){const details=el('details','practice-help-words');details.append(el('summary','','막힐 때 쓸 말'));for(const [title,text]of[['시작이 막막함','어디서부터 말할지 모르겠어. 최근 일상을 떠올릴 수 있게 질문 하나씩 해줘.'],['요약이 다름','그 부분은 내 뜻과 달라. 내가 지키고 싶은 건 …야.'],['아직 모름','그 조건은 아직 모르겠어. 미정으로 남겨줘.'],['오늘 멈추기','오늘 나온 내용과 아직 모르는 점을 정리해줘.']]){const row=el('section'),status=el('p');status.setAttribute('role','status');row.append(el('h3','',title),el('p','',text),button('이 문구 복사','guide-outline',async()=>{let timer;const ok=await Promise.race([Promise.resolve().then(()=>navigator.clipboard.writeText(text)).then(()=>true,()=>false),new Promise(r=>timer=setTimeout(()=>r(false),1500))]);clearTimeout(timer);status.textContent=ok?'복사됨':'위 문장을 직접 선택해 복사해주세요.'}),status);details.append(row)}body.append(details)}
 function render(body,footer,s){if(!CP_HANDOFF.validPractice(bridge.practice))bridge.practice=fresh();const p=bridge.practice;
  if(s.stepId==='P01'){servicePicker(body);body.append(el('p','','게임은 설치 상태를 확인할 수 없어요. 메뉴가 없거나 시작이 막히면 도움말을 볼 수 있어요.'));footer.append(button('설치·선택 안내 보기','guide-outline',install),button('설치해뒀어요 · 첫 요청 보기','guide-primary',()=>{CP_GUIDE.navigate('practice','P02');void save()}));return}
  const isReturned=p.status==='returned';
  if(isReturned){
   body.append(el('p','practice-status','대화는 어땠나요? 내용은 공유하지 않아도 돼요.'));
   const results=el('div','practice-results');results.append(button(s.owner==='story'?'실습했어요 · 이야기 계속':'실습했어요 · 돌아가기','guide-primary',()=>leave('self_reported_done')),button('아직 상담 중이에요','guide-outline',()=>state('external_opened')),button('지금은 넘어갈게요','guide-text',()=>leave('skipped')),button('설치·실행에서 막혔어요','guide-text',install));body.append(results);
   const again=el('details','practice-help-words');again.append(el('summary','','요청 다시 보기'));requestBox(again,'W01_START');body.append(again);helpWords(body);
  }else{
   body.append(el('p','practice-goal','질문에 답하며 바꾸고 싶은 점이나 지킬 조건의 후보 하나를 찾아보세요.'));
   requestBox(body,'W01_START');
   const label=el('p','practice-service-label','사용할 서비스');body.append(label);servicePicker(body);
   if(p.status==='failed'||p.status==='external_opened'){
    const msg=p.status==='failed'?'자동으로 열지 못했어요. 아래 링크로 열 수 있어요.':p.copied?'서비스를 열도록 요청했고, 첫 요청을 복사했어요. CareerPilot 선택과 전송은 직접 해주세요.':'서비스 열기를 요청했어요. 요청은 위에서 직접 복사해주세요.';
    const status=el('p','practice-status',msg);status.setAttribute('role','status');body.append(status);
    const a=el('a','guide-outline',p.service+' 공식 서비스 열기 ↗');a.href=CP_HANDOFF.urls[p.service];a.target='_blank';a.rel='noopener noreferrer';a.onclick=()=>{p.copied??=false;void state('external_opened')};body.append(a);
   }
   const primary=button(launching?'복사 확인 중…':p.status==='external_opened'?'게임으로 돌아왔어요':'요청 복사하고 '+p.service+' 열기','guide-primary',()=>p.status==='external_opened'?state('returned'):start());primary.disabled=launching;body.append(primary);
   body.append(el('p','practice-privacy','AI는 별도 화면에서 열려요. 게임은 대화 내용을 읽거나 저장하지 않아요.'));
   const how=el('details','practice-help-words');how.append(el('summary','','사용법과 설치 확인'));const instructions=el('ol');for(const text of['선택한 서비스에서 CareerPilot을 사용할 상태인지 확인해요.','요청을 붙여넣고 직접 보내요.','질문에 한두 문장으로 답해요. 모르면 미정이라고 해요.'])instructions.append(el('li','',text));how.append(instructions,button('설치·선택 안내','guide-text',install));body.append(how);helpWords(body);
   const desktop=CP_HANDOFF.desktopURL(p.service,p.requestId);if(desktop){const a=el('a','guide-text','Claude 데스크톱 앱으로 열기');a.href=desktop;a.onclick=()=>{p.copied=false;void state('external_opened')};how.append(a)}
   footer.append(button(s.owner==='story'?'지금은 이야기 계속':'지금은 넘어갈게요','guide-text',()=>leave('skipped')));
  }
  if(saveFailed){const warning=el('section','practice-save-warning');warning.setAttribute('role','status');warning.append(el('p','','지금 진행 위치를 저장하지 못했어요. 이 탭을 닫으면 이어 읽을 위치가 남지 않을 수 있어요.'),button('저장 다시 시도','guide-outline',save),el('p','','현재 탭에서는 계속할 수 있어요.'));body.append(warning)}
 }
 function returned(){if(!current())return;if(launching){returnPending=true;return}if(bridge.practice?.status==='external_opened')void state('returned')}
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){hidden=true;return}if(hidden){hidden=false;returned()}});window.addEventListener('pageshow',returned);
 return{render,enter,restore,state,cancel,wasEntered:()=>entered};
})();

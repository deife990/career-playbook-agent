'use strict';
// A single native modal owns tutorial input; ordinary story phones remain independent.
window.CP_GUIDE=(()=>{
 const dialog=$('tutorial-dialog'),TITLE_KEY='CPGuideProgress_v1';
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n};
 const button=(text,cls,fn)=>{const n=el('button',cls,text);n.type='button';n.onclick=fn;return n};
 const logo=service=>{const n=el('img','guide-logo');n.src='assets/service-logos/'+(service==='Claude'?'claude':'openai')+'.svg';n.alt='';return n};
 let preparationScroll=0,titleState=CP_TUTORIAL_STATE.fresh(),focusReturn=null,preparationFocus=null,transcript=false,closing=false,renderKey='',copyEpoch=0;
 const state=()=>dialog.open&&dialog.dataset.owner==='title'?titleState:bridge.tutorial;
 const isOpen=()=>dialog.open;
 function store(s){if(s.owner==='title')titleState=s;else bridge.tutorial=s;}
 async function persist(){const s=state();if(s?.owner==='title'){try{localStorage.setItem(TITLE_KEY,JSON.stringify(titleState))}catch{}return true}for(let i=0;i<120;i++){if(!playing())return true;if(!busy&&!restoring&&!transitioning&&settled)return checkpoint();await new Promise(requestAnimationFrame)}return false}
 function requestBox(body,requestId='W01_START'){
  const text=REQUESTS[requestId];if(typeof text!=='string')return null;
  const box=el('section','guide-request'),label=el('label','','직접 선택해 복사할 요청'),field=el('textarea');field.id='tutorial-request-'+requestId;label.htmlFor=field.id;field.readOnly=true;field.value=text;field.rows=1;field.setAttribute('aria-label','복사할 요청');
  const status=el('p','guide-copy-status');status.setAttribute('role','status');
  const copy=button(requestId==='W01_CONTINUE'?'이어갈 요청 복사':'요청 복사','guide-outline',async()=>{const token=++copyEpoch;copy.disabled=true;let timer;try{const ok=await Promise.race([Promise.resolve().then(()=>navigator.clipboard.writeText(text)).then(()=>true,()=>false),new Promise(resolve=>{timer=setTimeout(()=>resolve(false),1500)})]);if(token!==copyEpoch||!copy.isConnected)return;status.textContent=ok?'요청 복사됨':'자동 복사를 확인하지 못했어요. 문장을 직접 선택해 복사해주세요.';if(!ok){field.focus();field.select()}}finally{clearTimeout(timer);if(copy.isConnected)copy.disabled=false}});
  box.append(label,field,copy,status);body.append(box);requestAnimationFrame(()=>{if(field.isConnected){field.style.height='auto';field.style.height=field.scrollHeight+4+'px'}});return field;
 }
 function paragraph(body,text,cls=''){body.append(el('p',cls,text))}
 function showMessages(body,item,corrected=false){
  const spread=el('div','tutorial-spread'),conversation=el('section','tutorial-conversation'),observation=el('section','tutorial-observation');
  conversation.setAttribute('aria-label','서안의 가상 대화');observation.setAttribute('aria-label','오늘 정리한 것');
  if(item.requestId)requestBox(conversation,item.requestId);
  if(item.aside){const aside=el('div','tutorial-aside');aside.append(CP_CHARACTERS.portrait('seoan'),el('p','','서안: '+item.aside));conversation.append(aside)}
  for(const m of item.messages||[]){const row=el('section','tutorial-message');row.append(el('strong','',m.speaker),el('p','',m.text));conversation.append(row)}
  observation.append(el('p','tutorial-note-label','오늘 정리한 것'));
  if(item.summary){const dl=el('dl','tutorial-summary');for(const [name,text]of item.summary)dl.append(el('dt','',name),el('dd','',text));observation.append(dl)}
  paragraph(observation,item.explanation,'tutorial-explanation');
  if(item.correction&&corrected){const result=el('section','tutorial-correction');result.setAttribute('role','status');result.append(el('strong','','서안'),el('p','',item.correction.text));const compare=el('div','tutorial-comparison');for(const [title,text]of[['확인 전',item.before],['확인 후',item.after]]){const cell=el('section');cell.append(el('h3','',title),el('p','',text));compare.append(cell)}result.append(compare);observation.append(result)}
  spread.append(conversation,observation);body.append(spread);
 }
 function servicePicker(body){const group=el('div','tutorial-services');group.setAttribute('role','group');group.setAttribute('aria-label','사용할 서비스');for(const service of ['ChatGPT','Claude']){const b=button(service,'guide-outline',()=>dispatch({type:'SET_SERVICE',service}));b.setAttribute('aria-pressed',String(bridge.service===service));b.prepend(logo(service));group.append(b)}body.append(group)}
 function example(body,footer,s){
  if(transcript){paragraph(body,'실제 질문과 답변 순서는 달라질 수 있어요.');for(const id of CP_TUTORIAL_STATE.steps.example){const section=el('section','tutorial-transcript-step');section.append(el('h3','',id+' · '+CP_TUTORIAL_CONTENT[id].title));showMessages(section,CP_TUTORIAL_CONTENT[id],true);body.append(section)}footer.append(button('단계로 돌아가기','guide-primary',()=>dispatch({type:'CLOSE_TRANSCRIPT'})));return}
  const item=CP_TUTORIAL_CONTENT[s.stepId];if(s.stepId!=='S01')body.append(button('예시 처음부터','guide-text',()=>{state().correctionRevealed=false;navigate('example','S01')}));if(s.stepId==='S01')paragraph(body,'실제 질문과 답변 순서는 달라질 수 있어요.');showMessages(body,item,s.correctionRevealed);
  const previous=button('이전','guide-text',()=>dispatch({type:'PREV'}));previous.disabled=s.stepId==='S01';footer.append(previous);
  if(s.stepId==='S04'){body.append(button(s.correctionRevealed?'수정 전 다시 보기':'수정 예시 바로 보기','guide-text',()=>dispatch({type:'REVEAL_CORRECTION',revealed:!s.correctionRevealed})));footer.append(button(s.correctionRevealed?'오늘 정리한 내용 보기':item.action,'guide-primary',()=>dispatch({type:s.correctionRevealed?'NEXT':'REVEAL_CORRECTION'})))}
  else if(s.stepId==='S05'){body.append(button('전체 예시 보기','guide-outline',()=>dispatch({type:'OPEN_TRANSCRIPT'})));footer.append(button(s.returnTarget==='intro-example'?'펍 장면으로 돌아가기':'선택 화면으로 돌아가기','guide-primary',()=>close({reason:'complete'})))}else footer.append(button(item.action,'guide-primary',()=>dispatch({type:'NEXT'})));
 }
 function sourceImage(body,item){if(!item)return;const fig=el('figure','tutorial-capture'),a=el('a');a.href='assets/'+item[3];a.target='_blank';a.rel='noopener noreferrer';const img=el('img');img.src=a.href;img.alt=item[4];a.append(img);fig.append(a,el('figcaption','',item[4]+' · 기존 출처 자료 · 2026-10-05/21 기록. 현재 메뉴·권한은 계정에서 직접 확인해주세요.'));body.append(fig)}
 function help(body){const details=el('details','tutorial-help');details.append(el('summary','','메뉴가 안 보여요'));paragraph(details,'계정·조직의 설치 권한과 서비스 메뉴가 다를 수 있어요. 메뉴가 없다고 잘못한 것은 아니에요. 실제 대상 계정의 현재 설치·호출은 아직 검증하지 못했어요.');const a=el('a','','서비스 공식 도움말 ↗');a.href=bridge.service==='Claude'?'https://support.claude.com/en/articles/12512180-using-skills-in-claude':'https://help.openai.com/en/articles/20001256-plugins-in-chatgpt';a.target='_blank';a.rel='noopener noreferrer';details.append(a,button('다른 서비스 고르기','guide-text',()=>{dispatch({type:'SET_SERVICE',service:bridge.service==='Claude'?'ChatGPT':'Claude'})}),button('설치 없이 일반 대화로 맛보기','guide-text',()=>navigate('taste','T01',true)));body.append(details)}
 function installation(body,footer,s){const service=bridge.service;servicePicker(body);
  const index=Number(s.stepId.slice(1))-1;
  if(index===0){paragraph(body,CP_WIZARD.actions[service][0]);const a=el('a','guide-outline',service+'용 ZIP 다운로드');a.href='downloads/careerpilot-'+service.toLowerCase()+'-v1.2.0-rc.7.zip';a.download='';body.append(a);paragraph(body,'다운로드는 설치 완료를 뜻하지 않아요. 압축을 풀지 않고 보관하세요.')}
  if(index===1){paragraph(body,CP_WIZARD.actions[service][1]);sourceImage(body,INSTALL_STEPS[service][1]);paragraph(body,CP_WIZARD.actions[service][2]);sourceImage(body,INSTALL_STEPS[service][2]);paragraph(body,'받은 서비스용 ZIP을 설치 메뉴에서 선택해요. 일반 채팅에 첨부하는 것은 설치가 아니에요.')}
  if(index===2){paragraph(body,CP_WIZARD.actions[service][3]);sourceImage(body,INSTALL_STEPS[service][3]);paragraph(body,'목록과 활성화 상태를 직접 확인하세요. 게임은 설치 완료를 확인할 수 없어요.')}
  if(index===3){const actions=service==='Claude'?['Skills 목록에서 CareerPilot을 켜고, 새 대화에서 /careerpilot 또는 이름을 입력해요.','선택 목록이 제공되면 CareerPilot을 고르거나 이름을 넣어요.','CareerPilot을 사용할 상태인지 확인하고 요청을 붙여넣어요. 전송은 직접 해주세요.']:['새 대화 입력창에서 @ 또는 플러그인 선택 메뉴를 열어요.','목록에서 CareerPilot을 선택해요.','입력창의 CareerPilot 이름을 확인하고 요청을 붙여넣어요. 전송은 직접 해주세요.'];paragraph(body,(s.installInvocationStep+1)+' / 3 · '+actions[s.installInvocationStep],'tutorial-invocation');const prev=button('조작 이전','guide-outline',()=>dispatch({type:'INVOCATION_PREV'}));prev.disabled=s.installInvocationStep===0;const next=button('조작 다음','guide-outline',()=>dispatch({type:'INVOCATION_NEXT'}));next.disabled=s.installInvocationStep===2;body.append(prev,next);sourceImage(body,INSTALL_STEPS[service][4]);}
  if(index===4){paragraph(body,'이제 첫 요청을 읽고 준비할 수 있어요. 설치 안내를 읽었다는 것만으로 설치·실습 완료로 표시하지 않아요.');if(s.owner==='title')requestBox(body,'W01_START');}
  help(body);const previous=button('이전','guide-text',()=>dispatch({type:'PREV'}));previous.disabled=index===0;footer.append(previous,button('나중에 하기','guide-text',()=>dispatch({type:'RETURN_TO_CALLER'})),button(index===4?(s.owner==='title'?'타이틀로 돌아가기':'첫 요청 보기'):'다음','guide-primary',()=>index===4?finishInstall():dispatch({type:'NEXT'})));
 }
 function finishInstall(){const s=state();if(s.owner==='title'){void close();return}const caller=s.caller;store({...s,...(caller||{flow:'practice',stepId:'P02'}),caller:null});if(state().flow==='practice')state().stepId='P02';render(true);void persist()}
 function navigate(flow,stepId,saveCaller=false){const s=state();if(!CP_TUTORIAL_STATE.steps[flow]?.includes(stepId))return;store({...s,flow,stepId,lastExampleStepId:flow==='example'?stepId:s.lastExampleStepId,caller:saveCaller?(s.caller||{flow:s.flow,stepId:s.stepId,owner:s.owner,returnTarget:s.returnTarget}):s.caller});render(true);void persist()}
 function continuation(body,footer,s){paragraph(body,'먼저 사용하던 대화를 찾아 열고, 아래 요청을 붙여넣어주세요. 새 대화를 열면 이전 대화 내용이 그대로 이어지지 않을 수 있어요.');if(s.stepId==='C00'){body.append(button('이미 첫 요청을 보냈어요','guide-primary',()=>navigate('continue','C01')),button('아직 보내지 않았어요','guide-outline',()=>navigate('practice','P01')))}else{requestBox(body,'W01_CONTINUE');const a=el('a','guide-text',bridge.service+' 홈 열기 ↗');a.href=CP_HANDOFF.urls[bridge.service];a.target='_blank';a.rel='noopener noreferrer';body.append(a);paragraph(body,'홈에서 이전 대화 기록을 직접 찾아주세요. 게임은 같은 대화를 자동으로 복원하지 않아요.')}footer.append(button('돌아가기','guide-outline',()=>close()))}
 function taste(body,footer,s){paragraph(body,'CareerPilot을 설치하지 않은 일반 AI 대화예요. 실제 CareerPilot 사용과 기능은 다를 수 있어요.');servicePicker(body);const field=requestBox(body,'W01_TASTE'),status=el('p'),link=el('a','guide-text','서비스 직접 열기 ↗');status.setAttribute('role','status');link.hidden=true;body.append(status,link);footer.append(button('돌아가기','guide-text',()=>s.caller?dispatch({type:'RETURN_TO_CALLER'}):close()),button('요청 복사하고 '+bridge.service+' 열기','guide-primary',async()=>{const token=copyEpoch;const result=await CP_HANDOFF.launch({provider:bridge.service,requestId:'W01_TASTE',sceneId:monogatari.state('label')});if(token===copyEpoch&&dialog.open&&state().flow==='taste')CP_HANDOFF.present(result,{provider:bridge.service,requestId:'W01_TASTE',field,link,status:text=>status.textContent=text})}))}
 function render(moveFocus=false){if(!dialog.open)return;const s=state();if(!s)return;copyEpoch++;const oldFocus=document.activeElement,oldIndex=[...dialog.querySelectorAll('button')].indexOf(oldFocus),hadFocus=dialog.contains(oldFocus),oldText=oldFocus?.textContent,scroll=dialog.querySelector('.guide-body')?.scrollTop||0;dialog.replaceChildren();dialog.dataset.flow=s.flow;dialog.dataset.step=s.stepId;renderKey=s.flow+':'+s.stepId;
  const header=el('header','guide-header'),top=el('div','tutorial-top');top.append(el('p','guide-tag',s.flow==='example'?'서안의 CareerPilot 사용 예시 · 가상 대화':'CAREERPILOT · '+(s.flow==='install'?'설치·선택 안내':'내 준비')),button(s.flow==='example'?'닫고 선택 화면으로':'닫기','guide-text',()=>close()));
  const heading=el('h2','',transcript?'전체 예시':CP_TUTORIAL_CONTENT[s.stepId].title);heading.id='tutorial-heading';heading.tabIndex=-1;const description=el('p','tutorial-progress',s.flow==='example'?'예시 '+(CP_TUTORIAL_STATE.steps.example.indexOf(s.stepId)+1)+' / 5':s.flow==='install'?'설치 안내 '+(Number(s.stepId.slice(1)))+' / 5':'원할 때 중단하고 돌아올 수 있어요.');description.id='tutorial-description';header.append(top,heading,description);
  const body=el('div','guide-body'),footer=el('footer','guide-footer');
  if(s.flow==='example')example(body,footer,s);else if(s.flow==='install')installation(body,footer,s);else if(s.flow==='practice')CP_PRACTICE.render(body,footer,s);else if(s.flow==='continue')continuation(body,footer,s);else taste(body,footer,s);
  if(s.flow==='example'&&!transcript){
   const tabs=el('nav','tutorial-page-tabs');tabs.setAttribute('aria-label','노트 페이지');
   const pageKey=s.stepId+':'+s.correctionRevealed;if(dialog.dataset.pageKey!==pageKey){dialog.dataset.page=s.correctionRevealed?'notes':'conversation';dialog.dataset.pageKey=pageKey}
   for(const [id,label] of [['conversation','서안의 대화'],['notes','오늘 정리한 것']]){const tab=button(label,'guide-text',()=>{dialog.dataset.page=id;for(const b of tabs.children)b.setAttribute('aria-pressed',String(b===tab));dialog.scrollTop=0});tab.setAttribute('aria-pressed',String(dialog.dataset.page===id));tabs.append(tab)}
   header.append(tabs);
  }
  dialog.append(header,body,footer);if(moveFocus){dialog.scrollTop=0;heading.focus({preventScroll:true});body.scrollTop=0}else{body.scrollTop=scroll;if(hadFocus){const replacement=[...dialog.querySelectorAll('button')].find(n=>n.textContent===oldText&&!n.disabled);(replacement||[...dialog.querySelectorAll('button')][oldIndex]||heading)?.focus({preventScroll:true})}}
 }
 function open(options={}){const base=CP_TUTORIAL_STATE.normalize(bridge.tutorial);if(!CP_TUTORIAL_STATE.validContext(options)||options.owner==='title'&&!['example','install','taste'].includes(options.flow))return false;
  if(dialog.open){CP_PRACTICE?.cancel();transcript=false;copyEpoch++;}
  else{focusReturn=document.activeElement;CP_REVIEW.stop();if($('preparation').open){preparationFocus=document.activeElement;preparationScroll=$('preparation').scrollTop;base.preparationReturn={view:bridge.view,card:bridge.card,requestIndex:bridge.requestIndex};$('preparation').close();bridge.panel=false}}
  let s={...base,...options,active:true,caller:options.caller||null};
  if(options.owner==='title'){try{titleState=CP_TUTORIAL_STATE.normalize(JSON.parse(localStorage.getItem(TITLE_KEY)))}catch{titleState=CP_TUTORIAL_STATE.fresh()}s={...titleState,...options,stepId:options.stepId==='S01'?titleState.lastExampleStepId:options.stepId,active:true};}
  if(s.flow==='example'){s.lastExampleStepId=s.stepId;if(!s.exampleSeenIds.includes(s.stepId))s.exampleSeenIds.push(s.stepId)}store(s);dialog.dataset.owner=s.owner;if(!dialog.open)dialog.showModal();document.body.dataset.tutorialOpen='true';document.body.style.overflow='hidden';if(playing())monogatari.global('block',true);transcript=false;if(s.flow==='practice')CP_PRACTICE.enter();render(true);void persist();return true;
 }
 async function close({reason='dismiss'}={}){if(!dialog.open||closing)return;closing=true;const s=structuredClone(state());if(reason==='dismiss'&&['practice','install'].includes(s.flow)&&bridge.practice&&!['self_reported_done','skipped'].includes(bridge.practice.status))bridge.practice.status='skipped';CP_PRACTICE.cancel();copyEpoch++;store({...state(),active:false});await persist();dialog.close();document.body.dataset.tutorialOpen='false';document.body.style.overflow='';transcript=false;
  try{if(s.owner==='story'){
    const label=s.returnTarget==='intro-example'?(reason==='complete'?'TutorNext':'E03'):s.returnTarget==='example-reread'?'E03':'E04';
    monogatari.global('block',false);monogatari.action('Choice').blocking=false;document.querySelectorAll('choice-container').forEach(n=>n.remove());await monogatari.run('jump '+label,false);syncStoryUI();$('next').focus();await checkpoint();
   }else if(s.owner==='preparation'){
    const saved=s.preparationReturn;if(saved){bridge.view=saved.view;bridge.card=CP_CARDS.some(c=>c.id===saved.card)?saved.card:bridge.card;bridge.requestIndex=Math.min(saved.requestIndex,card().requests.length-1)}showPanel(bridge.view);$('preparation').scrollTop=preparationScroll;(preparationFocus?.isConnected?preparationFocus:$('close-prep')).focus();
   }else{syncStoryUI();(focusReturn?.isConnected?focusReturn:$('prep')).focus()}
  }finally{closing=false;renderKey=''}
 }
 function dispatch(event){if(!isOpen())return false;if(event.type==='OPEN_TRANSCRIPT'||event.type==='CLOSE_TRANSCRIPT'){transcript=event.type==='OPEN_TRANSCRIPT';render(true);return true}if(event.type==='SET_SERVICE'){if(!['ChatGPT','Claude'].includes(event.service))return false;CP_PRACTICE.cancel();const changed=bridge.service!==event.service;bridge.service=bridge.guideService=event.service;if(bridge.practice){bridge.practice.service=event.service;if(changed){bridge.practice.status='ready';bridge.practice.copied=false}}try{localStorage.setItem('CPPreferredService',event.service)}catch{}}
  const before=state().stepId;store(CP_TUTORIAL_STATE.transition(state(),event,bridge.service));if(event.type==='RETURN_TO_CALLER'&&!state().caller&&state().flow==='install'){if(state().owner==='title'){void close();return true}navigate('practice','P01');return true}if(state().flow==='practice')CP_PRACTICE.enter();render(before!==state().stepId);void persist();return true;
 }
 function sync(){if(closing||!ready||restoring)return;if(dialog.open){if(playing())monogatari.global('block',true);return}if(!playing()||!settled)return;
  const label=monogatari.state('label'),s=CP_TUTORIAL_STATE.normalize(bridge.tutorial),expected={TutorRequest:'intro-example',E03Example:'example-reread',E03Actual:'story-practice'}[label];
  if(label==='E03Actual'&&['self_reported_done','skipped'].includes(bridge.practice?.status)&&!CP_PRACTICE.wasEntered()){bridge.tutorial.active=false;requestAnimationFrame(async()=>{if(monogatari.state('label')!==label||dialog.open)return;monogatari.global('block',false);await monogatari.run('jump E04',false);syncStoryUI();await checkpoint()});return}
  if(s.active&&s.owner!=='title'&&(s.owner!=='story'||s.returnTarget===expected)){open(s);return}
  if(expected){open({flow:label==='E03Actual'?'practice':'example',stepId:label==='E03Actual'?'P01':'S01',owner:'story',returnTarget:expected})}
 }
 function reset(){CP_PRACTICE?.cancel();dialog.close();copyEpoch++;closing=false;transcript=false;renderKey='';document.body.dataset.tutorialOpen='false';document.body.style.overflow=''}
 document.addEventListener('keydown',event=>{if(dialog.open&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();void close()}},true);
 dialog.addEventListener('cancel',event=>{event.preventDefault();void close()});
 const oldSync=syncStoryUI;syncStoryUI=function(){oldSync();sync()};
 const oldPanel=changePanel;changePanel=async function(view,cardId=null){if(['install','guide'].includes(view)){return open({flow:view==='install'?(!playing()?'install':'practice'):'example',stepId:view==='install'?(!playing()?'I01':'P01'):bridge.tutorial?.lastExampleStepId||'S01',owner:finished()?'ending':playing()?'preparation':'title',returnTarget:finished()?'ending':playing()?'preparation':'title'})}return oldPanel(view,cardId)};
 renderGuide=function(){if(dialog.open)render(false)};
 $('title-tutorial').onclick=()=>open({flow:'example',stepId:'S01',owner:'title',returnTarget:'title'});
 $('tutorial-watch').onclick=()=>open({flow:'example',stepId:bridge.tutorial?.lastExampleStepId||'S01',owner:'preparation',returnTarget:'preparation'});
 window.addEventListener('resize',()=>dialog.querySelectorAll('textarea').forEach(field=>{field.style.height='auto';field.style.height=field.scrollHeight+4+'px'}));
 return{open,close,isOpen,dispatch,sync,schedule:sync,render,navigate,persist,state,reset,el,button,logo,requestBox};
})();

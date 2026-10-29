'use strict';
// One tutorial surface, shared by story and preparation. No external AI data is read.
window.CP_GUIDE=(()=>{
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
 const panel=el('aside','guide-panel');panel.hidden=true;panel.setAttribute('aria-label','CareerPilot 안내');document.body.append(panel);
 const stages=['설치','실행','호출','첫 질문'];
 const legacy={TutorChatGPTUpload:2,TutorInstallUpload:2,TutorChatGPTEnable:3,TutorInstallEnable:3,TutorInstallChat:4,TutorChatGPTChat:4,TutorClaudeChat:4};
 let current=null,key='',frame=0,timer=0,copyTimer=0,chatKey='',pending=null;
 function context(){
  if($('preparation').open){
   if(!['install','guide'].includes(bridge.view))return null;
   const old=bridge.wizardStep;
   return bridge.view==='guide'?{kind:'lesson',index:bridge.guideStep,story:false,service:bridge.guideService}:{kind:old<0?'pick':old>=5?'lesson':'install',index:old>=5?[0,1,3][old-5]:old,story:false,service:bridge.service};
  }
  if(!playing())return null;
  const practice=window.CP_PRACTICE?.context();if(practice)return practice;
  const label=monogatari.state('label'),step=monogatari.state('step');
  if(label==='TutorInstallPick')return{kind:'pick',index:-1,story:true,service:bridge.service,label,step};
  if(label==='TutorLinear')return{kind:bridge.wizardStep<0?'pick':'install',index:Math.min(4,Math.max(0,bridge.wizardStep)),story:true,service:bridge.service,label,step};
  if(label in legacy)return{kind:'install',index:legacy[label],story:true,service:bridge.service,label,step};
  if(Number.isInteger(TUTORIAL_LABELS[label])){
   const lines=CP_STORY.script[label].map((line,i)=>({line,i})).filter(({line})=>stableStatement(line)&&typeof line==='string');
   const ordinal=Math.max(0,lines.filter(({i})=>i<=step).length-1);
   return{kind:'lesson',index:TUTORIAL_LABELS[label],story:true,service:bridge.service,label,step,ordinal,part:Math.floor(ordinal/4)};
  }
  return null;
 }
 function phase(c){return c.kind==='pick'||c.kind==='install'&&c.index<3?0:c.kind==='install'&&c.index===3?1:c.kind==='install'||c.index===0?2:3;}
 function title(c){return c.kind==='pick'?'평소 쓰는 서비스를 골라요':c.kind==='install'?CP_WIZARD.titles[c.index]:['CareerPilot에 첫 요청 보내기','아는 내 상황부터 말해요','바꾸고 싶은 일을 찾아요','지키고 싶은 생활을 남겨요','다음 질문으로 좁혀가요','내 이야기로 시작할 준비'][c.index]+(c.part?' · 이어서':'');}
 function progress(c){const nav=el('ol','guide-progress');nav.setAttribute('aria-label','설치부터 첫 질문까지');stages.forEach((name,i)=>{const li=el('li',i<phase(c)?'complete':i===phase(c)?'current':'',`${i<phase(c)?'✓':i+1} ${name}`);if(i===phase(c))li.setAttribute('aria-current','step');nav.append(li)});return nav;}
 function button(text,cls,fn){const b=el('button',cls,text);b.type='button';b.onclick=fn;return b;}
 function logo(service){const img=el('img','guide-logo');img.src='assets/service-logos/'+(service==='Claude'?'claude':'openai')+'.svg';img.alt='';return img;}
 async function choose(service,installed=false){
  bridge.service=bridge.guideService=service;localStorage.setItem('CPPreferredService',service);bridge.wizardStep=installed?4:0;
  if(current.story){monogatari.action('Choice').blocking=false;document.querySelectorAll('choice-container').forEach(n=>n.remove());await monogatari.run('jump TutorLinear',false);}else renderPanel();
  sync();await saveWhenSettled();
 }
 async function saveWhenSettled(){for(let i=0;i<120;i++){if(settled&&!busy&&stableStatement(monogatari.label()?.[monogatari.state('step')]))return checkpoint();await new Promise(requestAnimationFrame)}return false}
 function preflight(service){const details=el('details','guide-preflight');details.append(el('summary','','시작 전 확인'),el('p','','질문에 답하며 지금 하는 일·바꾸고 싶은 것·지키고 싶은 조건을 정리해요. 이력서 없이도 시작할 수 있어요.'),el('p','',service==='Claude'?'컴퓨터의 웹 또는 데스크톱 앱을 권장해요. 로그인 후 사용자 지정(Customize)에 스킬(Skills)이 보이는지 확인해요.':'개인 계정인지 회사 워크스페이스인지 확인해요. ZIP 업로드 메뉴와 업로드 권한이 있는 계정에서만 설치할 수 있어요.'),el('p','','모바일 ZIP 업로드는 확인하지 못했어요. 실제 메뉴 이름은 계정에 따라 다를 수 있어요.'));return details;}
 function selection(body,c){
  const cards=el('div','guide-services');for(const service of ['ChatGPT','Claude']){
   const b=button('','guide-service',()=>choose(service));const copy=el('span','guide-service-copy');copy.append(el('strong','',service+'로 시작'),el('span','',service==='Claude'?'평소 Claude를 쓰는 분 · 스킬 방식':'평소 ChatGPT를 쓰는 분 · 플러그인 방식'));b.append(logo(service),copy,el('span','guide-chevron','›'));cards.append(b);
  }body.append(cards,preflight(c.service));
  const links=el('div','guide-pick-links');links.append(button('이미 설치했어요 · 마지막 단계로','guide-text',()=>choose(bridge.service,true)),button('설치 없이 먼저 맛보기','guide-text',()=>CP_REVIEW.openTaste()));body.append(links);
 }
 function requestBox(body){const box=el('div','guide-request');const field=el('textarea');field.readOnly=true;field.rows=4;field.value=FIRST_REQUEST;field.setAttribute('aria-label','복사할 첫 요청');const status=el('p','guide-copy-status');status.setAttribute('role','status');status.hidden=true;
  const copy=button('요청 복사','guide-outline',async()=>{copy.disabled=true;try{await navigator.clipboard.writeText(FIRST_REQUEST);copy.textContent='복사됨 ✓';status.hidden=true;clearTimeout(copyTimer);copyTimer=setTimeout(()=>copy.textContent='요청 복사',1500)}catch{copy.textContent='요청 복사';status.hidden=false;status.textContent='자동 복사가 막혔어요. 문장을 길게 눌러 복사해주세요';field.focus();field.select()}finally{copy.disabled=false}});box.append(field,copy);body.append(status,box);
 }
 function invocation(body,service){
  const visual=el('div','guide-invocation');visual.setAttribute('aria-label',(service==='Claude'?'/':'@')+' 입력, 목록에서 CareerPilot 선택, 이름 칩 삽입');
  const symbol=service==='Claude'?'/':'@';
  const frames=el('div','guide-invoke-frames');
  for(let i=0;i<3;i++){const f=el('div','guide-invoke-frame');f.style.setProperty('--invoke-index',i);f.append(CP_LESSON_UI.composer(service,i===0?symbol:i===1?'목록에서 CareerPilot 선택':'메시지를 입력하세요'));if(i<2)f.querySelector('.lesson-chip')?.remove();if(i===1)f.append(el('div','guide-invoke-result','CareerPilot'));frames.append(f)}
  const pills=el('div','guide-invoke-pills');['① '+symbol+' 입력','② 목록에서 선택','③ 이름 칩'].forEach((text,i)=>{const p=el('span','',text);p.style.setProperty('--invoke-index',i);pills.append(p)});visual.append(frames,pills);body.append(visual);requestBox(body);
 }
 function capture(body,c){const item=INSTALL_STEPS[c.service][c.index];
  if(item[3].startsWith('reference-ui/')){
   const fig=el('figure','guide-capture');const a=el('a','guide-capture-link');a.href='assets/'+item[3];a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',item[4]+' · 원본 크게 보기');const img=el('img');img.src=a.href;img.alt=item[4];a.append(img);
   // Coordinates refer to the supplied source image, never a fabricated screenshot.
   const ring=el('span','guide-highlight');ring.setAttribute('aria-hidden','true');ring.append(el('span','guide-marker','1'));
   if(c.service==='ChatGPT'&&c.index===4)a.classList.add('guide-capture-composer');
   const coords=c.service==='ChatGPT'&&c.index===4?[8,40,25,28]:c.service==='Claude'?(c.index===3?[83,13,7,8]:c.index===1?[1.5,13.5,17,6]:[35,40,31,13]):[21,18,15,6];['left','top','width','height'].forEach((p,i)=>ring.style[p]=coords[i]+'%');a.append(ring);fig.append(a,el('figcaption','',item[4]+' · 눌러서 원본 보기'));body.append(fig);
  }else{const diagram=CP_WIZARD.appFrame(c.service,c.index);if(diagram){diagram.classList.add('guide-diagram');diagram.querySelectorAll('.gpt-click-number').forEach(n=>n.remove());const focuses=[...diagram.querySelectorAll('.gpt-demo-focus,.highlight')];focuses.forEach((n,i)=>{n.classList.remove('gpt-demo-focus','highlight');if(i===0){n.classList.add('guide-diagram-focus');n.append(el('span','guide-marker','1'))}});body.append(diagram)}}
 }
 function switches(body,c){const group=el('div','guide-switch-comparison');group.setAttribute('aria-label','꺼짐과 켜짐 비교');for(const on of [false,true]){const box=el('div','guide-switch-state');box.append(el('span','','CareerPilot'),el('span','guide-switch'+(on?' on':'')),el('strong','',on?'켜짐 ✓':'꺼짐 ✕'));group.append(box)}body.append(group);}
 function installation(body,c){body.append(el('p','guide-instruction',CP_WIZARD.actions[c.service][c.index]));
  if(c.index===0){const file=el('div','guide-download');file.append(el('span','guide-zip','ZIP'),el('strong','','CareerPilot ZIP 파일'),el('p','','careerpilot-'+c.service.toLowerCase()+'-v1.2.0-rc.7.zip'));const a=el('a','guide-outline',c.service+'용 파일 다운로드 ↓');a.href='downloads/careerpilot-'+c.service.toLowerCase()+'-v1.2.0-rc.7.zip';a.download='';const status=el('p','guide-download-status');status.setAttribute('role','status');a.onclick=()=>{status.textContent='다운로드를 요청했어요. 다운로드 폴더를 확인하세요.';panel.querySelector('.guide-primary').classList.add('download-ready')};file.append(a,status);body.append(file,preflight(c.service));}
  else if(c.index===4){const item=INSTALL_STEPS[c.service][4];if(item[3].startsWith('reference-ui/'))capture(body,c);invocation(body,c.service)}
  else{capture(body,c);if(c.index===3)switches(body,c)}
 }
 function lessonMessages(service,index){
  const item=tutorialStep(index,service),context=CP_TUTORIAL.services.ChatGPT[1].reading;
  const split=text=>text.split(/(?<=\.)\s+/).filter(Boolean);
  if(index===1)return[{role:'assistant',text:'현재 어떤 일을 하고 있는지 짧게 알려주시겠어요?'},...split(context).map(text=>({role:'user',text}))];
  if(index===2)return[{role:'assistant',text:CP_TUTORIAL.services[service][2].reading},{role:'user',text:'새로운 운영안을 직접 만들어보고 싶어요.'},{role:'assistant',text:'매일 하는 일 가운데, 어떤 경험을 더 늘리고 싶나요?'},{role:'user',text:'같은 마감을 반복하기보다, 새 운영안을 직접 기획하고 시험해보고 싶어요.'}];
  if(index===3)return[{role:'user',text:'고향 온호시에서 계속 살고 싶고, 준비하는 동안에도 월급은 받아야 해요.'},{role:'assistant',text:CP_TUTORIAL.services[service][3].reading},{role:'user',text:'필요한 급여와 출퇴근할 수 있는 거리는 아직 정하지 못했어요.'},{role:'assistant',text:'모르는 조건은 아직 모른다고 남겨도 돼요.'},{role:'user',text:'월세와 생활비부터 살펴보고 싶어요.'},{role:'assistant',text:'온호시에 살면서 바꿀 수 있는 업무가 있는지는 더 알아볼 조건으로 남겨둘게요.'}];
  if(index===4)return[{role:'assistant',text:item.reading},{role:'user',text:'반복되는 마감 업무 말고, 새 운영안을 기획하고 시험하는 경험을 늘리고 싶어요.'},{role:'assistant',text:'그 경험과 연결되는 일을 하나씩 떠올려볼까요?'},{role:'user',text:'혼자 이력서 문장만 고칠 때보다 덜 막막해요.'},{role:'assistant',text:'떠오르는 장면부터 답하며 조금씩 구체화해도 괜찮아요.'}];
  return[{role:'assistant',text:'지금 바꿀 일과 지킬 생활을 나눠 정리했어요.'},{role:'user',text:'새 운영 경험은 늘리고, 온호시에서 사는 건 지키고 싶어요.'},{role:'assistant',text:'아직 모르는 조건은 남겨두고, 다음 질문에서 이어가도 돼요.'}];
 }
 function appendMessage(log,message,wait){const row=el('div','guide-chat-row '+message.role);if(message.role==='assistant'){const avatar=el('span','guide-ai-avatar','C');avatar.setAttribute('aria-label','CareerPilot');row.append(avatar)}const text=el('p','guide-chat-text');row.append(text);log.append(row);
  if(wait){text.classList.add('guide-dots');text.setAttribute('aria-label','CareerPilot 답변 작성 중');text.textContent='● ● ●';pending={text,value:message.text};clearTimeout(timer);timer=setTimeout(finishChat,1200)}else text.textContent=message.text;
 }
 function finishChat(){if(!pending)return;pending.text.textContent=pending.value;pending.text.classList.remove('guide-dots');pending.text.removeAttribute('aria-label');pending=null;clearTimeout(timer)}
 function summary(body){const grid=el('div','guide-summary');for(const [name,text]of[['바꿀 일','새 운영안을 기획하고 시험할 기회'],['지킬 생활','온호시 거주 · 재직 중 준비'],['아직 모르는 것','필요 소득 · 출퇴근 범위']]){const cell=el('div');cell.append(el('strong','',name),el('p','',text));grid.append(cell)}body.append(grid);requestBox(body)}
 function lesson(body,c){if(c.index===0){body.append(el('span','guide-tag','서안의 가상 예시'));invocation(body,c.service);return;}
  body.append(el('span','guide-tag','서안의 가상 예시'));const log=el('div','guide-chat');log.setAttribute('role','log');log.setAttribute('aria-label','서안과 CareerPilot의 가상 대화');log.setAttribute('aria-live','polite');body.append(log);
  if(c.index===5)summary(body);
  const item=tutorialStep(c.index,c.service);if(item.file){const a=el('a','guide-original','실제 캡처 원본 보기 ↗');a.href='assets/reference-ui/'+item.file;a.target='_blank';a.rel='noopener noreferrer';body.append(a)}
  body.append(el('p','guide-privacy','게임에 경력 자료를 올리지 않아요. 질문과 정리 순서는 실제 대화마다 달라질 수 있어요.'));
 }
 function updateChat(c){if(c.kind!=='lesson'||c.index===0)return;
  const log=panel.querySelector('.guide-chat');if(!log)return;
  const messages=lessonMessages(c.service,c.index),count=c.story?Math.min(messages.length,(c.ordinal??0)+1):messages.length;
  const nextKey=c.service+':'+c.index+':'+count;if(chatKey===nextKey&&log.children.length)return;finishChat();chatKey=nextKey;
  if(log.children.length>count)log.replaceChildren();
  for(let i=log.children.length;i<count;i++)appendMessage(log,messages[i],c.story&&i===count-1&&messages[i].role==='assistant'&&!reducedMotion());
  // Keep the incoming line readable; the footer never participates in scrolling.
  if(count>1)log.lastElementChild?.scrollIntoView({block:'nearest'});
 }
 async function next(){const c=current;if(!c||c.kind==='pick')return;
  if(c.story&&c.kind==='lesson'){if(pending)finishChat();await advance();return;}
  if(c.kind==='install'){
   if(c.index<4){bridge.wizardStep=c.index+1;sync();await checkpoint();return;}
   if(c.story){await checkpoint();await monogatari.run('jump TutorRequest',false);sync();return;}
   bridge.view='guide';bridge.guideStep=0;bridge.guideService=c.service;renderPanel();
  }else if(c.index<5){bridge.view='guide';bridge.guideStep=c.index+1;bridge.guideService=c.service;renderPanel();}else{await closePanel();return;}
  sync();await checkpoint();
 }
 async function back(){const c=current;if(c.kind==='install'){if(c.story&&c.label!=='TutorLinear'){bridge.wizardStep=Math.max(-1,c.index-1);await monogatari.run('jump TutorLinear',false)}else bridge.wizardStep=c.index-1;}else if(c.kind==='lesson'&&!c.story){if(c.index>0){bridge.view='guide';bridge.guideStep=c.index-1}else{bridge.view='install';bridge.wizardStep=4}}sync();await checkpoint();}
 function help(body,c,b){let help=body.querySelector('.guide-help');if(help){help.remove();b.setAttribute('aria-expanded','false');return;}
  help=el('section','guide-help');help.setAttribute('aria-label','이 단계 도움말');const hints=['다운로드가 안 되면 파일 다운로드를 다시 눌러주세요. 받은 ZIP은 브라우저 다운로드 목록이나 컴퓨터 다운로드 폴더에서 찾아요.','메뉴가 없다면 계정·조직의 업로드 권한을 확인해요. 실제 메뉴 이름은 계정에 따라 다를 수 있어요.','받은 careerpilot-'+c.service.toLowerCase()+'로 시작하는 ZIP을 선택해요. 일반 채팅에 첨부하는 것은 설치가 아니에요.','설치 목록에서 CareerPilot 이름과 활성화 상태를 확인해요. 조직 계정은 관리자 설정이 적용될 수 있어요.','새 대화에서 CareerPilot을 선택하거나 이름을 넣어요. 복사가 안 되면 문장을 길게 눌러 직접 복사해요.'];help.append(el('h3','','이 단계에서 막혔나요?'),el('p','',hints[c.kind==='install'?c.index:4]));const link=el('a','','서비스 공식 안내 ↗');link.href=c.service==='Claude'?'https://support.claude.com/en/articles/12512180-using-skills-in-claude':'https://help.openai.com/en/articles/20001256-plugins';link.target='_blank';link.rel='noopener noreferrer';help.append(link);body.prepend(help);body.scrollTop=0;b.setAttribute('aria-expanded','true');}
 function render(c){const hadFocus=panel.contains(document.activeElement);finishChat();key=[c.story?'story':'panel',c.kind,c.index,c.service,c.part??0].join(':');panel.replaceChildren();chatKey='';
  if(c.kind==='practice'){CP_PRACTICE.render(panel,c);requestAnimationFrame(()=>document.documentElement.style.setProperty('--practice-height',Math.ceil(panel.getBoundingClientRect().height)+'px'));return;}
  const header=el('header','guide-header');header.append(progress(c));const line=el('div','guide-heading');const h=el('h2','',title(c));h.id='guide-panel-heading';const small=el('span','guide-substep',c.kind==='pick'?'':c.kind==='install'&&c.index<3?(c.index+1)+' / 3':c.kind==='lesson'&&c.index>0?c.index+' / 5':c.kind==='install'&&c.index===4?'1 / 2':c.kind==='lesson'?'2 / 2':'1 / 1');line.append(h,small);header.append(line);panel.setAttribute('aria-labelledby',h.id);
  const body=el('div','guide-body');body.tabIndex=0;body.setAttribute('role','region');body.setAttribute('aria-label','안내 본문 · 스크롤해서 계속 읽기');if(c.kind==='pick')selection(body,c);else if(c.kind==='install')installation(body,c);else lesson(body,c);
  const footer=el('footer','guide-footer'),left=el('div','guide-secondary');
  if(c.kind!=='pick'&&!(c.story&&c.kind==='lesson'))left.append(button('이전','guide-text',back));
  left.append(button(c.story?'나중에 볼게요':'닫기','guide-text',()=>c.story?CP_REVIEW.deferTutorial(c.kind==='lesson'?'guide':'install',Math.max(0,c.index)):closePanel()));
  const helpButton=button('?','guide-help-button',()=>help(body,c,helpButton));helpButton.setAttribute('aria-label','이 단계 도움말');helpButton.setAttribute('aria-expanded','false');left.append(helpButton);
  const primary=button('다음 ▸','guide-primary',next);primary.disabled=c.kind==='pick';footer.append(left,primary);panel.append(header,body,footer);if(c.kind==='pick'&&innerWidth<1000&&innerHeight<=600)requestAnimationFrame(()=>{const first=body.querySelector('.guide-service');body.scrollTop=Math.max(0,first.offsetTop-body.offsetTop+(first.offsetHeight-body.clientHeight)/2)});if(hadFocus&&!primary.disabled)primary.focus({preventScroll:true});
  if(!reducedMotion())body.animate([{opacity:0},{opacity:1}],{duration:180,easing:'ease-out'});
 }
 function sync(){cancelAnimationFrame(frame);const c=context();current=c;panel.hidden=!c;document.body.dataset.guidePanel=c?(c.story?'story':'panel'):'false';$('preparation').dataset.guide=String(!!c&&!c.story);
  if(!c){key='';document.body.dataset.practice='false';document.body.dataset.practiceCollapsed='false';finishChat();return;}
  const parent=c.story?document.body:$('preparation');const moved=panel.parentNode!==parent;if(moved)parent.append(panel);
  if(c.story){document.querySelectorAll('#story-use,#story-install,#service-picker-note,#tutorial-later,#tutorial-watch').forEach(n=>n.hidden=true)}
  panel.dataset.kind=c.kind;panel.dataset.service=c.service;document.body.dataset.practice=c.kind==='practice'?c.status:'false';panel.dataset.collapsed=String(c.kind==='practice'&&!!c.collapsed);document.body.dataset.practiceCollapsed=String(c.kind==='practice'&&!!c.collapsed);const nextKey=[c.story?'story':'panel',c.kind,c.index,c.service,c.part??0].join(':');if(key!==nextKey)render(c);updateChat(c);if(c.kind==='practice')requestAnimationFrame(()=>document.documentElement.style.setProperty('--practice-height',Math.ceil(panel.getBoundingClientRect().height)+'px'));if(moved&&!c.story)queueMicrotask(()=>panel.querySelector(c.kind==='pick'?'.guide-service':'.guide-primary')?.focus({preventScroll:true}));
 }
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(sync);}
 const originalSync=syncStoryUI;syncStoryUI=function(){originalSync();sync()};
 const originalPanel=renderPanel;renderPanel=function(){originalPanel();sync()};
 const originalGuide=renderGuide;renderGuide=function(){if(window.CP_GUIDE){schedule();return}originalGuide()};
 new MutationObserver(schedule).observe($('preparation'),{attributes:true,attributeFilter:['open']});
 return{sync,schedule,phase,context,finishChat,el,button,logo,requestBox};
})();

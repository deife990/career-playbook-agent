'use strict';
// A single route is selected at entry. Each subsequent surface has one next action.
const CP_WIZARD=(()=>{
 const request=FIRST_REQUEST;
 const titles=['CareerPilot 파일 받기','설치 메뉴 열기','받은 ZIP 파일 올리기','CareerPilot 설치·활성화 확인','새 대화에서 시작하기','첫 요청 보내기','질문에 내 상황 말하기','정리된 조건 확인하기'];
 const actions={ChatGPT:[
  '아래 링크로 ChatGPT용 파일을 받아요. 압축을 풀지 말고 다운로드 폴더에 그대로 두세요.',
  'ChatGPT 왼쪽의 플러그인을 열고, Personal(개인용) 탭을 선택해요.',
  '개인용 플러그인의 추가 메뉴에 ZIP 업로드가 보이면, 방금 받은 ChatGPT용 파일을 골라요. 메뉴가 없다면 아래 도움말을 열어주세요.',
  '설치 화면에서 이름이 CareerPilot인지 확인하고 설치해요. 설치된 플러그인 목록에서 다시 확인하세요.',
  '새 채팅을 열고 입력창에서 @를 입력해 CareerPilot을 골라요. 입력창에 이름이 들어오면 준비됐어요.',
  '아래 요청을 복사해 CareerPilot이 선택된 입력창에 붙여넣고 전송해요.',
  '현재 상황을 묻는 질문이 오면, 지금 하는 일과 바꾸고 싶은 점 하나부터 답해요. 아래는 서안의 예시예요.',
  '내가 바꾸고 싶은 일과 지키고 싶은 생활이 맞게 정리됐는지 읽어봐요. 틀린 부분은 대화로 고쳐주세요.'
 ],Claude:[
  '아래 링크로 Claude용 파일을 받아요. 압축을 풀지 말고 다운로드 폴더에 그대로 두세요.',
  'Claude를 열고 왼쪽 사이드바의 Customize(사용자 지정), 그 안의 Skills(스킬)을 선택해요.',
  'Skills의 + 버튼 → Create skill → Upload a skill 순서로 열고, 받은 Claude용 ZIP을 선택해요.',
  'Skills 목록에서 CareerPilot 오른쪽 스위치를 켜요. 꺼져 있으면 대화에서 사용할 수 없어요.',
  '새 대화를 열어요. /careerpilot을 선택하거나 CareerPilot 이름을 넣어 요청할 수 있어요.',
  '아래 요청을 복사해 Claude의 새 대화에 붙여넣고 전송해요. CareerPilot 스킬이 켜져 있어야 해요.',
  '지금 하는 일에서 가장 바꾸고 싶은 점을 묻는다면, 떠오르는 한두 문장이면 충분해요. 아래는 서안의 예시예요.',
  '바꿀 업무와 지킬 생활이 나뉘었는지 확인해요. 아직 모르는 급여나 이동 범위는 모른다고 남겨도 괜찮아요.'
 ]};
 const make=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls||'';if(text)n.textContent=text;return n;};
 function appFrame(service,index){
  if(service==='ChatGPT')return CP_INSTALL_UI.frame(index);
  const app=make('section','wizard-app');app.setAttribute('aria-label',service+' 설치 설명용 화면');
  app.append(make('div','wizard-app-title',service+' · 설명용 화면'));
  const inner=make('div','wizard-app-body');
  if(index===1){
   const side=make('aside','wizard-sidebar');side.append(make('p','','새 대화'),make('p','highlight',service==='Claude'?'Customize':'Plugins'));inner.append(side);
   const main=make('div','wizard-app-main');main.append(make('small','','여기를 선택해요 ↓'),make('div','highlight target',service==='Claude'?'Skills  스킬':'Personal  개인용'));inner.append(main);
  }else if(index===2){
   const main=make('div','wizard-app-main');main.append(make('small','','① 추가 메뉴 열기'),make('div','highlight target',service==='Claude'?'+ → Create skill → Upload a skill':'+ → ZIP 업로드'),make('small','','② 다운로드 폴더에서 이 파일 선택'),make('div','wizard-file','careerpilot-'+service.toLowerCase()+'-v1.2.0-rc.7.zip'));inner.append(main);
  }else if(index===3){
   const main=make('div','wizard-app-main');main.append(make('small','','Skills 또는 설치된 플러그인 목록'),make('div','wizard-plugin-row','C  CareerPilot'),make('div','wizard-on',service==='Claude'?'켜짐':'✓ 설치된 플러그인'));inner.append(main);
  }else if(index===4||index===5){inner.append(CP_LESSON_UI.composer(service,index===4?'이름을 선택한 뒤, 다음 단계에서 첫 요청을 적어요.':request));}
  if(index===3){const status=inner.querySelector('.wizard-on');if(status&&service==='Claude'){const toggle=make('span','demo-switch');toggle.setAttribute('role','img');toggle.setAttribute('aria-label','스킬이 켜진 스위치 예시');status.prepend(toggle)}}
  app.append(inner);return app;
 }
 async function move(root,story,step){bridge.wizardStep=step;localStorage.setItem('CPPreferredService',bridge.service);bridge.guideService=bridge.service;root.dataset.renderKey='';render(root,story);await checkpoint();root.querySelector('h2')?.focus({preventScroll:true});}
 function render(root,story){
  if(window.CP_GUIDE){CP_GUIDE.schedule();return;}
  const service=bridge.service,index=Number.isInteger(bridge.wizardStep)?bridge.wizardStep:-1,key=service+':'+index;
  if(root.dataset.renderKey===key)return;root.dataset.renderKey=key;root.dataset.step=String(index);root.replaceChildren();root.className='linear-wizard';
  if(index<0){
   root.append(make('small','wizard-kicker','CareerPilot과 첫 대화까지'),make('h2','','평소 쓰는 서비스가 있나요?'),make('p','','하나만 고르면 돼요. 다운로드부터 차례대로 같이 해볼게요.'));
   const choices=make('div','wizard-services');for(const name of ['ChatGPT','Claude']){const button=make('button','wizard-service',name+'로 시작 →');button.onclick=()=>{bridge.service=name;move(root,story,0);};choices.append(button);}root.append(choices);const taste=make('button','wizard-text','설치 없이 일반 대화로 맛보기');taste.onclick=()=>CP_REVIEW.openTaste();root.append(taste);if(story){const later=make('button','wizard-text','나중에 볼게요 · 이야기 계속 ▸');later.onclick=()=>CP_REVIEW.deferTutorial('install',0);root.append(later);}return;
  }
  const phase=index<5?'설치':'첫 요청',phaseIndex=index<5?index+1:index-4,total=index<5?5:3;
  const header=make('header','wizard-heading');header.append(make('small','wizard-kicker',service+' · '+phase+' '+phaseIndex+' / '+total),make('h2','',(index===3?(service==='Claude'?'CareerPilot 켜짐 확인':'CareerPilot 설치 확인'):titles[index])||'첫 준비를 마쳤어요'));header.querySelector('h2').tabIndex=-1;root.append(header);
  const progress=make('div','wizard-progress');progress.setAttribute('role','progressbar');progress.setAttribute('aria-label','설치와 첫 사용 진행');progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax',String(total));progress.setAttribute('aria-valuenow',String(phaseIndex));progress.style.setProperty('--progress',Math.min(100,phaseIndex/total*100)+'%');root.append(progress);
  root.append(make('p','wizard-instruction',actions[service][index]||'내 조건은 대화하면서 조금씩 구체화하면 돼요.'));
  const next=make('button','wizard-next');
  if(index===0){
   const preflight=make('section','preflight');preflight.append(make('h3','','시작 전 확인'),make('p','','질문에 답하며 지금 하는 일·바꾸고 싶은 것·지키고 싶은 조건을 정리해요. 이력서 없이도 시작할 수 있어요.'),make('p','',service==='Claude'?'컴퓨터의 웹 또는 데스크톱 앱을 권장해요. 로그인 후 사용자 지정(Customize)에 스킬(Skills)이 보이는지 확인해요.':'개인 계정인지 회사 워크스페이스인지 확인해요. ZIP 업로드 메뉴와 업로드 권한이 있는 계정에서만 설치할 수 있어요.'),make('p','wizard-note','모바일 ZIP 업로드는 확인하지 못했어요. 아래 메뉴가 실제 계정에 없으면 도움말을 확인해주세요.'));root.append(preflight);
   const file=make('div','wizard-download');file.append(make('span','wizard-file-icon','ZIP'),make('strong','',service+'용 CareerPilot'));
   const link=make('a','wizard-next',service+'용 파일 다운로드 ↓');link.href='downloads/careerpilot-'+service.toLowerCase()+'-v1.2.0-rc.7.zip';link.download='';link.onclick=()=>{next.hidden=false;link.classList.add('downloaded');link.textContent='다시 다운로드 ↓';status.textContent='다운로드를 요청했어요. 다운로드 폴더를 확인하세요.';next.classList.add('download-ready');};const status=make('p','download-status');status.setAttribute('role','status');file.append(link,make('p','wizard-note','CareerPilot ZIP 파일은 압축을 풀지 않아요.'),status);root.append(file);next.textContent='받았어요 · 다음 →';next.hidden=false;
   const installed=make('button','wizard-text','이미 설치했어요 · 마지막 단계로');installed.onclick=()=>move(root,story,4);root.append(installed);
  }else if(index<=5)root.append(appFrame(service,index));
  else {
   const reading=make('section','wizard-example');reading.append(make('small','wizard-kicker','서안의 가상 예시'));
   if(index===6){const typed=make('p','typing-copy','운영 업무 7년째야. 매일 시설 확인하고, 민원 받고, 마감해. 새 운영안을 기획하고 직접 시험해보고 싶어. 대신 고향 온호시에 계속 살면서, 월급은 받으며 준비하고 싶어.');reading.append(typed);}
   else{for(const [h,t] of [['바꾸고 싶은 일','새 운영안을 기획하고 시험할 기회'],['지키고 싶은 생활','온호시 거주 · 재직 중 이직 준비'],['아직 모르는 조건','필요 소득 · 출퇴근 범위']]){reading.append(make('h3','',h),make('p','',t));}}
   root.append(reading);
  }
  if(index===5){const copy=make('button','wizard-text','첫 요청 복사');copy.onclick=async()=>{try{await navigator.clipboard.writeText(request);copy.textContent='복사했어요 ✓';}catch{copy.textContent='아래 문장을 선택해 복사해주세요.';}};root.append(copy);}
  const help=make('details','wizard-help');help.append(make('summary','','이 단계에서 막혔나요?'));
  const hints=[
   '다운로드가 안 되면 다시 다운로드를 눌러주세요. 파일은 브라우저의 다운로드 목록이나 컴퓨터 다운로드 폴더에서 찾아요. 파일을 이미 받았다면 다음으로 진행해요.',
   service==='Claude'?'스킬(Skills) 메뉴가 없다면 계정·조직 권한과 코드 실행 기능을 공식 안내에서 확인해요. 실제 메뉴 이름은 계정에 따라 다를 수 있어요.':'ZIP 업로드는 계정·워크스페이스의 업로드 권한이 필요해요. Personal 경로는 기존 테스트 환경의 예시예요. 실제 메뉴 이름은 계정에 따라 다를 수 있어요.',
   '받은 파일 중 careerpilot-'+service.toLowerCase()+'로 시작하는 ZIP을 선택해요. 일반 채팅에 파일을 첨부하는 것은 설치가 아니에요.',
   service==='Claude'?'스킬 목록의 CareerPilot 스위치를 확인해요. 안 켜진다면 계정·조직의 코드 실행 권한을 공식 안내에서 확인해주세요.':'플러그인 이름이 CareerPilot인지, 설치됨으로 표시되는지 확인해요. 권한이 없다면 워크스페이스 관리자에게 확인해주세요.',
   '새 대화에서 CareerPilot을 선택하거나 이름을 넣어 요청해요. 설치 목록에 없다면 이전 단계에서 설치를 확인해요.',
   '복사가 안 되면 문장을 직접 선택해 복사해요. 요청은 게임 안이 아니라 본인의 서비스 대화에 보내요.',
   '모르는 급여·거리·시기는 아직 모르겠다고 말해도 돼요. 한 번에 한두 문장이면 충분해요.',
   '정리에서 틀린 부분을 서비스 대화에 알려줘요. 실제 일자리와 조건이 가능한지는 추가 확인이 필요해요.'
  ];const hint=hints[index]||hints[0];
  help.append(make('p','',hint));const official=make('a','','서비스 공식 안내 ↗');official.href=service==='Claude'?'https://support.claude.com/en/articles/12512180-using-skills-in-claude':'https://help.openai.com/en/articles/20001256-plugins-in-chatgpt';official.target='_blank';official.rel='noopener noreferrer';help.append(official);const taste=make('button','wizard-text','설치가 안 되나요? 일반 대화로 맛보기');taste.onclick=()=>CP_REVIEW.openTaste();help.append(taste);root.append(help);const tasteEntry=make('button','wizard-text taste-entry','설치 없이 먼저 맛보기');tasteEntry.onclick=()=>CP_REVIEW.openTaste();if(index===0)root.append(tasteEntry);
  const footer=make('footer','wizard-footer');const back=make('button','wizard-text',index===0?'서비스 다시 고르기':'← 이전');back.onclick=()=>move(root,story,index-1);footer.append(back);
  if(index!==0)next.textContent=index===4&&story?'서안과 첫 요청 보내기 →':index===7?'첫 준비 마치기 ✓':['','메뉴 열었어요 · 다음 →','파일 올렸어요 · 다음 →','목록에서 확인했어요 · 다음 →','CareerPilot 골랐어요 · 다음 →','요청 보냈어요 · 다음 →','답변해봤어요 · 다음 →'][index];
  next.onclick=async()=>{if(story&&index===4){await checkpoint();await monogatari.run('jump TutorRequest',false);}else if(index===7){root.dataset.renderKey='done';root.replaceChildren(make('h2','','첫 대화를 시작했어요.'),make('p','','한 번에 다 정할 필요는 없어요. 다음 질문에도 내 경험으로 답하면 돼요.'));const done=make('button','wizard-next','이야기로 돌아가기');done.onclick=closePanel;root.append(done);}else move(root,story,index+1);};if(story){const later=make('button','wizard-text wizard-later','나중에 볼게요');later.title='이야기를 계속하고 1화 정리에서 다시 볼 수 있어요.';later.onclick=()=>CP_REVIEW.deferTutorial('install',index);footer.append(later);}footer.append(next);root.append(footer);root.scrollTop=0;
 }
 return {render,titles,actions,appFrame};
})();

const CP_PUB_POSES={E01:[['호숫가 펍.','chin'],['창밖으로','seated'],['소매','chin']],E01Talk:[['공지에 매각','chin'],['설명회 때','chin'],['아침에 같은','seated'],['컵을 내려놓','chin'],['창밖','window']],E04:[['내려놓는다. 서안은 컵','chin']],E05:[['벌써 지원','chin'],['창밖','window']]};
const CP_STAGE=(()=>{
 let key='',typingJob=null,typingTimer=null;
 const pubLabels=new Set(['E01','E01Talk','E02','E04','Promise','E05','C1_CALL_A','C1_CALL_B','C1_CALL_C','C2_A','C2_B','C2_C','C2_CALL_A','C2_CALL_B','C2_CALL_C','C3_A','C3_B','C3_C']);
 function render(label,statement){
  const active=playing(),gate=active&&label==='P02',pub=active&&(pubLabels.has(label)||label.startsWith('Tutor')||/^E03/.test(label));
  const home=active&&(['E05Messages','E05Last','CardLesson','Finish','ReplyA','ReplyB','ReplyC','EndQuiet'].includes(label)||/^C3_CALL_/.test(label));
  document.body.dataset.home=String(home);
  const art=document.getElementById('narrative-art'),img=document.getElementById('narrative-image');art.hidden=!(gate||pub||home);document.body.dataset.narrativeArt=String(gate||pub||home);document.body.dataset.linear=String(active&&label==='TutorLinear');
  if(gate||pub||home){
   const pose=typeof statement==='string'?CP_PUB_POSES[label]?.find(([prefix])=>statement.includes(prefix))?.[1]:null;document.body.dataset.pubPose=pose||'';
   const actionPose=pose==='chin'||pose==='window'||typeof statement==='string'&&/杯|컵을 내려놓|소매|팔을 테이블|설명회|본사가|본사 돈|창밖|시선을 내렸다/.test(statement);
   const reflective=actionPose||(label==='E01Talk'||label==='E05'||(typeof statement==='string'&&/이력서|모르겠|막막|망설|무섭|뭘 바꾸고/.test(statement)))&&!(typeof statement==='string'&&/잔에 맺힌|컵을|잔을/.test(statement));
   const laugh=pose==='laugh'||label==='C1_CALL_C'||(typeof statement==='string'&&/웃는다|성실했네|약속할까/.test(statement));
   const message=label==='E02'&&typeof statement==='string'&&/^(i|out) /.test(statement);
   const file=message?'lake-pub-night.png':home?'home-protagonist-v0102.png':gate?'gate-together-v0102.png':laugh?'seoan-pub-laugh-v092.png':(pose!=='seated'&&reflective)?'seoan-pub-chin-v091.png':'seoan-pub-seated-v092.png';
   if(!img.src.endsWith(file))img.src='assets/'+file;
   img.alt=message?'호숫가 야경이 보이는 빈 펍. 이서와 서안의 메시지 대화가 이어진다.':home?'펍에서와 같은 짧은 갈색 머리의 주인공이 집에서 외투를 벗고 책상에 앉아 휴대폰을 본다. 얼굴은 보이지 않는다.':gate?'게이트를 막 나온 두 사람이 호숫가 길에서 헤어지기를 망설이며 마주 선다. 주인공은 뒷모습이다.':laugh?'어깨에 힘을 빼고 앉은 서안이 잔에 한 손을 가볍게 얹은 채 웃는다.':reflective?'아이보리 니트 차림의 서안이 한 손으로 턱을 가볍게 괴고 생각한다.':'테이블 맞은편 서안이 어깨에 힘을 빼고 앉아 한 손은 잔에 가볍게 두고, 다른 팔은 몸 옆으로 내려놓는다.';
  }
  // Reconstructed example text types in place; a tap completes it immediately.
  const nextKey=label+':'+bridge.service;if(key===nextKey)return;key=nextKey;finishTyping();
  const text=document.querySelector('#story-use-shot .lesson-reading p');
  if(!window.CP_GUIDE&&text&&['TutorChatGPTContext','TutorClaudeContext'].includes(label)&&!reducedMotion()){
    const full=text.textContent,letters=Array.from(full);let cursor=0;text.textContent='';text.setAttribute('aria-label',full);text.classList.add('typing-copy-active');typingJob={text,full};
    typingTimer=setInterval(()=>{cursor=Math.min(letters.length,cursor+Math.max(1,Math.ceil(letters.length/50)));text.textContent=letters.slice(0,cursor).join('');if(cursor===letters.length)finishTyping();},30);
  }
 }
 function finishTyping(){if(!typingJob)return false;clearInterval(typingTimer);typingJob.text.textContent=typingJob.full;typingJob.text.classList.remove('typing-copy-active');typingJob=null;return true;}
 return {render,finishTyping};
})();

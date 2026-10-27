'use strict';
const $ = id => document.getElementById(id);
const SLOT = 'CPEpisode_1', SCHEMA = 'ep01-script-v11';
function preferredService(){try{return localStorage.getItem('CPPreferredService')==='Claude'?'Claude':'ChatGPT'}catch{return 'ChatGPT'}}
const initialBridge = () => ({schema:SCHEMA,panel:false,view:'cards',card:'first',requestIndex:0,service:preferredService(),detail:false,report:null,guideStep:0,guideService:preferredService(),installStep:0,wizardStep:-1,deferredTutorial:null,practice:null,practicePrivacySeen:false,tutorial:CP_TUTORIAL_STATE.fresh(),practiceHistory:CP_TUTORIAL_STATE.history(null,null)});
let bridge=initialBridge(), ready=false, restoring=false, busy=false, settled=false, saveTimer, returnFocus;
const say = text => { $('notice').textContent=text; };
const panelSay = text => { $('panel-status').textContent=text; };
const finished = () => monogatari.state('label')==='Finish';
const playing = () => !!monogatari.global('playing') && $('welcome').hidden;
const card = () => CP_CARDS.find(item=>item.id===bridge.card) || CP_CARDS[0];
const views=['cards','request','install','history','settings','preview','guide'];
monogatari.settings({Name:'CareerPilot Office Romance Beta',Version:'0.14.0-dev',Label:'Opening',SaveLabel:'CPEpisode',AutoSave:0,Screenshots:false,ServiceWorkers:false,Orientation:'any',Preload:true,TypeAnimation:false,AllowRollback:false,ShowMainScreen:true,Storage:{Adapter:'LocalStorage',Store:'Story',Endpoint:''},AssetsPath:{root:'assets',scenes:'',characters:''}});
monogatari.preferences({Language:'한국어',TextSpeed:0});
monogatari.storage({c1:null,c2:null,c3:null,bridge,selfReason:'나도 회사는 바꾸고 싶은데, 지금 생활까지 전부 바뀔까 봐 망설여져.',log:[]});
monogatari.assets('scenes',{office:'office-evening-v81.png',gate:'gate-night.png',cafe:'lake-pub-night.png',home:'home-protagonist-v0102.png'});
monogatari.characters({thought:{name:'나 · 속마음',color:'#3e6674'},staff:{name:'동료',color:'#605568'},reply:{name:'다른 동료',color:'#605568'},s:{name:'서안',color:'#86563d',sprites:{smile:'seoan-smile-v4.png',neutral:'seoan-front.png',avert:'seoan-avert-v4.png',serious:'seoan-serious-v4.png',listening:'seoan-listening-v4.png',laugh:'seoan-laugh-v4.png',shy:'seoan-shy-v5.png',burst:'seoan-burst-v5.png',thoughtful:'seoan-thoughtful-v6.png'}},me:{name:'나',color:'#3e6674'},y:{name:'윤 팀장 · 팀 채팅',color:'#605568'},n:{name:'나리',color:'#8a6757',sprites:{front:'nari-front.png',smile:'nari-smile.png',thoughtful:'nari-thoughtful.png'}},phone:{name:'휴대폰 알림',color:'#57736b'},notice:{name:'사내 공지',color:'#617180'},i:{name:'이서 · 메시지',color:'#766089'},msg:{name:'서안 · 메시지',color:'#86563d'},replymsg:{name:'나 · 메시지',color:'#3e6674'},out:{name:'서안 → 이서',color:'#86563d'},ai:{name:'CareerPilot 예시',color:'#3e6674'}});
monogatari.script(CP_STORY.script);
function stableStatement(statement){return !!statement?.Choice || typeof statement==='string' && !['show ','hide ','jump '].some(prefix=>statement.startsWith(prefix));}
function migrateV8(data){
  if(data?.game?.storage?.bridge?.schema!=='ep01-script-v8')return data;
  const copy=structuredClone(data),g=copy.game,b=g.storage.bridge,old=CP_V08_STEPS[g.state.label]?.[g.state.step];
  if(!Number.isInteger(g.state.step)||typeof old!=='string'||/^(show |hide |jump |@command)/.test(old))return data;
  b.schema='ep01-script-v9';b.wizardStep=-1;
  if(/^Tutor(ChatGPTUpload|ChatGPTEnable|InstallUpload|InstallEnable|InstallChat|ChatGPTChat|ClaudeChat)$/.test(g.state.label)){
    b.wizardStep=({TutorChatGPTUpload:1,TutorInstallUpload:2,TutorChatGPTEnable:3,TutorInstallEnable:3,TutorInstallChat:4,TutorChatGPTChat:4,TutorClaudeChat:4})[g.state.label]??0;g.state.label='TutorLinear';g.state.step=CP_V9_ANCHORS.TutorLinear.findIndex(x=>typeof x==='string'&&!/^(show |hide |jump |@command)/.test(x));
  }else{
    const lines=CP_V9_ANCHORS[g.state.label]||[];const anchor=old.includes('똑, 똑, 똑')?lines.find(x=>typeof x==='string'&&x.includes('똑, 똑, 똑'))||old:old;let index=lines.findIndex(x=>old==='@choice'?x==='@choice':x===anchor);
    if(index<0&&old.startsWith('msg 너도 오늘 얘기한'))index=lines.findIndex(x=>typeof x==='string'&&x.startsWith('msg 너도 오늘 얘기한'));
    g.state.step=index>=0?index:Math.max(0,lines.findIndex(x=>x==='@choice'||typeof x==='string'&&!/^(show |hide |jump |@command)/.test(x)));
  }
  return copy;
}
function migrateV9(data){
  data=migrateV8(data);
  if(data?.game?.storage?.bridge?.schema!=='ep01-script-v9')return data;
  const copy=structuredClone(data),g=copy.game,label=g.state.label,old=CP_V9_ANCHORS[label]||[],line=old[g.state.step],current=CP_V10_ANCHORS[label]||[];
  if(!Number.isInteger(g.state.step)||!(line==='@choice'||typeof line==='string'&&!/^(show |hide |jump |@command)/.test(line)))return data;
  const stable=x=>x==='@choice'||typeof x==='string'&&!/^(show |hide |jump |@command)/.test(x);
  let index=current.findIndex(x=>line==='@choice'?x==='@choice':x===line);
  if(index<0&&line&&CP_SAVE_ALIASES[line])index=current.findIndex(x=>x===CP_SAVE_ALIASES[line]);
  if(label==='CardLesson'&&g.state.step>=old.findIndex(x=>x.startsWith?.('1화에서 함께 한 것'))){g.state.label='Finish';index=0;}
  if(index<0){for(let i=g.state.step+1;i<old.length;i++){index=current.findIndex(x=>x===old[i]&&stable(x));if(index>=0)break;}}
  if(index<0)index=Math.max(0,current.findIndex(stable));
  g.state.step=index;g.storage.bridge.schema='ep01-script-v10';
  if(!g.storage.selfReason)g.storage.selfReason={A:'나도 오늘 한 일 적으려니까 같은 안내만 떠올라. 이러다 다른 데선 뭘 할 수 있을지 모르겠어.',B:'나도 바꾸고는 싶은데, 월급 끊길까 봐 선뜻 못 움직이겠어.',C:'나도 회사는 바꾸고 싶은데, 이 동네는 못 떠나겠어.'}[g.storage.c2]||'나도 회사는 바꾸고 싶은데, 지금 생활까지 전부 바뀔까 봐 망설여져.';
  return copy;
}
function migrateSave(data){
  data=migrateV9(data);
  const schema=data?.game?.storage?.bridge?.schema;
  if(!['ep01-script-v10',SCHEMA].includes(schema))return data;
  const copy=structuredClone(data),g=copy.game,b=g.storage.bridge;
  if(schema==='ep01-script-v10'){
    const label=g.state.label,old=CP_V10_ANCHORS[label],line=old?.[g.state.step];
    if(!Number.isInteger(g.state.step)||!(line==='@choice'||typeof line==='string'&&!/^(show |hide |jump |@command)/.test(line)))return data;
    if(/^TutorChatGPT/.test(label))b.service=b.guideService='ChatGPT';
    if(/^TutorClaude|^TutorInstall(?:Upload|Enable)$/.test(label))b.service=b.guideService='Claude';
    b.tutorial=CP_TUTORIAL_STATE.legacy(b,label);
    const example=['TutorRequest','TutorContext','TutorChatGPTContext','TutorClaudeContext','TutorConditions','TutorKeep','TutorFollowup'];
    if(example.includes(label)){g.state.label='TutorRequest';g.state.step=CP_STORY.script.TutorRequest.findIndex(stableStatement)}
    else if(/^Tutor(Linear|Install|ChatGPT(?:Upload|Enable|Chat)|ClaudeChat)/.test(label)){g.state.label='E03Actual';g.state.step=0}
    else if(['E03Actual','E03Example'].includes(label)){g.state.step=0}
    else if(label==='TutorNext'){g.state.label='E03';g.state.step=0}
    else{
      const current=CP_STORY.script[label]||[];
      // Match the occurrence within its label, then its nearest following semantic anchor.
      const find=(text,at)=>{const ordinal=old.slice(0,at+1).filter(x=>x===text).length-1;const matches=current.map((x,i)=>(text==='@choice'?!!x?.Choice:x===text)?i:-1).filter(i=>i>=0);return matches[Math.min(ordinal,matches.length-1)]??-1};
      let index=find(line,g.state.step);
      if(index<0)for(let i=g.state.step+1;i<old.length;i++){index=find(old[i],i);if(index>=0&&stableStatement(current[index]))break;index=-1}
      if(index<0&&label==='E02')index=current.map((x,i)=>stableStatement(x)?i:-1).filter(i=>i>=0).at(-1);
      if(index<0&&label==='TutorialStart'){g.state.label='TutorRequest';b.tutorial={...CP_TUTORIAL_STATE.fresh(),active:true};index=0;}
      if(index<0)return data;
      g.state.step=index;
    }
    b.schema=SCHEMA;
  }
  b.tutorial=CP_TUTORIAL_STATE.normalize(b.tutorial);
  const prep=b.tutorial.preparationReturn,prepCard=CP_CARDS.find(c=>c.id===prep?.card);
  if(prep&&(!prepCard||prep.requestIndex>=prepCard.requests.length))b.tutorial.preparationReturn=null;
  b.practiceHistory=CP_TUTORIAL_STATE.history(b.practiceHistory,b.practice);
  if(b.practice?.status==='external_opened')b.practice.status='returned';
  // A valid story position wins over a stale dialog owner after interrupted navigation.
  const expected={TutorRequest:'intro-example',E03Example:'example-reread',E03Actual:'story-practice'}[g.state.label];
  if(b.tutorial.active&&b.tutorial.owner==='story'&&expected!==b.tutorial.returnTarget)b.tutorial.active=false;
  return copy;
}
function validSave(data){
  data=migrateSave(data);
  const g=data?.game,s=g?.state,v=g?.storage,b=v?.bridge,list=CP_STORY.script[s?.label];
  if(b?.practice!=null&&!window.CP_HANDOFF?.validPractice(b.practice))return false;
  if(b?.practicePrivacySeen!=null&&typeof b.practicePrivacySeen!=='boolean')return false;
  if(b?.schema!==SCHEMA || !Array.isArray(list) || !Number.isInteger(s.step) || !stableStatement(list[s.step]))return false;
  if(!['c1','c2','c3'].every(key=>['A','B','C',null].includes(v[key])))return false;
  const label=s.label;
  for(const key of ['c1','c2','c3'])if(label.startsWith(key.toUpperCase()+'_') && !label.endsWith('_'+v[key]))return false;
  return typeof b.panel==='boolean' && views.includes(b.view) && CP_CARDS.some(c=>c.id===b.card)
    && ['ChatGPT','Claude'].includes(b.service) && ['ChatGPT','Claude'].includes(b.guideService) && Number.isInteger(b.requestIndex) && b.requestIndex>=0
    && b.requestIndex<CP_CARDS.find(c=>c.id===b.card).requests.length && typeof b.detail==='boolean'
    && Number.isInteger(b.installStep) && b.installStep>=0 && b.installStep<=4
    && Number.isInteger(b.wizardStep) && b.wizardStep>=-1 && b.wizardStep<=7
    && Number.isInteger(b.guideStep) && b.guideStep>=0 && b.guideStep<=5
    && Array.isArray(v.log) && v.log.every(row=>typeof row.text==='string') && g.history && typeof g.history==='object';
}
// Serialize writes so an earlier asynchronous save cannot replace a later context.
let checkpointTail=Promise.resolve();
function checkpoint(){const task=checkpointTail.then(writeCheckpoint,writeCheckpoint);checkpointTail=task.catch(()=>false);return task;}
async function writeCheckpoint(){
  if(!ready || restoring || transitioning)return false;
  if(!playing())return true; // Title has no story position to save.
  clearTimeout(saveTimer);
  monogatari.storage({bridge:structuredClone(bridge)});
  const expected=JSON.stringify(monogatari.object());
  try{
    await monogatari.saveTo('SaveLabel',1,'프롤로그·1화 이어서');
    const saved=await monogatari.Storage.get(SLOT);
    if(!validSave(saved) || JSON.stringify(saved.game)!==expected)throw new Error('Save verification failed');
    say('');return true;
  }catch(error){say('저장하지 못했어요. 이 탭을 열어둔 채 계속하거나 브라우저 저장 설정을 확인해주세요.');return false;}
}
function syncStoryUI(){
  syncDialogLayout();
  renderWorkday();
  const label=monogatari.state('label'),isGate=WORKDAY_LABELS.has(label)||label==='Start'||/^C1_[ABC]$/.test(label)||label==='P02';
  $('chapter').textContent=WORKDAY_LABELS.has(label)?'프롤로그 · 오늘도 수고하셨습니다':isGate?'프롤로그 · 월급은 들어왔는데':label==='Finish'?'1화 끝':'1화 · 떠날 이유, 남을 이유';
  const hint=label==='E03Example'?'가상 대화 예시 · 실제 AI 응답이 아님':label==='E01Talk'&&!!document.querySelector('choice-container')?'이야기 속 마음을 골라주세요. 실제 조건은 CareerPilot에서 직접 이야기해요.':'';
  $('story-hint').textContent=hint;$('story-hint').hidden=!hint;
  const over=finished();$('end-actions').hidden=!over;$('play-controls').hidden=over||!playing();
  $('next').disabled=!!document.querySelector('choice-container');
  $('tutorial-watch').hidden=!label.startsWith('Tutor');
  monogatari.global('block',transitioning||$('preparation').open||window.CP_GUIDE?.isOpen()||over||['TutorRequest','E03Example','E03Actual'].includes(label));
  const line=document.querySelector('text-box')?.innerText||'';
  document.body.dataset.message=/^(휴대폰 알림|사내 공지|윤 팀장|이서 ·|서안 · 메시지)/.test(line)?'true':'false';
  renderStoryPhone();
}
function renderStoryPhone(){
  const label=monogatari.state('label'),step=monogatari.state('step'),list=monogatari.label()||[];
  let statement=list[step],line=typeof statement==='string'?statement:'';
  // Derive the held-phone cut and content from the current script position.
  // This also restores correctly on reload between two notification lines.
  // Stop retaining the last notification before the separate tap/reaction beat.
  const tapAt=list.findIndex(x=>typeof x==='string'&&x.includes('똑, 똑, 똑'));
  const pocketAt=list.findIndex(x=>typeof x==='string'&&x.startsWith('휴대폰을 주머니'));
  const opening=label==='Start'&&tapAt>=0&&step<(pocketAt>=0?pocketAt:tapAt);
  const names={phone:'알림',notice:'레이크포트 파크 · 공지',y:'운영팀 채팅 · 윤 팀장',i:'이서',out:'이서와의 대화 · 서안',msg:'서안',replymsg:'서안',ai:'CareerPilot · 가상 예시'};
  if(opening&&!names[line.split(' ')[0]])line=[...list.slice(0,step+1)].reverse().find(x=>typeof x==='string'&&names[x.split(' ')[0]])||(line.startsWith('손안에서 휴대폰')?'phone 새 알림 · 화면을 들어 확인한다.':'');
  if(label==='CardLesson'&&statement?.Choice)line=[...list.slice(0,step)].reverse().find(x=>typeof x==='string'&&x.startsWith('msg '))||'';
  if(label==='E05Last'&&typeof statement==='string'&&!statement.startsWith('jump ')&&!statement.startsWith('msg '))line='msg '+statement;
  const speaker=line.split(' ')[0],content=line.slice(speaker.length+1),active=playing()&&(!!names[speaker]||(label==='E03Example'&&speaker==='s'));
  $('story-phone').hidden=!active;document.body.dataset.phone=String(active);
  document.body.dataset.phoneSolo=String(opening&&active&&!['y'].includes(speaker));
  const nari=document.querySelector('game-screen img[data-character="n"]'),seoan=document.querySelector('game-screen img[data-character="s"]');
  const duo=playing()&&!!nari&&!!seoan;
  document.body.dataset.duo=String(duo);$('duo-stage').hidden=!duo;
  if(duo){$('duo-nari').src=nari.src;$('duo-nari').dataset.sprite=nari.dataset.sprite;$('duo-seoan').src=seoan.src;}

  const cg=playing()&&label==='TutorialStart';$('scene-cg').hidden=!cg;document.body.dataset.cg=String(cg);
  const installSteps={
    TutorChatGPTUpload:['2 / 4 · ChatGPT 업로드','Plugins → Personal → 추가 → ZIP 업로드가 제공되는 계정의 예시. 메뉴가 없으면 공식 권한·웹 경로를 확인해요.','guide-chatgpt.webp'],
    TutorChatGPTEnable:['3 / 4 · ChatGPT 설치 확인','내가 올린 CareerPilot 이름을 확인해요. 아래는 과거 실제 설치 후 상세 화면이에요.','reference-ui/careerpilot-chatgpt-installed-20261005.jpg'],
    TutorInstallUpload:['2 / 4 · Claude 업로드','Customize → Skills → + → Create skill → Upload a skill → Claude용 ZIP','reference-ui/claude-upload.webp'],
    TutorInstallEnable:['3 / 4 · Claude 활성화','Skills 목록에서 CareerPilot을 켜요. 사진의 오른쪽 위 파란 토글이 켜진 모습이에요.','reference-ui/careerpilot-claude-enabled-20261005.jpg'],
    TutorInstallChat:['4 / 4 · '+bridge.service+'에서 시작하기',bridge.service==='ChatGPT'?'입력창의 CareerPilot 선택 상태를 확인해요.':'Skills의 CareerPilot을 켜고, 새 대화에 이름을 넣어 요청해요.',bridge.service==='ChatGPT'?'reference-ui/careerpilot-chatgpt-mobile.png':'guide-activate.webp']
  };
  if(['TutorChatGPTChat','TutorClaudeChat'].includes(label))installSteps[label]=installSteps.TutorInstallChat;
  const linear=playing()&&label==='TutorLinear';
  $('linear-story').hidden=!linear;
  const install=playing()&&(linear||!!installSteps[label]);$('story-install').hidden=!install;document.body.dataset.install=String(install);
  if(linear)CP_WIZARD.render($('linear-story'),true);
  if(install&&!linear){
    const [title,detail,asset]=installSteps[label];$('story-install-image').src='assets/'+asset;$('story-install-title').textContent=title;$('story-install-detail').textContent=detail;
    $('story-install-kicker').textContent='서안과 같이 · '+(label==='TutorInstallPick'?'서비스 고르기':bridge.service+' 설치');
    $('story-install-source').textContent=asset.startsWith('reference-ui/')?(asset.includes('20261005')?'실제 CareerPilot 과거 테스트 화면 · 1.0.0-rc.7':asset.includes('careerpilot-chatgpt-mobile')?'실제 ChatGPT 모바일 · CareerPilot 선택 화면':label==='TutorInstallUpload'?'공개된 실제 Claude 화면 · Bytemint 자료':'OpenAI 공식 화면 · 다른 플러그인 예시'):'개인정보 없이 재구성한 설명용 화면';
    $('story-install-image').alt=title+' · '+$('story-install-source').textContent;
    const stepIndex=({TutorChatGPTUpload:1,TutorChatGPTEnable:3,TutorInstallUpload:2,TutorInstallEnable:3,TutorInstallChat:4,TutorChatGPTChat:4,TutorClaudeChat:4})[label];
    const item=INSTALL_STEPS[bridge.service][stepIndex];
    $('story-install-title').textContent=(stepIndex+1)+' / 5 · '+item[0];
    CP_LESSON_UI.install($('story-install-rebuilt'),bridge.service,stepIndex);
    $('story-install-detail').textContent=item[1];$('story-install-check').textContent='확인할 것: '+item[2];
    $('story-install-open').textContent=bridge.service+' · 큰 화면으로 순서 보기';
    $('story-install-download').href='downloads/careerpilot-'+bridge.service.toLowerCase()+'-v1.2.0-rc.7.zip';$('story-install-download').textContent='① '+bridge.service+'용 ZIP 받기';
    if(['TutorChatGPTUpload','TutorInstallUpload'].includes(label))$('story-install-detail').textContent='먼저 아래에서 '+bridge.service+'용 ZIP을 받아 압축을 풀지 말고 보관해요. 그다음 '+item[1];
  }
  const useStep=TUTORIAL_LABELS[label];
  const usage=playing()&&Number.isInteger(useStep);
  $('story-use').hidden=!usage;document.body.dataset.use=String(usage);
  if(usage)renderUsage(useStep);
  const picker=playing()&&label==='TutorInstallPick';document.body.dataset.servicePicker=String(picker);
  $('service-picker-note').hidden=!picker;
  const object=playing()&&typeof statement==='string'&&(statement.startsWith('휴대폰을 내려놓는다. 서안은 컵')||statement.startsWith('s 근데 월급날엔'))?'cup':null;
  $('object-insert').hidden=!object;document.body.dataset.object=String(!!object);
  if(object){$('object-image').src='assets/cup-insert-v6.png';$('object-image').alt='탄산수 잔을 만지던 서안의 손이 잠시 멈춘다';$('object-caption').textContent='잔에 맺힌 물방울이 천천히 흘러내린다.';}
  CP_STAGE.render(label,statement);
  $('tutorial-watch').hidden=picker||!(install||usage||label==='TutorialStart');
  $('tutorial-watch').textContent=install?'설치 안내·화면 보기':'사용법 다시 보기';
  $('phone-org-mark').hidden=!(active&&speaker==='notice');
  $('remote-person').hidden=true;document.body.dataset.thread='false';if(!active){CP_LESSON_UI.phone({label,speaker,list,step,active});return;}
  $('phone-app').textContent=names[speaker];$('phone-body').replaceChildren();
  if(label==='E02'&&['i','out'].includes(speaker)){
    const thread=list.slice(0,step+1).filter(x=>typeof x==='string'&&/^(i|out) /.test(x)).slice(-2);
    for(const message of thread){const bubble=document.createElement('p');bubble.className=message.startsWith('out ')?'chat-bubble sent':'chat-bubble';bubble.textContent=(message.startsWith('out ')?'서안: ':'이서: ')+message.slice(message.indexOf(' ')+1);$('phone-body').append(bubble);}
    $('phone-app').textContent='이서와의 대화';
  }else $('phone-body').textContent=content;
  document.body.dataset.thread=String(label==='E02'&&['i','out'].includes(speaker));
  const portrait={y:'yoon-front-v0118.png',i:content.includes('막히면')?'iseo-concerned-v0118.png':'iseo-front-v0118.png',out:'iseo-front-v0118.png',msg:'seoan-profile-selfie-v0102.png',replymsg:'seoan-profile-selfie-v0102.png'}[speaker];
  $('remote-person').hidden=!['y','i','out'].includes(speaker);
  if(['y','i','out'].includes(speaker)){$('remote-image').src='assets/'+portrait;$('remote-caption').textContent=(speaker==='y'?'윤 팀장':'이서');}
  $('phone-avatar').hidden=!portrait;if(portrait)$('phone-avatar').src='assets/'+portrait;
  CP_LESSON_UI.phone({label,speaker,list,step,active});
  $('phone-next').disabled=$('next').disabled;
}
function renderPanel(){
  $('preparation').dataset.view=bridge.view;
  document.querySelectorAll('[data-panel]').forEach(e=>e.hidden=e.dataset.panel!==bridge.view);
  document.querySelectorAll('[data-view]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.view===bridge.view)));
  const titles={cards:'지금, 어디부터 해볼까?',request:card().title,install:'CareerPilot 받기',history:'우리의 대화',settings:'읽기 편하게',preview:'다음 화 예고',guide:'서안과 같이, 첫 대화'};
  $('prep-title').textContent=titles[bridge.view];
  $('skip').textContent=playing()?'이야기로 돌아가기':'타이틀로 돌아가기';
  if(bridge.view==='request'){
    const c=card();$('card-input').textContent=c.fields['필요한 입력']||'';
    $('first-lesson').hidden=c.id!=='first';
    $('request-choice').replaceChildren(...c.requests.map((text,index)=>new Option(c.id==='first'?(['처음 시작','준비하던 대화 이어가기','이직할지 아직 모르겠어요','이미 지원했고 면접이 잡혔어요','경력 기술 한 줄이 안 써져요'][index]):`요청 ${index+1} · ${text.slice(0,26)}…`,String(index))));
    $('request-choice').value=String(bridge.requestIndex);$('request').value=c.requests[bridge.requestIndex];
    $('card-fields').replaceChildren();
    for(const [name,text] of Object.entries(c.fields)){
      if(['필요한 입력','해볼 요청'].includes(name))continue;
      const h=document.createElement('h3'),p=document.createElement('p');h.textContent=name;p.textContent=text.replace(/\*\*/g,'');$('card-fields').append(h,p);
    }
    $('card-detail').open=bridge.detail;
    $('service').value=bridge.service;$('external').hidden=true;
    $('external').href=bridge.service==='Claude'?'https://claude.ai/':'https://chatgpt.com/';
    $('external').textContent=bridge.service+' 새 탭 열기 ↗';
    $('save-external').textContent='요청 복사하고 '+bridge.service+' 열기';
    $('return-report').hidden=true;
  }
  if(bridge.view==='install')renderInstall();
  if(bridge.view==='guide')renderGuide();
  if(bridge.view==='history'){
    const log=monogatari.storage('log')||[];
    const nodes=log.map(row=>{const p=document.createElement('p');p.textContent=row.text;return p;});
    if(!nodes.length){const p=document.createElement('p');p.textContent='이야기를 시작하면 읽은 대화가 여기에 남아요.';nodes.push(p);}
    $('history-list').replaceChildren(...nodes);
  }
}
const INSTALL_STEPS={
  ChatGPT:[
    ['파일 받기','아래에서 ChatGPT용 ZIP을 받아요. 압축은 풀지 않아요.','다운로드 폴더에 careerpilot-chatgpt-v1.2.0-rc.7.zip이 있어요.','guide-download.webp','설명용 파일 선택 그림'],
    ['플러그인 메뉴 열기','ChatGPT 앱 → Plugins(플러그인) → Personal(개인용)을 열어요.','개인 플러그인 목록과 추가 메뉴가 보여요. 아래는 기존 테스트 환경의 경로도예요.','guide-chatgpt.webp','재구성 경로도 · 실제 앱 캡처 아님'],
    ['ZIP 업로드','추가 메뉴의 ZIP 업로드에서 받은 ChatGPT용 파일을 골라요. 일반 채팅 첨부창에 올리지 않아요.','설치할 플러그인의 이름이 CareerPilot로 표시되는지 확인해요.','guide-chatgpt.webp','재구성 경로도 · 개인용 업로드 전체 캡처 미확보'],
    ['설치 확인','이름이 CareerPilot인지 확인한 뒤 설치해요. 설치된 목록에서도 확인해요.','아래 실제 과거 화면처럼 CareerPilot 상세 화면이 열리는지 봐요. 이 캡처가 현재 버전 설치를 보장하지는 않아요.','reference-ui/careerpilot-chatgpt-installed-20261005.jpg','실제 CareerPilot 설치 후 화면 · 2026-10-05 구버전'],
    ['대화에서 선택','새 채팅 입력창에서 @ 또는 +의 플러그인 메뉴로 CareerPilot을 선택해요.','입력창에 CareerPilot이 선택된 상태에서 첫 요청을 보내요. 응답이 오는지는 실제 서비스에서 확인해요.','reference-ui/careerpilot-chatgpt-mobile.png','실제 ChatGPT 모바일 · CareerPilot 선택 화면']
  ],
  Claude:[
    ['파일 받기','아래에서 Claude용 ZIP을 받아요. 압축은 풀지 않아요.','다운로드 폴더에 careerpilot-claude-v1.2.0-rc.7.zip이 있어요.','guide-download.webp','설명용 파일 선택 그림'],
    ['Skills 메뉴 열기','Claude → Customize(사용자 지정) → Skills(스킬)을 열어요.','Skills 화면에서 + → Create skill → Upload a skill을 선택해요.','reference-ui/claude-upload.webp','공개된 실제 Claude 화면 · Bytemint 자료'],
    ['ZIP 업로드','Upload a skill 창에서 Claude용 ZIP을 선택해요.','화면의 업로드 영역에 파일을 넣고 Skills 목록에 추가됐는지 확인해요.','reference-ui/claude-upload.webp','공개된 실제 Claude 업로드 창 · 다른 스킬 예시'],
    ['스킬 켜기','Customize → Skills 목록에서 CareerPilot을 켜요. 개인 계정은 Settings → Capabilities의 Code execution and file creation도 확인해요.','오른쪽 위 토글이 파란색으로 켜져 있어야 해요. 조직 계정의 권한은 관리자 설정을 따라요.','reference-ui/careerpilot-claude-enabled-20261005.jpg','실제 CareerPilot 활성화 화면 · 2026-10-05 구버전'],
    ['첫 요청 보내기','새 대화에서 CareerPilot 이름을 넣어 첫 요청을 보내요.','Claude의 작업·사고 과정에서 관련 스킬을 읽고 사용하는지 확인해요. 실제 표현은 화면과 계정에 따라 달라요.','guide-activate.webp','재구성 사용 안내 · 실제 응답 캡처 아님']
  ]
};
function renderInstall(){CP_WIZARD.render($('linear-panel'),false);return;
/* Legacy snapshot surfaces retained only for old asset provenance. */
  const claude=bridge.service==='Claude',platform=claude?'claude':'chatgpt';
  const index=bridge.installStep??0,[title,action,expected,asset,caption]=INSTALL_STEPS[bridge.service][index];
  $('install-service').value=bridge.service;
  $('install-progress').textContent=(index+1)+' / 5';$('install-step-title').textContent=title;
  $('install-action').textContent=action;$('install-expected').textContent='확인: '+expected;
  $('install-image').src='assets/'+asset;$('install-image-link').href=$('install-image').src;
  $('install-image-link').classList.remove('zoomed');$('install-image-link').dataset.composer=String(asset.includes('careerpilot-chatgpt-mobile'));$('install-zoom').textContent='사진 원본 크기로 확대';
  $('install-caption').textContent=caption+' · 눌러서 원본 크게 보기';
  $('install-prev').disabled=index===0;$('install-next').disabled=index===4;
  $('install-step-nav').replaceChildren(...INSTALL_STEPS[bridge.service].map((step,i)=>{
    const button=document.createElement('button');button.textContent=(i+1)+' '+step[0];button.setAttribute('aria-pressed',String(index===i));
    button.onclick=async()=>{bridge.installStep=i;renderInstall();await checkpoint();};return button;
  }));
  $('download').href=`downloads/careerpilot-${platform}-v1.2.0-rc.7.zip`;
  $('download').textContent=bridge.service+'용 설치 ZIP 받기';
  $('real-screens').open=false;
  $('install-real').src='assets/reference-ui/'+(claude?'claude-upload.webp':'chatgpt-official-install.webp');
  $('install-real-link').href=$('install-real').src;
  $('install-real-source').href=claude?'https://bytemint.ai/bytemint-claude-humanizer':'https://help.openai.com/en/articles/20001256-plugins-in-chatgpt';
  $('install-real-caption').textContent=claude?'공개된 실제 Claude 화면. 다른 스킬이 배경에 보이며 CareerPilot 설치 결과는 아니에요.':'OpenAI 공식 도움말의 다른 플러그인 설치 카드. CareerPilot ZIP 업로드 화면은 아니에요.';
  $('install-steps').replaceChildren();
  $('install-note').textContent=claude?'메뉴 경로: Claude 공식 도움말 기준(2026-10-21 확인). 실제 업로드 사진은 Bytemint 공개 자료이며, 공식 문서의 사진은 아니에요.':'앱의 개인용 경로는 프로젝트의 2026-10-05 테스트 기록 기준이에요. 현재 계정에서 동일한 메뉴가 안 보이면 아래 공식 안내를 확인해요. OpenAI는 권한이 있는 계정에서 웹 ZIP 업로드도 안내해요. 관리자 경로는 Admin console → 해당 워크스페이스 → Plugins → Add → Upload plugin이며, 개인 계정에 관리자 메뉴를 찾으라는 뜻은 아니에요.';
  $('official-help').href=claude?'https://support.claude.com/en/articles/12512180-use-skills-in-claude':'https://help.openai.com/en/articles/20001256-plugins-in-chatgpt';
  CP_LESSON_UI.install($('install-rebuilt'),bridge.service,index);
}
$('install-zoom').onclick=async()=>{const img=$('install-image'),link=$('install-image-link');await img.decode();const zoom=link.classList.toggle('zoomed');link.style.setProperty('--shot-width',img.naturalWidth+'px');$('install-zoom').textContent=zoom?'사진을 화면에 맞추기':'사진 원본 크기로 확대';if(zoom){link.scrollLeft=(link.scrollWidth-link.clientWidth)/2;link.scrollTop=(link.scrollHeight-link.clientHeight)/2;}};
for(const [id,delta] of [['install-prev',-1],['install-next',1]])$(id).onclick=async()=>{bridge.installStep=Math.max(0,Math.min(4,(bridge.installStep??0)+delta));renderInstall();await checkpoint();};
// Historical numeric guide positions are migrated by CP_TUTORIAL_STATE only.
const TUTORIAL_LABELS={};
function tutorialStep(index,service=bridge.service){
  if(index===5)return {title:'이제 내 이야기로 시작해볼까요?',explanation:'아래에서 첫 요청을 복사해 내 CareerPilot 대화로 보내요. 서안과 같은 고민일 필요는 없어요. 지금 하는 일에서 바꾸고 싶은 장면 하나부터, 모르겠다면 질문부터 받아보세요.',reading:CP_CARDS[0].requests[0]};
  return CP_TUTORIAL.services[service][index];
}
function renderCapture(frameId,imageId,item){
  const frame=$(frameId),img=$(imageId);frame.hidden=!item.file;
  frame.dataset.rebuilt='false';frame.querySelector('.lesson-reading')?.remove();img.hidden=false;
  if(!item.file)return;
  const [x,y,w,h]=item.crop,[fullWidth]=item.size;
  frame.style.aspectRatio=w+' / '+h;
  frame.style.minWidth=Math.ceil(w*1.15)+'px';
  img.alt=item.alt;
  const raster=CP_CAPTURE_ASSETS[item.file+'@'+item.crop.join(',')];
  if(raster){
    // Width descriptors let the browser account for the actual slot AND display density.
    img.sizes=Math.ceil(frame.getBoundingClientRect().width)+'px';
    img.srcset=raster.candidates.map(candidate=>'assets/'+candidate.url+' '+candidate.width+'w').join(', ');
    img.src='assets/'+raster.candidates[0].url;
    img.style.width='100%';img.style.left='0';img.style.top='0';
    frame.dataset.responsive='true';
  }else{
    img.removeAttribute('srcset');img.removeAttribute('sizes');frame.dataset.responsive='false';
    img.src='assets/reference-ui/'+item.file;
    img.style.width=(fullWidth/w*100)+'%';img.style.left=(-x/w*100)+'%';img.style.top=(-y/h*100)+'%';
  }
  CP_LESSON_UI.capture(frame,item);
}
const captureSizeObserver=new ResizeObserver(entries=>{
  for(const {target,contentRect} of entries)if(target.dataset.responsive==='true'&&contentRect.width>0){
    target.querySelector('img').sizes=Math.ceil(contentRect.width)+'px';
  }
});
for(const id of ['story-use-shot','guide-shot'])captureSizeObserver.observe($(id));
function renderUsage(index){
  const item=tutorialStep(index),key=bridge.service+':'+index,changed=$('story-use').dataset.frame!==key;
  $('story-use').dataset.frame=key;$('story-use-progress').textContent=bridge.service+' · 첫 사용 '+(index+1)+' / 6';
  $('story-use-title').textContent=item.title;
  if(changed||!$('story-use-shot').querySelector('.lesson-reading'))renderCapture('story-use-shot','story-use-image',item);
  $('story-use-viewport').hidden=!item.file;
  $('story-use-source').textContent=item.file?bridge.service+' 실제 캡처 기반 · 가상 인물 서안 · 읽기용 HTML 재구성':'이제 여러분의 CareerPilot 대화에서 시작해요.';
  $('story-use-prompt').textContent=index===5?item.reading:item.explanation;
  $('story-use-caption').textContent=item.file?'작은 글자를 또렷하게 읽도록 재구성했어요. 실제 캡처는 원본 보기로 확인할 수 있어요. 질문과 순서는 실제 대화에 따라 달라져요.':'서안의 가상 정보가 여러분의 경력으로 전달되지는 않아요. 지금은 이야기를 계속해도 괜찮아요.';
  $('story-use-reading').textContent=item.reading;
  $('story-use-reading-details').hidden=!item.file;
  $('story-use-open').textContent=index===5?'내 첫 요청 준비하기':'이 화면 크게 · 단계별로 보기';
  if(changed){$('story-use').scrollTop=0;$('story-use-viewport').scrollLeft=0;$('story-use-reading-details').open=false;}
}
function renderGuide(){
  const index=bridge.guideStep,service=bridge.guideService,item=tutorialStep(index,service);
  $('guide-service').value=service;
  $('guide-progress').textContent=service+' · '+(index+1)+' / 6';$('guide-heading').textContent=item.title;$('guide-explanation').textContent=item.explanation;
  renderCapture('guide-shot','guide-image',item);
  $('guide-image-link').hidden=!item.file;
  if(item.file)$('guide-image-link').href='assets/reference-ui/'+item.file;
  $('guide-caption').textContent=item.file?service+' 사용 예시 · 서안의 가상 상황을 읽기 쉽게 재구성했어요.':'다음 버튼을 누르지 않아도 원할 때 이야기를 이어갈 수 있어요.';
  $('guide-reading').textContent=item.reading;$('guide-reading-details').open=false;
  $('guide-viewport').hidden=!item.file;$('guide-viewport').scrollLeft=0;
  $('guide-prev').disabled=index===0;$('guide-next').hidden=index===5;
  $('guide-step-nav').replaceChildren(...CP_TUTORIAL.steps.map((name,i)=>{
    const button=document.createElement('button');button.textContent=(i+1)+' '+name;button.setAttribute('aria-pressed',String(index===i));
    button.onclick=async()=>{bridge.guideStep=i;renderGuide();$('preparation').scrollTop=0;await checkpoint();};return button;
  }));
}
$('story-use-open').onclick=()=>{
  const index=TUTORIAL_LABELS[monogatari.state('label')]??0;
  if(index===5)return changePanel('request','first');
  bridge.guideStep=index;return changePanel('guide');
};
$('guide-service').onchange=async event=>{bridge.service=bridge.guideService=event.target.value;localStorage.setItem('CPPreferredService',bridge.service);renderGuide();await checkpoint();};
$('story-install-zoom').onclick=()=>$('story-install-open').onclick();
$('story-install-open').onclick=()=>{bridge.installStep=({TutorChatGPTUpload:1,TutorChatGPTEnable:3,TutorInstallUpload:2,TutorInstallEnable:3,TutorInstallChat:4,TutorChatGPTChat:4,TutorClaudeChat:4})[monogatari.state('label')]??0;return changePanel('install');};
$('tutorial-watch').onclick=()=>{if(/^Tutor(Install|ChatGPT(?:Upload|Enable|Chat)|ClaudeChat)/.test(monogatari.state('label'))){bridge.installStep=({TutorInstallPick:0,TutorChatGPTUpload:1,TutorChatGPTEnable:3,TutorInstallUpload:2,TutorInstallEnable:3,TutorInstallChat:4,TutorChatGPTChat:4,TutorClaudeChat:4})[monogatari.state('label')]??0;return changePanel('install');}bridge.guideStep=TUTORIAL_LABELS[monogatari.state('label')]??0;return changePanel('guide');};
for(const [id,delta] of [['guide-prev',-1],['guide-next',1]])$(id).onclick=async()=>{bridge.guideStep=Math.max(0,Math.min(5,bridge.guideStep+delta));renderGuide();$('preparation').scrollTop=0;await checkpoint();};
$('guide-own').onclick=()=>changePanel('request','first');
$('title-tutorial').onclick=()=>{bridge.guideStep=0;return changePanel('guide');};
function showPanel(view='cards',cardId=null){
  if(!$('preparation').open){returnFocus=document.activeElement;$('preparation').showModal();}
  bridge.panel=true;bridge.view=view;
  if(cardId){bridge.card=cardId;bridge.requestIndex=0;bridge.detail=false;}
  if(playing())monogatari.global('block',true);
  renderPanel();$('preparation').scrollTop=0;panelSay(bridge.report||'');$('close-prep').focus();
}
async function closePanel(){
  bridge.panel=false;$('preparation').close();
  if(playing())syncStoryUI();
  const target=returnFocus?.isConnected&&!returnFocus.closest('[hidden]')?returnFocus:$('prep');target.focus();
  await checkpoint();
}
async function changePanel(view,cardId=null){if(view==='guide')bridge.guideService=bridge.service;showPanel(view,cardId);await checkpoint();}
function playingUI(){$('welcome').hidden=true;$('play-controls').hidden=false;}
async function advance(){if(window.CP_GUIDE?.isOpen())return;if(CP_LESSON_UI.finishMessage()||CP_STAGE.finishTyping())return;if(['TutorRequest','E03Example','E03Actual'].includes(monogatari.state('label')))return;if(transitioning){interruptTransition();return;}if(Date.now()<beatUntil){beatUntil=0;clearTimeout(beatTimer);syncStoryUI();return;}if(!playing()||!monogatari.element().find('[data-screen=game]').isVisible()||!settled||transitioning||Date.now()<beatUntil||busy||finished()||$('preparation').open||document.querySelector('choice-container')||monogatari.action('Choice').blocking)return;await monogatari.proceed({userInitiated:true});}
$('start').onclick=async()=>{
  if(busy)return;busy=true;
  let existing=null;try{existing=await monogatari.Storage.get(SLOT)}catch(error){if(error.name!=='KeyNotFoundError'){busy=false;say('저장소를 확인하지 못했어요. 새로고침 후 다시 시도해주세요.');return;}}
  if(existing&&!await CP_REVIEW.confirmRestart(existing)){busy=false;return;}
  void primeSound();busy=true;restoring=true;clearTimeout(saveTimer);
  try{
    await monogatari.resetGame();
    // Monogatari 2.8.0 resets the choice stack but retains its blocking flag.
    monogatari.action('Choice').blocking=false;
    bridge=initialBridge();window.CP_GUIDE?.reset();document.body.dataset.starting='true';await Promise.all(['office-evening-v81.png','office-evening-mobile-v81.png'].map(src=>new Promise(resolve=>{const img=new Image();img.onload=img.onerror=resolve;img.src='assets/'+src})));playingUI();restoring=false;await monogatari.runListener('start');$('recovery').hidden=true;
  }
  catch(error){say('이야기'+'를 불러오지 못했어요. 새로고침 후 다시 시작해주세요.');}
  finally{restoring=false;busy=false;document.body.dataset.starting='false';}
};
$('resume').onclick=async()=>{
  if(busy)return;busy=true;restoring=true;clearTimeout(saveTimer);
  try{
    const original=await monogatari.Storage.get(SLOT),data=migrateSave(original);if(!validSave(data))throw new Error('Invalid save');
    await monogatari.Storage.set(SLOT,data);
    window.CP_GUIDE?.reset();await monogatari.loadFromSlot(SLOT);bridge=structuredClone(data.game.storage.bridge);monogatari.storage({bridge});window.CP_PRACTICE?.restore();playingUI();
    // Restore exactly the saved dialog/choice; never replay a whole label.
    await monogatari.run(monogatari.label()[monogatari.state('step')],false);
    bridge.panel=false;$('preparation').close();monogatari.storage({bridge});$('prep').focus();
    syncStoryUI();say('저장한 대화와 선택을 이어왔어요.');
  }catch(error){$('recovery').hidden=false;$('resume').hidden=true;$('welcome').hidden=false;$('play-controls').hidden=true;$('end-actions').hidden=true;monogatari.global('playing',false);say('이전 기록을 복원하지 못했어요.');}
  finally{restoring=false;busy=false;syncStoryUI();void syncAmbience();}
};
$('next').onclick=advance;
$('prep').onclick=()=>changePanel('cards');
$('get-plugin').onclick=$('title-download').onclick=()=>{bridge.wizardStep=-1;changePanel('install');};
$('history').onclick=()=>changePanel('history');$('settings').onclick=()=>changePanel('settings');
$('preview').onclick=()=>changePanel('preview');$('today').onclick=()=>changePanel('request','first');
$('close-prep').onclick=$('skip').onclick=closePanel;
$('title').onclick=async()=>{if(!await checkpoint())return;monogatari.global('playing',false);monogatari.hideScreens();monogatari.showScreen('main');$('welcome').hidden=false;renderWorkday();renderStoryPhone();$('resume').hidden=false;$('play-controls').hidden=true;$('end-actions').hidden=true;$('story-hint').hidden=true;$('chapter').textContent='프롤로그 + 1화';say('');$('resume').focus();};
$('preparation').addEventListener('click',async event=>{
  const view=event.target.closest('button[data-view]')?.dataset.view,cardId=event.target.closest('[data-card]')?.dataset.card,report=event.target.closest('[data-report]')?.dataset.report;
  if(view)await changePanel(view,view==='request'?'first':null);
  if(cardId)await changePanel('request',cardId);
  if(report){bridge.report=report;panelSay(report.includes('막혔')?'설치 안내를 보거나 이야기를 먼저 이어갈 수 있어요.':'원할 때 같은 CareerPilot 대화에서 이어갈 수 있어요.');await checkpoint();}
});
for(const c of CP_CARDS.filter(c=>c.id!=='first')){const button=document.createElement('button');button.dataset.card=c.id;button.textContent=c.title;$('card-list').append(button);}
$('request-choice').onchange=async()=>{bridge.requestIndex=Number($('request-choice').value);$('request').value=card().requests[bridge.requestIndex];$('external').hidden=true;await checkpoint();};
$('card-detail').ontoggle=async()=>{if(bridge.view!=='request'||!$('preparation').open)return;bridge.detail=$('card-detail').open;await checkpoint();};
$('service').onchange=$('install-service').onchange=async event=>{bridge.service=bridge.guideService=event.target.value;localStorage.setItem('CPPreferredService',bridge.service);bridge.installStep=0;renderPanel();await checkpoint();};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('request').value);panelSay('요청을 복사했어요.');}catch(error){$('request').focus();$('request').select();panelSay('선택된 요청을 직접 복사해주세요.');}};
// Compatibility adapter for existing preparation controls; execution lives in CP_HANDOFF.
async function copyRequestAndOpen(options){
 const requestId=Object.keys(REQUESTS).find(id=>REQUESTS[id]===options.text);
 if(!requestId){options.status('이 요청은 열 수 없어요. 요청 카드를 다시 골라주세요.');return;}
 options.button.disabled=true;
 try{return CP_HANDOFF.present(await CP_HANDOFF.launch({provider:bridge.service,requestId,sceneId:monogatari.state('label')}),{...options,requestId,provider:bridge.service});}
 finally{options.button.disabled=false;}
}
$('save-external').onclick=()=>copyRequestAndOpen({text:$('request').value,button:$('save-external'),field:$('request'),link:$('external'),status:panelSay});
$('external').onclick=()=>panelSay('돌아오면 패널을 닫고 같은 대화를 이어갈 수 있어요.');
// Awaited story functions cover the whole viewport before any location/sprite changes.
let transitioning=false,transitionAnimation=null,transitionSkipped=false,beatUntil=0,beatTimer=null;
function interruptTransition(){transitionSkipped=true;transitionAnimation?.finish();}
$('scene-transition').addEventListener('pointerdown',()=>{if(transitioning)interruptTransition();});
// Intro is ordinary, saveable story dialogue. No timed film runs on resume.
const WORKDAY_LABELS=new Set(['Opening','WalkHome','RecallDesk','RecallPeople','RecallHold','WalkQuestion']);
let lastWorkdayLabel='';
function renderWorkday(){
  const label=monogatari.state('label'),step=monogatari.state('step');
  const active=playing()&&WORKDAY_LABELS.has(label),office=active&&label==='Opening',recall=active&&label.startsWith('Recall');
  $('workday-stage').hidden=!active;
  document.body.dataset.workday=active?label:'';
  $('office-scene').hidden=!office;$('office-bubbles').hidden=!office;
  $('office-greeting').hidden=!office||step>=2;$('office-reply').hidden=!(office&&step>=2);
  if(office)positionOfficeBubbles();
  $('workday-walker').hidden=!active||office;
  $('workday-location').hidden=!active||recall||label==='WalkQuestion';
  $('workday-location').textContent=office?'온호시 · 레이크포트 파크 운영 사무실':'레이크포트 파크 · 직원 출입게이트로 가는 길';
  $('workday-memory').hidden=!recall;$('memory-notice').hidden=label!=='RecallHold';
  $('workday-memory').dataset.beat=label;
  $('recall-yoon').hidden=!(active&&label==='RecallHold');
  $('memory-time').textContent=label==='RecallHold'?'오늘 오후 2:16 · 받은 메일':label==='RecallPeople'?'오늘 오후 · 일일 마감표 확인':'오늘 오전 · 이용권 변경 문의';
  $('memory-image').src='assets/'+(label==='RecallPeople'?'recall-closing-v0102.png':'recall-service-v0102.png');
  $('memory-image').alt=label==='RecallDesk'?'오늘 오전. 짧은 짙은 갈색 머리의 주인공이 얼굴을 보이지 않는 뒷모습으로 베이지색 재킷을 입고 이용권 변경 문의 전화를 받으며 안내 자료를 짚는다.':label==='RecallPeople'?'오늘 오후. 같은 짧은 머리와 베이지색 재킷의 주인공이 얼굴을 보이지 않는 뒷모습으로 마감표의 숫자를 확인하며 종이 서류와 컴퓨터 화면을 대조한다.':'새로운 계획을 보류한다는 업무 메일이 떠오른다.';
  if(active&&label!==lastWorkdayLabel&&!restoring&&!reducedMotion()){
    const target=recall?$('workday-memory'):$('workday-walker');
    if(!target.hidden)target.animate([{opacity:0},{opacity:1}],{duration:recall?420:800,easing:'ease-out'});
    if(!$('recall-yoon').hidden)$('recall-yoon').animate([{opacity:0,transform:'translateX(24px)'},{opacity:1,transform:'translateX(0)'}],{duration:420,easing:'ease-out'});
  }
  lastWorkdayLabel=active?label:'';
}
// Anchor each greeting to its speaker, including the responsive image's cover crop.
function positionOfficeBubbles(){
  const img=$('office-scene-image');
  if($('office-scene').hidden||!img.naturalWidth)return;
  const box=img.getBoundingClientRect(),stage=$('workday-stage').getBoundingClientRect();
  const scale=Math.max(box.width/img.naturalWidth,box.height/img.naturalHeight);
  const width=img.naturalWidth*scale,height=img.naturalHeight*scale;
  const portrait=img.currentSrc.includes('mobile-v81');
  const anchors=portrait?[[.37,.236],[.72,.283]]:[[.329,.223],[.596,.260]];
  const minTop=$('workday-location').getBoundingClientRect().bottom-stage.top+12;
  ['office-greeting','office-reply'].forEach((id,index)=>{
    const bubble=$(id);if(bubble.hidden)return;
    const [x,y]=anchors[index];
    const headX=box.left-stage.left+(box.width-width)/2+x*width;
    const headY=box.top-stage.top+(box.height-height)/2+y*height;
    const left=Math.max(12,Math.min(stage.width-bubble.offsetWidth-12,headX-bubble.offsetWidth/2));
    bubble.style.left=left+'px';
    bubble.style.top=Math.max(minTop,headY-bubble.offsetHeight-22)+'px';
    bubble.style.setProperty('--tail-x',Math.max(24,Math.min(bubble.offsetWidth-32,headX-left))+'px');
  });
}
$('office-scene-image').addEventListener('load',positionOfficeBubbles);
new ResizeObserver(positionOfficeBubbles).observe($('office-scene-image'));
new ResizeObserver(entries=>{
  document.documentElement.style.setProperty('--office-top',entries[0].target.getBoundingClientRect().height+'px');
  positionOfficeBubbles();
}).observe(document.querySelector('.toolbar'));
async function pauseBeforeNotice(){
  $('office-scene').hidden=true;$('workday-stage').hidden=true;document.body.dataset.workday='';
  if(restoring||reducedMotion())return;
  await transitionOut('퇴근길 · 직원 출입게이트');await transitionIn();
}

const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
async function transitionOut(title){
  if(restoring)return;
  clearTimeout(saveTimer);transitioning=true;transitionSkipped=false;settled=false;
  document.body.dataset.transitioning='true';monogatari.global('block',true);
  $('next').disabled=true;$('scene-transition-title').textContent=title;
  const cover=$('scene-transition');cover.style.opacity='0';
  if(!reducedMotion()){
    transitionAnimation=cover.animate([{opacity:0},{opacity:1}],{duration:240,easing:'ease-in-out',fill:'forwards'});
    await transitionAnimation.finished.catch(()=>{});
  }
  cover.style.opacity='1';transitionAnimation?.cancel();transitionAnimation=null;
}
async function transitionIn(){
  if(restoring)return;
  const cover=$('scene-transition');
  try{
    if(monogatari.state('label')==='Opening'){
      // Switch the comic overlay under black, before revealing the gate.
      $('office-scene').hidden=true;$('workday-stage').hidden=true;
    }
    renderStoryPhone();
    await Promise.all([...document.querySelectorAll('game-screen img[data-character]')].map(img=>img.decode().catch(()=>{})));
    if(!reducedMotion()&&!transitionSkipped){
      if(monogatari.state('label')==='E01'){await new Promise(resolve=>setTimeout(resolve,1700));if(!transitionSkipped){$('scene-transition-title').textContent='호숫가 펍 · 저녁';await new Promise(resolve=>setTimeout(resolve,650));}}else await new Promise(resolve=>setTimeout(resolve,150));
      transitionAnimation=cover.animate([{opacity:1},{opacity:0}],{duration:450,easing:'ease-in-out',fill:'forwards'});
      await transitionAnimation.finished.catch(()=>{});
    }
  }finally{
    cover.style.opacity='0';transitionAnimation?.cancel();transitionAnimation=null;
    transitioning=false;document.body.dataset.transitioning='false';
    monogatari.global('block',$('preparation').open||finished());
  }
}
// Small optional audio prototype. No recordings, voice or automatic playback.
let sfxEnabled=true,audioContext=null,lastEffectKey='';
try{sfxEnabled=localStorage.getItem('CPEpisodeSfx')!=='off';}catch(error){}
$('tap-sound').checked=sfxEnabled;
function syncSoundButton(){$('tap-sound').checked=sfxEnabled;$('sound-toggle').textContent=sfxEnabled?'소리 켜짐':'소리 꺼짐';$('sound-toggle').setAttribute('aria-pressed',String(sfxEnabled));$('sound-toggle').setAttribute('aria-label',sfxEnabled?'효과음 끄기':'효과음 켜기');}
syncSoundButton();
$('sound-toggle').onclick=()=>{$('tap-sound').checked=!sfxEnabled;$('tap-sound').onchange();};
async function primeSound(){
  if(!sfxEnabled)return null;
  try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')await audioContext.resume();return audioContext;}catch(error){return null;}
}
async function playTapSound(){
  const ctx=await primeSound();if(!ctx||ctx.state!=='running')return false;
  for(let i=0;i<3;i++){
    const length=Math.floor(ctx.sampleRate*.065),buffer=ctx.createBuffer(1,length,ctx.sampleRate),channel=buffer.getChannelData(0);
    for(let n=0;n<length;n++)channel[n]=(Math.random()*2-1)*Math.exp(-n/(ctx.sampleRate*.009));
    const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
    source.buffer=buffer;filter.type='bandpass';filter.frequency.value=850;filter.Q.value=.7;gain.gain.value=.35;
    source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);source.start(ctx.currentTime+.02+i*.17);
    source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
  }return true;
}
async function playSighSound(){
  const ctx=await primeSound();if(!ctx||ctx.state!=='running')return;
  const length=Math.floor(ctx.sampleRate*.6),buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/length)*Math.exp(-2*i/length);
  const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type='lowpass';filter.frequency.value=750;gain.gain.value=.08;source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);source.start();source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
}
let ambientScene='',ambientNodes=[],ambientGain=null;
async function syncAmbience(){const label=monogatari.state('label'),next=!playing()?'':/^E05Messages|E05Last|CardLesson|Reply|EndQuiet|Finish|C3_CALL/.test(label)?'home':/^E01|E02|E03|E04|E05$|Tutor|Promise|C[123]_/.test(label)?'pub':'';if(next===ambientScene&&ambientNodes.length)return;for(const n of ambientNodes){try{n.stop();n.disconnect()}catch{}}ambientNodes=[];ambientGain?.disconnect();ambientGain=null;ambientScene=next;if(!next||!sfxEnabled)return;const ctx=await primeSound();if(!ctx)return;ambientGain=ctx.createGain();ambientGain.gain.value=next==='home'?.004:.006;ambientGain.connect(ctx.destination);for(const f of next==='home'?[60,120]:[146.83,220,293.66]){const tone=ctx.createOscillator();tone.type='sine';tone.frequency.value=f;tone.connect(ambientGain);tone.start();ambientNodes.push(tone);}document.body.dataset.ambience=next;}
async function playNotificationSound(){const ctx=await primeSound();if(!ctx||ctx.state!=='running')return;for(const [i,freq] of [880,1174].entries()){const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+i*.18;o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.07,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.32);o.onended=()=>{o.disconnect();g.disconnect();};}}
$('tap-sound').onchange=async()=>{sfxEnabled=$('tap-sound').checked;syncSoundButton();try{localStorage.setItem('CPEpisodeSfx',sfxEnabled?'on':'off');}catch(error){}if(sfxEnabled){await primeSound();await syncAmbience()}else if(audioContext?.state==='running')await audioContext.suspend();};
$('sound-preview').onclick=async()=>{if(!sfxEnabled){panelSay('위에서 두드리는 효과음을 켜면 미리 들을 수 있어요.');return;}panelSay(await playTapSound()?'작은 효과음 3회를 재생했어요.':'브라우저에서 소리를 재생하지 못했어요. 이야기는 계속할 수 있어요.');};
document.addEventListener('pointerdown',()=>{if(sfxEnabled)void primeSound();},{passive:true});
function syncSceneEffects(){
  const label=monogatari.state('label'),step=monogatari.state('step'),line=monogatari.label()?.[step],key=label+':'+step;
  const tap=playing()&&label==='Start'&&typeof line==='string'&&line.includes('똑, 똑, 똑');
  $('tap-cue').hidden=!tap;
  if(key===lastEffectKey)return;lastEffectKey=key;
  if(restoring||!playing())return;
  void syncAmbience();
  if(typeof line==='string'&&/^(y |i |msg )/.test(line))void playNotificationSound();
  const emotional=typeof line==='string'&&(line.includes('어깨가 살짝 닿')||line==='me 벌써 지원했어?'||line.includes('대답이 조금 늦는다'));document.body.dataset.emotional=String(emotional);
  if(emotional&&!reducedMotion()){beatUntil=Date.now()+300;if(ambientGain&&audioContext){ambientGain.gain.setTargetAtTime(.001,audioContext.currentTime,.08);ambientGain.gain.setTargetAtTime(ambientScene==='home'?.004:.006,audioContext.currentTime+.8,.3)}document.querySelector('text-box').animate([{opacity:.25},{opacity:1}],{duration:450,delay:150});}
  clearTimeout(beatTimer);beatUntil=emotional&&!reducedMotion()?Date.now()+300:0;
  if(tap){
    setTimeout(()=>{if(monogatari.state('label')===label&&monogatari.state('step')===step)void playTapSound();},reducedMotion()?0:500);
    if(!reducedMotion())document.querySelector('game-screen').animate([{transform:'translateX(0)'},{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'translateX(0)'}],{delay:500,duration:240});
    if(!reducedMotion()){beatUntil=Date.now()+1700;beatTimer=setTimeout(()=>{beatUntil=0;if(playing())syncStoryUI();},1700);}
  }
  if(label==='WalkQuestion'&&typeof line==='string'&&line.includes('하아'))void playSighSound();
  if(label==='Start'&&typeof line==='string'&&line.startsWith('손안에서 휴대폰'))void playNotificationSound();
  if(label==='E02'&&step===0){
    void playNotificationSound();
    if(!reducedMotion()){beatUntil=Date.now()+1100;beatTimer=setTimeout(()=>{beatUntil=0;if(playing())syncStoryUI();},1100);}
  }
}

$('font-size').oninput=()=>{const size=$('font-size').value;document.documentElement.style.setProperty('--read-size',size+'px');$('font-value').textContent=size+'px';try{localStorage.setItem('CPEpisodeFont',size);}catch(error){/* Reading settings still apply to this tab. */}};
try{const font=localStorage.getItem('CPEpisodeFont');if(['16','18','20','22','24'].includes(font)){$('font-size').value=font;$('font-size').oninput();}}catch(error){/* Default font remains available. */}
document.addEventListener('keydown',event=>{
  if(document.querySelector('dialog[open]:not(#preparation)')){if(['Enter',' ','ArrowRight'].includes(event.key)&&!event.target.closest('button,input,textarea,select')){event.preventDefault();event.stopImmediatePropagation();}return;}
  if($('preparation').open){event.stopImmediatePropagation();if(event.key==='Escape'){event.preventDefault();closePanel();}return;}
  if(playing()&&transitioning&&['Enter',' ','ArrowRight'].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();interruptTransition();return;}
  if(playing()&&['Enter',' ','ArrowRight'].includes(event.key)&&!event.target.closest('button,a,input,textarea,select')){event.preventDefault();event.stopImmediatePropagation();advance();}
},true);
$('preparation').addEventListener('cancel',event=>{event.preventDefault();closePanel();});
monogatari.on('willRunAction',()=>{settled=false;});
monogatari.on('didRunAction',event=>{
  const id=event.detail.action.constructor.id;if(!['Dialog','Choice'].includes(id))return;settled=true;
  syncStoryUI();
  syncSceneEffects();
  if(!restoring){
    const label=monogatari.state('label'),step=monogatari.state('step'),log=monogatari.storage('log'),text=document.querySelector('text-box')?.innerText||'';
    if(text&&!(log.at(-1)?.label===label&&log.at(-1)?.step===step))monogatari.storage({log:[...log,{label,step,text}].slice(-250)});
    // E03Actual is held by the shared practice panel until an explicit result/skip.
    clearTimeout(saveTimer);saveTimer=setTimeout(checkpoint,120);
  }
});
let observedTextBox=null;
const dialogObserver=new ResizeObserver(syncDialogLayout);
function syncDialogLayout(){
  const box=document.querySelector('text-box');
  if(box!==observedTextBox){
    if(observedTextBox)dialogObserver.unobserve(observedTextBox);
    observedTextBox=box;
    if(box)dialogObserver.observe(box);
  }
  // The engine replaces text-box on reset/load. Measure the current visible node.
  const rect=box?.getBoundingClientRect(),height=rect?.height;
  if(height>0){
    document.documentElement.style.setProperty('--dialog-height',Math.ceil(height)+'px');
    document.documentElement.style.setProperty('--dialog-reserve',Math.ceil(innerHeight-rect.top)+'px');
  }
}
monogatari.init('#monogatari').then(async()=>{
  // init() launches preloading without awaiting its initial screen switch.
  // Wait for that switch before exposing Start, so it cannot reopen the title
  // over an intro that a fast first click has already started.
  await new Promise(resolve=>{
    const main=document.querySelector('main-screen');
    const observer=new MutationObserver(check);
    function check(){if(main.classList.contains('active')){observer.disconnect();resolve();}}
    observer.observe(main,{attributes:true,attributeFilter:['class']});check();
  });
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const reveals=[...document.querySelectorAll('main-screen,game-screen')].flatMap(el=>el.getAnimations()).filter(animation=>animation.effect?.getComputedTiming().iterations!==Infinity);
  await Promise.allSettled(reveals.map(animation=>animation.finished));
  ready=true;$('welcome').hidden=false;
  try{const data=await monogatari.Storage.get(SLOT);$('resume').hidden=!validSave(data);$('recovery').hidden=validSave(data);say('');}
  catch(error){say(error.name==='KeyNotFoundError'?'':'브라우저'+' 저장소를 읽지 못했어요. 이 탭에서는 플레이할 수 있어요.');}
}).catch(()=>say('이야기를 불러오지 못했어요. 새로고침해주세요.'));

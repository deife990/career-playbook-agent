'use strict';
// UI/UX v1.1 integration. Frozen design examples never become production dialogue.
const CP_V11=(()=>{
 const make=(tag,id,text)=>{const n=document.createElement(tag);if(id)n.id=id;if(text)n.textContent=text;return n};
 const icon=direction=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${direction==='back'?'M15 5 8 12l7 7':direction==='next'?'m9 5 7 7-7 7':'M4 6h16M4 12h16M4 18h16'}"/></svg>`;
 const menu=document.querySelector('.game-more'),trigger=menu.querySelector('summary');trigger.innerHTML=icon('menu');trigger.setAttribute('aria-label','이야기 메뉴 열기');trigger.setAttribute('aria-expanded','false');
 menu.addEventListener('toggle',()=>{trigger.setAttribute('aria-expanded',String(menu.open));trigger.setAttribute('aria-label',menu.open?'이야기 메뉴 닫기':'이야기 메뉴 열기')});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open&&!document.querySelector('dialog[open]')){e.preventDefault();e.stopImmediatePropagation();menu.open=false;trigger.focus()}},true);
 const next=document.getElementById('next');next.innerHTML=icon('next');next.setAttribute('aria-label','다음 대사');next.title='다음 대사';
 const back=make('button','story-back');back.type='button';back.innerHTML=icon('back');back.setAttribute('aria-label','이전 대사');back.title='이전 대사';document.body.append(back);
 // Reconstruct visual commands only; dialogue rewind never executes a handoff or choice.
 const rewindRegion=label=>/^(Start|C1_[ABC]|P02)$/.test(label)?'gate':/^(E01|E01Talk|E02|E04|Promise|E05|C[123]_[ABC]|C[12]_CALL_[ABC])$/.test(label)?'pub':/^(E05Messages|E05Last|CardLesson|Reply[ABC]|C3_CALL_[ABC])$/.test(label)?'home':'';
 function previousTarget(){
  const label=monogatari.state('label'),list=monogatari.label()||[];
  if(!playing()||busy||restoring||transitioning||!settled||CP_GUIDE.isOpen()||document.querySelector('dialog[open],choice-container')||!rewindRegion(label))return null;
  for(let i=monogatari.state('step')-1;i>=0;i--){
   const line=list[i];if(line?.Function)continue;
   if(typeof line!=='string')return null;
   if(/^(show|hide) (character|scene) /.test(line))continue;
   if(line.startsWith('jump '))return null;
   return {label,step:i};
  }
  const log=monogatari.storage('log')||[],at=log.findLastIndex(r=>r.label===label&&r.step===monogatari.state('step')),prior=log[at-1];
  if(prior&&rewindRegion(prior.label)===rewindRegion(label)&&typeof CP_STORY.script[prior.label]?.[prior.step]==='string')return prior;
  return null;
 }
 function previousIndex(){return previousTarget()?.step??-1}
 async function restoreVisuals(target){
   const log=monogatari.storage('log')||[],at=log.findLastIndex(r=>r.label===target.label&&r.step===target.step),poses=new Map();let scene=null;
   const apply=line=>{if(typeof line!=='string')return;const match=line.match(/^(show|hide) character (\w+)/);if(match){if(match[1]==='hide')poses.delete(match[2]);else poses.set(match[2],line)}if(line.startsWith('show scene '))scene=line;};
   // Use the actual visited route, including callback labels, without replaying functions.
   let priorLabel='',priorStep=-1;
   for(const row of at>=0?log.slice(0,at+1):[]){const start=row.label===priorLabel?priorStep+1:0;for(const line of (CP_STORY.script[row.label]||[]).slice(start,row.step+1))apply(line);priorLabel=row.label;priorStep=row.step}
   if(target.label==='Start'){poses.clear();scene='show scene gate';for(const line of CP_STORY.script.Start.slice(0,target.step+1))apply(line)}
   else if(at<0)for(const line of CP_STORY.script[target.label].slice(0,target.step+1))apply(line);
   if(scene&&scene!==monogatari.state('scene'))await monogatari.run(scene,false);
   for(const node of document.querySelectorAll('game-screen img[data-character]'))if(!poses.has(node.dataset.character))await monogatari.run('hide character '+node.dataset.character,false);
   for(const line of poses.values())if(!(monogatari.state('characters')||[]).includes(line))await monogatari.run(line,false);
 }
 async function previous(){
  const target=previousTarget();if(!target)return;busy=true;restoring=true;CP_REVIEW.stop();CP_LESSON_UI.finishMessage();clearTimeout(saveTimer);clearTimeout(beatTimer);beatUntil=0;
  try{
   await restoreVisuals(target);
   monogatari.state({label:target.label,step:target.step});await monogatari.run(CP_STORY.script[target.label][target.step],false);
  }finally{restoring=false;busy=false;syncStoryUI()}
  await checkpoint();
 }
 back.onclick=()=>void previous();document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&!e.repeat&&!e.target.closest('button,a,input,textarea,select,summary,[contenteditable=true]')&&!menu.open&&previousIndex()>=0){e.preventDefault();e.stopImmediatePropagation();void previous()}},true);
 const shade=make('div','dialogue-shade');shade.setAttribute('aria-hidden','true');document.body.append(shade);
 const remote=make('figure','conversation-cast'),remoteImage=make('img'),remoteCaption=make('figcaption');remoteImage.alt='';remote.append(remoteImage,remoteCaption);remote.hidden=true;document.body.append(remote);
 const footnote=make('div','message-footnote','메시지를 읽고 이야기를 이어가세요.');document.querySelector('#story-phone .phone-screen').append(footnote);
 const channel=make('div','message-channel');channel.setAttribute('aria-label','대화 참여자');document.querySelector('#story-phone .phone-screen').prepend(channel);
 const prompts=new Set(['Start','E01Talk','Promise']);
 // Authored, sparse beats. Metadata does not add lines or alter branch positions.
 const reactions={C3_C:new Set(['s 사실 그 말, 누가 해줬으면 했어.']),E05:new Set(['s 응.']),C3_A:new Set(['s 그럼 나 오늘 아주 성실했네.'])};
 const faces={
  'seoan-pub-seated-v092.png':[.45,.02,.23,.43],
  'seoan-pub-laugh-v092.png':[.45,.02,.23,.43],
  'seoan-pub-chin-v091.png':[.41,.02,.24,.44]
 };
 const overlap=(a,b,g=12)=>a.left<b.right+g&&a.right>b.left-g&&a.top<b.bottom+g&&a.bottom>b.top-g;
 function resetCaption(box){box.classList.remove('reaction-bubble');for(const key of ['left','right','top','bottom'])box.style.removeProperty(key);delete document.body.dataset.presentation;box.dataset.presentation='caption'}
 function caption(label,statement){
  const box=document.querySelector('text-box'),image=document.getElementById('narrative-image');if(!box)return;resetCaption(box);
  const eligible=playing()&&!transitioning&&!CP_GUIDE.isOpen()&&!document.querySelector('dialog[open],choice-container')&&label!=='Opening'&&document.body.dataset.device!=='true'&&!CP_ALERTS.isOpen();
  shade.hidden=!eligible||document.body.dataset.uiHidden==='true';if(!eligible)return;
  const points=faces[image.getAttribute('src')?.split('/').at(-1)];
  if(document.body.dataset.narrativeArt==='true'&&reactions[label]?.has(statement)&&points&&image.naturalWidth){
   box.classList.add('reaction-bubble');const bounds=image.getBoundingClientRect(),scale=Math.max(bounds.width/image.naturalWidth,bounds.height/image.naturalHeight),pos=getComputedStyle(image).objectPosition.split(' ').map(x=>parseFloat(x)/100);
   const origin={x:bounds.left+(bounds.width-image.naturalWidth*scale)*pos[0],y:bounds.top+(bounds.height-image.naturalHeight*scale)*pos[1]};
   const face={left:origin.x+points[0]*image.naturalWidth*scale,top:origin.y+points[1]*image.naturalHeight*scale,right:origin.x+(points[0]+points[2])*image.naturalWidth*scale,bottom:origin.y+(points[1]+points[3])*image.naturalHeight*scale};
   const r=box.getBoundingClientRect(),text=box.querySelector('[data-content=text]'),lineHeight=parseFloat(getComputedStyle(text).lineHeight);
   const x=innerWidth<=700?20:face.left-r.width-48,y=innerWidth<=700?face.bottom+20:Math.max(90,face.top+(face.bottom-face.top)*.6);
   const target={left:x,top:y,right:x+r.width,bottom:y+r.height};
   const controls=[trigger,next,back].filter(n=>n.getClientRects().length).map(n=>n.getBoundingClientRect());
   const fits=text.getBoundingClientRect().height<=lineHeight+1&&x>=20&&target.right<=innerWidth-20&&y>=78&&target.bottom<=innerHeight-94&&!overlap(target,face)&&!controls.some(r=>overlap(target,r));
   if(fits){box.style.setProperty('--reaction-x',x+'px');box.style.setProperty('--reaction-y',y+'px');box.dataset.presentation='reaction';document.body.dataset.presentation='reaction';shade.hidden=true;return}
   resetCaption(box);
  }
  document.body.dataset.presentation='caption';const r=box.getBoundingClientRect(),text=box.querySelector('[data-content=text]').getBoundingClientRect();
  // One full-screen scrim for CGs and sprite scenes. Ease alpha in from zero;
  // a shadow on the scrollable text box creates a hard seam at its top edge.
  const start=Math.max(0,r.top-56),solid=Math.max(start+1,text.top-12),span=solid-start;
  const stops=[[0,0],[.15,.025],[.3,.1],[.45,.25],[.6,.46],[.8,.68],[1,.78]]
   .map(([at,alpha])=>`rgba(24,33,36,${alpha}) ${start+span*at}px`);
  shade.style.background=`linear-gradient(to bottom,${stops.join(',')},rgba(24,33,36,.94) 100%)`;
 }
 function choices(label){
  const choice=document.querySelector('choice-container');document.body.dataset.narrativeChoice=String(!!choice&&prompts.has(label));if(!choice||!prompts.has(label))return;
  const context=choice.querySelector('.choice-context');if(!context||choice.querySelector('.choice-instruction'))return;
  const instruction=make('p',null,'주인공의 대답을 골라주세요.');instruction.className='choice-instruction';context.after(instruction);
  const note=make('p',null,'서안의 이야기를 듣고, 주인공이 답하는 장면이에요.');note.className='choice-note';(choice.querySelector('[data-content=wrapper]')||choice).append(note);
 }
 function messages(label,statement){
  const speaker=typeof statement==='string'?statement.split(' ')[0]:'',model=CP_CONVERSATIONS.resolve({label,speaker})||CP_CONVERSATIONS.records[document.body.dataset.conversation],active=playing()&&document.body.dataset.messageOnly==='true';
  remote.hidden=!active||!model||model.peer==='iseo';channel.hidden=footnote.hidden=!active||!model;
  if(!active||!model){delete document.body.dataset.conversation;return}
  document.body.dataset.conversation=model.id;channel.textContent=model.channel;document.getElementById('story-phone').setAttribute('aria-label',model.owner+'의 메시지 · '+model.name+'와의 대화');
  if(!remote.hidden){const src='assets/'+model.asset;if(!remoteImage.src.endsWith(src))remoteImage.src=src;remoteImage.alt='메시지 상대 '+model.incoming+'의 모습';remoteCaption.textContent=model.incoming+' · 메시지 상대';remote.dataset.character=model.peer}
 }
 let frame=0;
 function render(){if(typeof monogatari==='undefined'||!ready)return;const label=monogatari.state('label'),statement=monogatari.label()?.[monogatari.state('step')];back.hidden=!playing()||finished()||CP_GUIDE.isOpen()||document.body.dataset.uiHidden==='true';back.disabled=previousIndex()<0;choices(label);messages(label,statement);caption(label,statement)}
 function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;render()})}
 const returnTitle=$('title').onclick;$('title').onclick=async()=>{await returnTitle();render()};
 const original=syncStoryUI;syncStoryUI=function(){original();render();schedule()};
 addEventListener('resize',schedule);document.getElementById('narrative-image').addEventListener('load',schedule);document.getElementById('font-size').addEventListener('input',schedule);
 new ResizeObserver(schedule).observe(document.documentElement);
 return {render,previousIndex,previous,restoreVisuals,reactions,faces};
})();

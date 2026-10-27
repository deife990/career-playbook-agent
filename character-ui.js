'use strict';
// Sheet v0.2 sources are immutable. Viewports crop them at render time, without editing the artwork.
window.CP_CHARACTERS=(()=>{
 const cast={seoan:{name:'서안',note:'운영 조율 7년 차. 떠날 이유와 지키고 싶은 일상을 함께 생각한다.'},iseo:{name:'이서',note:'먼저 이직한 옛 동료. 새로운 일의 만족과 생활의 부담을 함께 전한다.'},nari:{name:'나리',note:'현장 운영 동료. 마감을 끝내고 퇴근 후의 생활을 즐긴다.'},yoon:{name:'윤 팀장',note:'확인한 사실과 내일 근무를 차분하게 전하는 운영팀장.'},player:{name:'나',note:'서안과 퇴근길을 함께하는 동료. 짧은 갈색 머리, 베이지 재킷과 펍의 어두운 상의.'}};
 function portrait(id){const n=document.createElement('span');n.className='cp-portrait';n.dataset.character=id;n.setAttribute('aria-hidden','true');return n}
 const book=document.createElement('dialog');book.id='character-book';book.setAttribute('aria-labelledby','character-book-title');
 const head=document.createElement('header'),heading=document.createElement('h2'),close=document.createElement('button');heading.id='character-book-title';heading.textContent='퇴근 후의 사람들';close.textContent='닫기';head.append(heading,close);close.onclick=()=>book.close();
 const tabs=document.createElement('nav');tabs.className='character-tabs';tabs.setAttribute('aria-label','등장인물');const intro=document.createElement('div');intro.className='character-intro';const sheet=document.createElement('img');sheet.className='character-sheet-image';sheet.width=1536;sheet.height=1024;
 function select(id){for(const b of tabs.children)b.setAttribute('aria-pressed',String(b.dataset.character===id));const text=document.createElement('p');text.textContent=cast[id].name+' — '+cast[id].note;intro.replaceChildren(portrait(id),text);sheet.src='assets/characters-v02/'+id+'.png';sheet.alt=cast[id].name+'의 표정·의상·프로필·포즈 시트';book.scrollTop=0}
 for(const [id,{name}]of Object.entries(cast)){const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.character=id;b.onclick=()=>select(id);tabs.append(b)}
 book.append(head,tabs,intro,sheet);document.body.append(book);select('seoan');
 function open(){CP_REVIEW.stop();book.showModal();close.focus()}
 const titleButton=document.createElement('button');titleButton.id='title-characters';titleButton.type='button';titleButton.textContent='등장인물';titleButton.onclick=open;document.querySelector('.title-actions').append(titleButton);
 const menu=document.querySelector('.more-items');menu.prepend(document.getElementById('history'));
 const characters=document.createElement('button');characters.textContent='등장인물';characters.onclick=()=>{document.querySelector('.game-more').open=false;open()};menu.append(characters);
 for(const [target,label]of [['vn-auto','자동 진행'],['vn-skip','읽은 문장 스킵']]){const b=document.createElement('button');b.textContent=label;b.dataset.readControl=target;b.onclick=()=>document.getElementById(target).click();menu.append(b)}
 // Notebook index holds secondary help; card/request controllers keep their existing DOM nodes.
 const preparation=document.getElementById('preparation'),layout=document.createElement('div'),index=document.createElement('aside'),main=document.createElement('div');layout.className='prep-notebook';index.className='prep-index';main.className='prep-main';
 const indexTitle=document.createElement('h3'),indexText=document.createElement('p');indexTitle.textContent='오늘 한 가지부터';indexText.textContent='필요한 준비를 고르고, 사용하던 AI에서 내 이야기로 이어가요.';
 const help=document.createElement('details'),helpTitle=document.createElement('summary');helpTitle.textContent='설치·사용 안내';help.append(helpTitle,preparation.querySelector('.tutorial-topics'));index.append(indexTitle,indexText,help);
 main.append(document.getElementById('prep-title'),...preparation.querySelectorAll(':scope>[data-panel]'));layout.append(index,main);preparation.querySelector('.panel-nav').after(layout);
 // Settings show the actual reading preference, with the existing slider as the sole owner.
 const settings=document.querySelector('[data-panel=settings]'),sample=document.createElement('div');sample.className='settings-dialogue-sample';const who=document.createElement('span'),line=document.createElement('p');who.textContent='서안';line.textContent='다른 일은 해보고 싶어. 근데 이사까지 생각하면 좀 막막해서.';sample.append(who,line);settings.insertBefore(sample,document.querySelector('.sound-option'));
 function sync(){
  if(typeof monogatari==='undefined')return;
  const label=monogatari.state('label');document.body.dataset.choiceKind=/^(Start|E01Talk|Promise)$/.test(label)?'relationship':'navigation';
  const holder=document.getElementById('phone-person'),active=document.body.dataset.device==='true';
  const id=label==='E02'?'iseo':document.body.dataset.messenger==='teams'?'yoon':'seoan';
  let avatar=holder.querySelector('.cp-portrait');if(active){if(!avatar){avatar=portrait(id);holder.prepend(avatar)}avatar.dataset.character=id}
  for(const b of menu.querySelectorAll('[data-read-control]'))b.setAttribute('aria-pressed',document.getElementById(b.dataset.readControl).getAttribute('aria-pressed')||'false');
  const field=document.getElementById('request');if(field&&document.getElementById('preparation').open&&!field.closest('[hidden]')){field.style.height='auto';field.style.height=field.scrollHeight+4+'px'}
 }
 // The engine owns Escape too; route these native dialogs before its key handler.
 document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const active=document.querySelector('#character-book[open],#backlog[open],#save-slots[open],#cg-gallery[open]');if(!active)return;event.preventDefault();event.stopImmediatePropagation();active.querySelector('header button')?.click()},true);
 const previous=syncStoryUI;syncStoryUI=function(){previous();sync()};
 const previousPanel=renderPanel;renderPanel=function(){const value=previousPanel.apply(this,arguments);requestAnimationFrame(sync);return value};
 window.addEventListener('resize',sync);return{cast,portrait,open,sync};
})();

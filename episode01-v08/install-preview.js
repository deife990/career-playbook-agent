'use strict';
// Local instructional UI. It never uploads a file, installs software or sends a request.
const CP_INSTALL_UI=(()=>{
 const e=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls||'';if(text)n.textContent=text;return n;};
 const icons={chat:'M5 5h14v10H9l-4 4z',plugin:'M9 3h6v5h5v7h-5v6H9v-6H4V8h5z',new:'M12 5H5v14h14v-7 M11 13l9-9 M16 4h4v4',search:'M15 15l5 5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',menu:'M4 6h16 M4 12h10 M4 18h16'};
 function icon(name){const n=document.createElementNS('http://www.w3.org/2000/svg','svg');n.setAttribute('viewBox','0 0 24 24');n.setAttribute('aria-hidden','true');const p=document.createElementNS(n.namespaceURI,'path');p.setAttribute('d',icons[name]||icons.chat);n.append(p);return n;}
 function row(label,type,active=false){const r=e('div','gpt-nav-row'+(active?' selected':''));r.append(icon(type),e('span','',label));return r;}
 function frame(index){
  const root=e('section','gpt-install-preview');root.setAttribute('aria-label','ChatGPT 설치 과정을 따라보는 재구성 화면');
  root.append(e('small','gpt-preview-note','ChatGPT · 설치 따라보기'));
  const window=e('div','gpt-desktop-window');const bar=e('div','gpt-window-bar');bar.innerHTML='<span class="gpt-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>ChatGPT</span><span aria-hidden="true">⋯</span>';window.append(bar);
  const layout=e('div','gpt-window-layout'),side=e('aside','gpt-install-sidebar');side.append(row('새 채팅','new'),row('채팅 검색','search'),row('라이브러리','chat'));
  const plugin=row('플러그인','plugin',index<4);side.append(plugin,e('small','gpt-sidebar-caption','내 공간'),row('프로젝트','chat'));layout.append(side);
  const main=e('div','gpt-install-main');layout.append(main);window.append(layout);root.append(window);
  const caption=e('p','gpt-preview-caption');caption.setAttribute('aria-live','polite');root.append(caption);
  const focus=(node,number)=>{node.classList.add('gpt-demo-focus');const badge=e('span','gpt-click-number',String(number));badge.setAttribute('aria-hidden','true');node.append(badge);};
  const tabs=()=>{const t=e('div','gpt-directory-tabs');for(const [label,selected] of [['OpenAI',false],['Personal · 개인용',true],['설치됨',false]])t.append(e('span',selected?'active':'',label));return t;};
  function directory(){main.replaceChildren();main.append(e('h3','','플러그인'),tabs());const search=e('div','gpt-directory-search','플러그인 검색');search.prepend(icon('search'));main.append(search);}
  if(index===1){
    let phase=0;
    const draw=()=>{
      directory();const heading=e('div','gpt-personal-heading');heading.append(e('strong','','개인용 플러그인'),e('span','','＋'));main.append(heading);
      const empty=e('div','gpt-empty');empty.append(icon('plugin'),e('strong','','내가 만든 플러그인'),e('p','','직접 만든 플러그인을 추가하고 새 대화에서 사용해요.'));main.append(empty);
      root.querySelectorAll('.gpt-demo-focus').forEach(n=>{n.classList.remove('gpt-demo-focus');n.querySelector('.gpt-click-number')?.remove();});
      const action=e('button','gpt-demo-action');
      if(!phase){focus(plugin,1);caption.textContent='① 왼쪽 사이드바에서 플러그인을 열어요.';action.textContent='플러그인 열어보기 →';action.onclick=()=>{phase=1;draw();};}
      else{focus(main.querySelector('.gpt-directory-tabs .active'),2);caption.textContent='② Personal(개인용) 탭을 확인해요. 다음 단계에서 받은 ZIP을 올려요.';action.textContent='처음부터 다시 보기 ↻';action.classList.add('quiet');action.onclick=()=>{phase=0;draw();};}
      caption.replaceChildren(document.createTextNode(caption.textContent),action);
    };draw();
  }else if(index===2){
    directory();const head=e('div','gpt-personal-heading');head.append(e('strong','','개인용 플러그인'));const add=e('span','gpt-demo-plus','＋');head.append(add);main.append(head);
    const menu=e('div','gpt-upload-menu');menu.append(e('span','','새 플러그인 만들기'));const upload=e('strong','','ZIP 업로드');focus(upload,1);menu.append(upload);main.append(menu);
    const file=e('div','gpt-upload-file');file.append(e('small','','다운로드에서 선택할 파일'),e('strong','','careerpilot-chatgpt-v1.2.0-rc.7.zip'),e('span','','ZIP · 압축을 풀지 않은 파일'));focus(file,2);main.append(file);
    caption.textContent='추가 메뉴에서 ZIP 업로드를 선택한 뒤, 다운로드 폴더의 ChatGPT용 파일을 골라요.';
  }else if(index===3){
    main.append(e('small','gpt-breadcrumb','플러그인  ›  CareerPilot'));
    const detail=e('div','gpt-plugin-detail');detail.append(e('span','gpt-plugin-icon','C'),e('h3','','CareerPilot'),e('p','','경험을 꺼내고, 다음 커리어를 준비해요.'));
    const installed=e('div','gpt-installed-status','✓ 설치됨');focus(installed,1);detail.append(installed,e('hr'),e('strong','','포함된 스킬'),e('p','','경험 정리 · 지원 준비 · 면접 연습'));
    main.append(detail);caption.textContent='이름이 CareerPilot인지, 설치됨으로 표시되는지 확인해요.';
  }else{
    side.querySelector('.selected')?.classList.remove('selected');
    main.append(e('div','gpt-chat-heading','ChatGPT  ⌄'));
    const welcome=e('div','gpt-new-chat','어디서부터 시작할까요?');main.append(welcome);
    const input=e('div','gpt-install-composer');
    const chip=e('span','gpt-composer-chip','C  CareerPilot');focus(chip,1);input.append(chip,e('p','',index===5?'CareerPilot으로 이직을 준비하고 싶어. 먼저 내 현재 상황부터 질문 하나씩 해줘.':'메시지를 입력하세요'));
    const controls=e('div','gpt-composer-controls');controls.append(e('span','','＋'),e('span','','↑'));input.append(controls);main.append(input);
    if(index===4){const mention=e('div','gpt-mention-result');mention.append(e('small','','@careerpilot'),e('strong','','C  CareerPilot'),e('span','','선택하면 입력창에 이름이 붙어요'));main.insertBefore(mention,input);}
    caption.textContent=index===4?'새 대화에서 @careerpilot을 찾아 선택해요. 입력창에 CareerPilot 이름이 붙으면 준비됐어요.':'CareerPilot을 선택한 입력창에 요청을 적고 전송해요.';
  }
  root.append(e('small','gpt-preview-disclosure','메뉴 위치를 보여주는 재구성 화면이에요. 실제 설치는 ChatGPT에서 진행해요.'));
  return root;
 }
 return {frame};
})();

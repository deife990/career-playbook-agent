'use strict';
// Readable teaching surfaces. These never impersonate a live service or install a plugin.
const CP_LESSON_UI=(()=>{
  const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node;};
  function uiIcon(name){
    const paths={copy:'M8 8h11v12H8z M5 16H3V3h12v2',like:'M8 10l4-7c3 0 2 4 2 6h5l-2 11H8z M3 10h5v10H3z',dislike:'M8 14l4 7c3 0 2-4 2-6h5L17 4H8z M3 4h5v10H3z',speaker:'M4 9h4l5-5v16l-5-5H4z M17 8c4 2 4 6 0 8',refresh:'M20 7v5h-5 M20 12a8 8 0 1 0-2 5',more:'M5 12h.01 M12 12h.01 M19 12h.01',mic:'M9 4a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0z M5 10v2a7 7 0 0 0 14 0v-2 M12 19v3 M8 22h8'};
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('gpt-ui-icon');
    const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[name]);svg.append(path);return svg;
  }
  const request=FIRST_REQUEST;
  function composer(service,text=request){
    const surface=el('div','lesson-composer');
    surface.append(el('small','lesson-rebuilt-label',service+' · 입력창 설명용 재구성'));
    const box=el('div','lesson-input'),line=el('p');
    line.append(el('span','lesson-chip',service==='Claude'?'/careerpilot':'CareerPilot'),document.createTextNode(' '+text.replace(/^\/careerpilot\s*/,'').replace(/^CareerPilot으로\s*/,'')));
    const tools=el('div','lesson-input-tools');tools.setAttribute('aria-hidden','true');tools.append(el('span','','＋'),el('span','','↑'));
    box.append(line,tools);surface.append(box);return surface;
  }
  function capture(frame,item){
    frame.querySelector('.lesson-reading')?.remove();frame.dataset.rebuilt=String(!!item.file);
    const image=frame.querySelector('img');if(image)image.hidden=!!item.file;
    if(!item.file)return;
    const surface=el('section','lesson-reading');
    const service=item.file.startsWith('claude')?'Claude':'ChatGPT';
    if(item.file.includes('01-first-prompt'))surface.append(composer(service,item.reading));
    else{
      surface.append(el('small','lesson-rebuilt-label',service+' · 제공된 실제 캡처를 읽기 쉽게 요약·재구성'));
      const card=el('div','lesson-answer');card.append(el('span','lesson-person','서안의 가상 예시'),el('p','',item.reading));surface.append(card);
    }
    const source=el('a','lesson-original','실제 캡처 원본 보기 ↗');source.href='assets/reference-ui/'+item.file;source.target='_blank';source.rel='noopener noreferrer';
    surface.append(source);frame.append(surface);frame.dataset.responsive='false';
  }
  function install(target,service,index){
    target.replaceChildren();target.hidden=false;
    if(index===0){
      target.append(el('small','lesson-rebuilt-label','이 게임에서 받는 실제 배포 파일'));
      const file=el('div','lesson-file');file.append(el('span','lesson-file-icon','ZIP'),el('strong','','careerpilot-'+service.toLowerCase()+'-v1.2.0-rc.7.zip'),el('p','','받은 파일은 압축을 풀지 않고, 다음 단계의 업로드 메뉴에서 선택해요.'));
      const download=el('a','lesson-primary',service+'용 ZIP 받기 ↓');download.href='downloads/careerpilot-'+service.toLowerCase()+'-v1.2.0-rc.7.zip';download.download='';file.append(download);target.append(file);
    }else if(index===4){
      target.append(composer(service));
      target.append(el('p','lesson-result','확인: 요청을 보낸 뒤, CareerPilot이 현재 상황을 묻는 질문을 하는지 확인해요.'));
    }else if(index===1||index===2){
      target.append(el('small','lesson-rebuilt-label','메뉴 경로 설명 · 실제 서비스 화면이 아니에요'));
      const path=service==='Claude'?['Customize','Skills','＋ → Create skill','Upload a skill']:['Plugins','Personal','추가 메뉴','ZIP 업로드'];
      const route=el('ol','lesson-route');path.forEach((name,i)=>{const row=el('li',i===(index===1?1:3)?'current':'',name);route.append(row);});target.append(route);
      if(service==='ChatGPT')target.append(el('p','lesson-caveat','개인용 경로는 이전 테스트 기준이에요. 같은 메뉴가 없다면 아래 공식 안내에서 계정·권한별 경로를 확인해요.'));
    }else target.hidden=true; // Actual installed/enabled capture stays visible for this step.
  }
  // Presentation attachments use existing message anchors, preserving saved story positions.
  const messageStickers=new Map([
    ['msg 집에 잘 들어갔어? 나도 도착.',{file:'wave',alt:'작은 곰이 반갑게 손을 흔드는 이모티콘'}],
    ['msg 오늘 그 얘기 들어줘서 고마워.',{file:'thanks',alt:'작은 곰이 하트를 꼭 안고 고마워하는 이모티콘'}]
  ]);
  let lastMessage='',messageTimer=null,messageAnimation=null,pendingBubble=null;
  function finishMessage(){if(!pendingBubble)return false;clearTimeout(messageTimer);document.querySelector('.typing-indicator')?.remove();pendingBubble.hidden=false;pendingBubble=null;messageAnimation?.finish();return true;}
  function phone({label,speaker,list,step,active}){
    const conversation=CP_CONVERSATIONS.resolve({label,speaker});
    const thread=active&&(label==='E02'&&['i','out'].includes(speaker)||['msg','replymsg'].includes(speaker)||speaker==='y'&&typeof list[step]==='string'&&list[step].startsWith('y '));
    document.body.dataset.conversation=thread&&conversation?conversation.id:'';
    document.body.dataset.messageOnly=String(thread);document.body.dataset.device=String(active);
    document.body.dataset.messenger=conversation?.theme||(speaker==='notice'?'mail':'notification');
    if(!active){lastMessage='';finishMessage();return;}
    const screen=document.querySelector('#story-phone .phone-screen'),body=document.getElementById('phone-body');
    const key=label+':'+step;const changed=lastMessage!==key;
    document.getElementById('phone-app').textContent=conversation?.name||(speaker==='notice'?'Offlook':'알림 센터');
    screen.querySelector('.phone-status span').textContent=['msg','replymsg'].includes(speaker)?'22:18':label==='E02'?'19:42':'18:07';
    const next=document.getElementById('phone-next');next.hidden=!thread;
    next.textContent=speaker==='y'&&typeof list[step+1]==='string'&&!list[step+1].startsWith('y ')?'휴대폰 내리기 →':label==='E02'&&typeof list[step+1]==='string'&&!/^(i|out) /.test(list[step+1])?'서안과 대화 계속 ▸':'계속 읽기 ▸';
    screen.querySelector('.example-composer')?.remove();
    if(!thread){
      if(label==='Start'&&speaker==='phone'){
        body.replaceChildren();body.classList.add('lockscreen');
        body.append(el('p','lock-date','10월 22일 목요일'),el('div','lock-time','18:07'));
        const notification=el('article','bank-notification');const header=el('div','push-app');header.append(el('span','bank-app-icon','t'),el('b','','토즈'),el('time','','지금'));notification.append(header,el('strong','','급여가 입금되었어요'),el('p','','레이크포트 파크 · 급여 입금'));body.append(notification);
      }else if(speaker==='notice'){
        body.classList.remove('lockscreen');body.replaceChildren();
        const mail=el('article','mobile-mail');
        const sender=el('div','mobile-mail-sender'),avatar=el('img');avatar.src='assets/northwind-mark.svg';avatar.alt='';
        const from=el('div');from.append(el('strong','','노스윈드 레저 그룹'),el('small','','받는 사람: 전 임직원 · 오후 4:30'));sender.append(avatar,from);
        mail.append(el('small','mail-folder','받은 편지함'),el('h3','','노스윈드 레저 그룹 운영 안내'),sender);
        const content=list.slice(0,step+1).filter(x=>typeof x==='string'&&x.startsWith('notice ')).at(-1)||'';
        const original=content.split('—').slice(1).join('—').trim();
        for(const paragraph of original.split(/(?<=다\.)\s+/).filter(Boolean))mail.append(el('p','',paragraph));
        body.append(mail);
      }else body.classList.remove('lockscreen');
      lastMessage=key;return;
    }
    body.classList.remove('lockscreen');
    clearTimeout(messageTimer);messageAnimation?.cancel();pendingBubble=null;body.replaceChildren();
    let messages=[];
    if(['msg','replymsg'].includes(speaker)){
      const labels=['E05Messages','C3_CALL_'+(monogatari.storage('c3')||'A'),'E05Last','CardLesson',...(['ReplyA','ReplyB','ReplyC'].includes(label)?[label]:[])];
      for(const name of labels){const lines=CP_STORY.script[name]||[];messages.push(...(name===label?lines.slice(0,step+1):lines).filter(x=>typeof x==='string'&&/^(msg|replymsg) /.test(x)));if(name===label)break;}
    }else messages=list.slice(0,step+1).filter(x=>typeof x==='string'&&(speaker==='y'?/^y /:/^(i|out) /).test(x));
    if(['ReplyA','ReplyB','ReplyC'].includes(label))body.append(el('small','read-receipt','읽음'));
    body.append(el('p','phone-date',['msg','replymsg'].includes(speaker)?'오늘 오후 10:18':speaker==='y'?'오늘 오후 6:07':'오늘 오후 7:42'));
    messages.forEach((message,i)=>{
      const bubble=el('p','chat-bubble'+(/^(out|replymsg) /.test(message)?' sent':''),message.slice(message.indexOf(' ')+1));
      if(conversation){const sender=/^(out|replymsg) /.test(message)?conversation.outgoing:conversation.incoming;bubble.dataset.sender=sender;bubble.setAttribute('aria-label',sender+': '+bubble.textContent);}
      const stickerData=['msg','replymsg'].includes(speaker)?messageStickers.get(message):null;
      let arrival=bubble,sticker=null;
      if(stickerData){
        arrival=el('div','sticker-message-group');arrival.dataset.direction=bubble.classList.contains('sent')?'outgoing':'incoming';sticker=el('figure','chat-sticker');
        const image=el('img');image.src='assets/seoan-sticker-'+stickerData.file+'.svg';image.alt=stickerData.alt;image.width=128;image.height=128;
        sticker.append(image);arrival.append(bubble,sticker);
      }
      body.append(arrival);
      if(i===messages.length-1&&changed&&typeof list[step]==='string'&&/^(msg|replymsg|i|out|y) /.test(list[step])&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        arrival.hidden=true;pendingBubble=arrival;const typing=el('span','typing-indicator');typing.setAttribute('aria-label','입력 중');typing.innerHTML='<i></i><i></i><i></i>';body.insertBefore(typing,arrival);
        const delay=message.includes('집에 도착했다는 답장')?1200:message==='msg 그리고…'?800:450;
        messageTimer=setTimeout(()=>{typing.remove();arrival.hidden=false;pendingBubble=null;messageAnimation=arrival.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.22,1,.36,1)'});if(sticker)sticker.animate([{opacity:0,transform:'scale(.88)'},{opacity:1,transform:'scale(1)'}],{duration:280,delay:180,fill:'backwards',easing:'ease-out'});body.scrollTop=body.scrollHeight;},delay);
      }
    });
    if(label==='E05Last'&&typeof list[step]==='string'&&!/^(msg|replymsg) /.test(list[step])){
      if(list[step].includes('입력 중')){const typing=el('span','typing-indicator');typing.setAttribute('aria-label','서안이 입력 중');typing.innerHTML='<i></i><i></i><i></i>';body.append(typing);}
      else{const attachment=el('div','resume-attachment');attachment.append(el('small','','서안이 보낸 이력서 일부'),el('strong','','레이크포트 파크 · 운영 7년'),el('p','','주요 업무: 고객 응대, 일일 마감'));body.append(attachment);}
    }
    body.scrollTop=body.scrollHeight;lastMessage=key;
  }
  return {capture,install,phone,composer,finishMessage};
})();
// Controls stay inside the device and use the existing guarded story advance.
{
  const screen=document.querySelector('#story-phone .phone-screen');
  const status=document.createElement('div');status.className='phone-status';status.setAttribute('aria-hidden','true');status.innerHTML='<span>9:41</span><span>▮▮▮  ▰</span>';screen.prepend(status);
  const next=document.createElement('button');next.className='phone-next';next.id='phone-next';next.textContent='다음 메시지 보기 ▸';next.onclick=()=>document.getElementById('next').click();screen.append(next);
  const home=document.createElement('span');home.className='phone-home-line';home.setAttribute('aria-hidden','true');screen.append(home);
  for(const [id,before] of [['story-install-rebuilt','story-install-open'],['install-rebuilt','install-zoom']]){
    const surface=document.createElement('div');surface.id=id;surface.className='lesson-install';surface.hidden=true;document.getElementById(before).before(surface);
  }
}

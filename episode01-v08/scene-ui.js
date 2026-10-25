'use strict';
// Scene presentation only: script positions, choices and save schema are unchanged.
const CP_SCENE_UI=(()=>{
  const phone=document.getElementById('story-phone');
  const cast=document.getElementById('message-cast');
  let mode='',motion=null,castFrame=0;
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  function before(){return phone.hidden?null:phone.getBoundingClientRect();}
  function layoutCast(){
    if(cast.hidden||phone.hidden)return;
    const edge=Math.max(16,innerWidth*.03),gap=Math.max(12,Math.min(24,innerWidth*.015));
    const side=(innerWidth-phone.offsetWidth)/2-edge-gap;
    const compact=innerWidth<=600||side<160;
    document.body.dataset.castLayout=compact?'compact':'portraits';
    if(compact)return;
    // Tie the frame to the sprite aspect ratio, rather than a viewport percentage.
    const portraits=[...cast.querySelectorAll('figure img')];
    const ratio=Math.max(...portraits.map(img=>img.naturalWidth?img.naturalHeight/img.naturalWidth:1.5));
    const width=Math.min(420,innerWidth*.27,side,(phone.offsetHeight*.84-32)/ratio);
    const height=width*ratio+32;
    const top=phone.offsetTop+(phone.offsetHeight-height)/2-cast.getBoundingClientRect().top;
    cast.style.setProperty('--cast-width',width+'px');
    cast.style.setProperty('--cast-height',height+'px');
    cast.style.setProperty('--cast-top',top+'px');
  }
  function scheduleCast(){if(!castFrame)castFrame=requestAnimationFrame(()=>{castFrame=0;layoutCast();});}
  function serviceLogos(){
    for(const button of document.querySelectorAll('choice-container button,.wizard-service')){
      const service=/^ChatGPT/.test(button.textContent.trim())?'chatgpt':/^Claude/.test(button.textContent.trim())?'claude':'';
      if(service){
        button.dataset.serviceBrand=service;
        if(!button.querySelector('.service-label')){
          const label=document.createElement('span');label.className='service-label';label.textContent=button.textContent.trim();
          const logo=document.createElement('span');logo.className='service-logo';logo.setAttribute('aria-hidden','true');
          button.replaceChildren(logo,label);
        }
      }
    }
  }
  function render(previous){
    const label=monogatari.state('label'),step=monogatari.state('step'),statement=monogatari.label()?.[step];
    const isIseo=playing()&&label==='E02'&&typeof statement==='string'&&/^(i|out) /.test(statement);
    const enteringCast=isIseo&&cast.hidden;
    document.body.dataset.iseoConversation=String(isIseo);cast.hidden=!isIseo;
    if(!isIseo)delete document.body.dataset.castLayout;
    const speaker=typeof statement==='string'?statement.split(' ')[0]:'';
    document.body.dataset.voice=['thought','phone','notice'].includes(speaker)?'thought':monogatari.characters()[speaker]?'dialogue':'narration';
    if(isIseo){
      const incoming=monogatari.label().slice(0,step+1).filter(s=>typeof s==='string'&&s.startsWith('i '));
      const pose=incoming.length>=3?'smile':incoming.length===2?'concerned':'front';
      const expression=document.getElementById('iseo-expression'),src='assets/iseo-'+pose+'-v0118.png';
      if(!expression.src.endsWith(src)){
        expression.src=src;
        if(!reduce())expression.animate([{opacity:.45},{opacity:1}],{duration:220,easing:'ease-out'});
      }
      document.getElementById('phone-avatar').src=src;
      document.getElementById('remote-person').hidden=true;
      layoutCast();
      if(enteringCast&&!reduce())for(const figure of cast.querySelectorAll('figure'))figure.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.2,.75,.25,1)'});
    }
    const isLock=!!phone.querySelector('.lockscreen');
    document.body.dataset.lockScreen=String(!phone.hidden&&isLock);
    if(document.body.dataset.messenger==='mail')document.getElementById('phone-org-mark').hidden=true;
    serviceLogos();
    const nextMode=phone.hidden?'':isIseo?'iseo':document.body.dataset.messageOnly==='true'?'conversation':'notification';
    // FLIP starts at the current painted position even when a click interrupts motion.
    if(nextMode!==mode){
      motion?.cancel();motion=null;
      if(nextMode&&!reduce()){
        const target=phone.getBoundingClientRect();
        const dx=previous?previous.left+previous.width/2-target.left-target.width/2:Math.min(innerWidth*.13,130);
        const dy=previous?previous.top-target.top:48;
        const scale=previous?previous.height/target.height:.84;
        motion=phone.animate([
          {transform:`translate(${dx}px, ${dy}px) scale(${scale})`,opacity:previous?1:0},
          {transform:'translate(0, 0) scale(1)',opacity:1}
        ],{duration:440,easing:'cubic-bezier(.2,.75,.25,1)'});
      }
      mode=nextMode;
    }
  }
  const sync=syncStoryUI;
  syncStoryUI=function(){const previous=before();sync();render(previous);};
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{if(event.matches)motion?.cancel();});
  window.addEventListener('resize',()=>{motion?.cancel();scheduleCast();});
  new ResizeObserver(scheduleCast).observe(phone);
  for(const img of cast.querySelectorAll('img'))img.addEventListener('load',scheduleCast);
  let logoFrame=0;
  new MutationObserver(()=>{if(!logoFrame)logoFrame=requestAnimationFrame(()=>{logoFrame=0;serviceLogos();});}).observe(document.body,{childList:true,subtree:true});
  return {render};
})();

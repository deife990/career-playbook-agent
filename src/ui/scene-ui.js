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
    const compact=innerWidth<=700;document.body.dataset.castLayout=compact?'compact':'portraits';
    if(compact)return;
    const image=document.getElementById('iseo-expression'),rect=phone.getBoundingClientRect(),gap=Math.max(16,innerWidth*.02);
    const room=Math.max(0,innerWidth-rect.right-gap*2),ratio=1.5;
    const width=Math.min(room,Math.max(0,rect.height-32)/ratio),height=width*ratio+32;
    cast.style.setProperty('--cast-left',rect.right+gap+(room-width)/2+'px');
    cast.style.setProperty('--cast-top',rect.top+(rect.height-height)/2+'px');
    cast.style.setProperty('--cast-width',width+'px');cast.style.setProperty('--cast-height',height+'px');
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
  function syncChoiceContext(){
    const choice=document.querySelector('choice-container'),statement=monogatari.label()?.[monogatari.state('step')];
    const prompt=typeof statement?.Choice?.Dialog==='string'?statement.Choice.Dialog:'';
    if(!choice||!prompt)return;
    let context=choice.querySelector('.choice-context');if(context&&choice.dataset.promptText===prompt)return;if(!context){context=document.createElement('div');context.className='choice-context';(choice.querySelector('[data-content=wrapper]')||choice).prepend(context)}
    const match=prompt.match(/^(s|me|i|y) (.*)$/s);const name=match?({s:'서안',me:'나',i:'이서',y:'윤 팀장'}[match[1]]):'';context.replaceChildren();if(name){const speaker=document.createElement('strong');speaker.textContent=name;context.append(speaker)}const text=document.createElement('p');text.textContent=match?match[2]:prompt;context.append(text);choice.dataset.promptText=prompt;
  }
  function render(previous){
    const label=monogatari.state('label'),step=monogatari.state('step'),statement=monogatari.label()?.[step];
    const relation=CP_CONVERSATIONS.resolve({label,speaker:typeof statement==='string'?statement.split(' ')[0]:''});
    const isIseo=playing()&&relation?.peer==='iseo';
    const enteringCast=isIseo&&cast.hidden;
    document.body.dataset.iseoConversation=String(isIseo);cast.hidden=!isIseo;
    if(!isIseo)delete document.body.dataset.castLayout;
    const speaker=typeof statement==='string'?statement.split(' ')[0]:'';
    document.body.dataset.voice=['thought','phone','notice'].includes(speaker)?'thought':monogatari.characters()[speaker]?'dialogue':'narration';
    if(isIseo){
      const incoming=monogatari.label().slice(0,step+1).filter(s=>typeof s==='string'&&s.startsWith('i '));
      const pose=incoming.length>=3?'smile':incoming.length===2?'concerned':'front';
      const expression=document.getElementById('iseo-expression'),src='assets/iseo-'+pose+'-v0118.png';
      expression.alt='메시지로 연락하는 이서 · '+({front:'정면',concerned:'걱정하는',smile:'미소 짓는'}[pose])+' 모습';
      if(!expression.src.endsWith(src)){
        expression.src=src;

      }
      document.getElementById('phone-avatar').src=src;
      document.getElementById('remote-person').hidden=true;
      layoutCast();
      if(enteringCast&&!reduce()&&!restoring&&!transitioning)for(const figure of cast.querySelectorAll('figure'))figure.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:CP_MOTION.duration('normal'),easing:CP_MOTION.ease()});
    }
    const isLock=!!phone.querySelector('.lockscreen');
    document.body.dataset.lockScreen=String(!phone.hidden&&isLock);
    if(document.body.dataset.messenger==='mail')document.getElementById('phone-org-mark').hidden=true;
    serviceLogos();
    syncChoiceContext();
    const nextMode=phone.hidden?'':isIseo?'iseo':document.body.dataset.messageOnly==='true'?'conversation':'notification';
    // FLIP starts at the current painted position even when a click interrupts motion.
    if(nextMode!==mode){
      motion?.cancel();motion=null;
      if(nextMode&&!reduce()&&!restoring&&!transitioning){
        // The reading surface stays put: no zoom from a phone-sized origin.
        motion=phone.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:CP_MOTION.duration('normal'),easing:CP_MOTION.ease()});
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
  new MutationObserver(()=>{if(!logoFrame)logoFrame=requestAnimationFrame(()=>{logoFrame=0;serviceLogos();syncChoiceContext();});}).observe(document.body,{childList:true,subtree:true});
  return {render};
})();

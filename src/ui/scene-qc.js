'use strict';
// Presentation only. No script insertions, step changes or save-schema changes.
const CP_SCENE_MOTION=(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),seen=new Map(),running=new Map();
 const duration=name=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cp-motion-'+name))||0;
 function visible(n){return !n.closest('[hidden]')&&n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden'}
 function stop(key){const old=running.get(key);if(old){old.animations.forEach(a=>a.cancel());old.ghost?.remove();running.delete(key)}}
 function record(n,key){
  if(!visible(n)){seen.delete(key);stop(key);return}
  const src=n.getAttribute('src'),r=n.getBoundingClientRect(),old=seen.get(key);
  const value={src,rect:{x:r.x,y:r.y,width:r.width,height:r.height},fit:getComputedStyle(n).objectFit,position:getComputedStyle(n).objectPosition};
  if(transitioning)return;
  seen.set(key,value);if(old?.src===src)return;
  stop(key);if(reduced.matches||restoring||transitioning)return;
  const animations=[],entry={animations,ghost:null};running.set(key,entry);
  const start=()=>{
   if(!n.isConnected||n.getAttribute('src')!==src||running.get(key)!==entry)return;
   if(old){
    const ghost=document.createElement('img');ghost.src=old.src;ghost.alt='';ghost.setAttribute('aria-hidden','true');ghost.className='cp-image-crossfade';
    Object.assign(ghost.style,{left:old.rect.x+'px',top:old.rect.y+'px',width:old.rect.width+'px',height:old.rect.height+'px',objectFit:old.fit,objectPosition:old.position});
    document.body.append(ghost);entry.ghost=ghost;
    animations.push(ghost.animate([{opacity:1},{opacity:0}],{duration:duration('short'),easing:'ease-out',fill:'forwards'}));
   }
   animations.push(n.animate([{opacity:0},{opacity:1}],{duration:duration(old?'short':'normal'),easing:'ease-out'}));
   Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>{if(running.get(key)===entry)stop(key)});
  };
  // Assets are preloaded; decode still guards a restored or previously unseen expression.
  if(n.complete&&n.naturalWidth)start();else n.decode().then(start).catch(()=>stop(key));
 }
 function sync(){
  if(!ready)return;
  const found=new Set();
  for(const n of document.querySelectorAll('game-screen img[data-character],#iseo-expression,#narrative-image')){
   const key=n.dataset.character||n.id;found.add(key);record(n,key);
  }
  for(const key of seen.keys())if(!found.has(key)){seen.delete(key);stop(key)}
 }
 let frame=0;function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;sync()})}
 const original=syncStoryUI;syncStoryUI=function(){original();sync();schedule()};
 new MutationObserver(schedule).observe(document.getElementById('monogatari'),{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
 addEventListener('resize',()=>{for(const key of running.keys())stop(key);seen.clear();schedule()});
 reduced.addEventListener('change',()=>{for(const key of running.keys())stop(key);schedule()});
 return{sync,duration};
})();

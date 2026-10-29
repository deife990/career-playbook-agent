'use strict';
// Presentation is derived from authored scene content, never saved as a second story state.
const CP_ALERTS=(()=>{
 const card=document.getElementById('message-arrival'),bannerMarkup=card.innerHTML;
 // The company notice is mail, not a personal message. Keep one scene-derived owner.
 const mailMarkup='<div class="outlook-bar"><span class="window-lights" aria-hidden="true"><i></i><i></i><i></i></span><b class="mail-app-brand"><span aria-hidden="true">✉</span> Offlook</b><span class="mail-search">메일 검색</span></div><div class="outlook-content"><small>받은 편지함 · 오늘 오후 4:30</small><h3 id="arrival-title"></h3><div class="mail-from"><img src="assets/northwind-mark.svg" alt="" width="32" height="32"><p><b id="arrival-source"></b><small>받는 사람: 전 임직원</small></p></div><p id="arrival-body"></p></div>';
 let current=null,key='',mail=false;
 function resolve({label,list,step,active}){
  if(!active)return null;
  const statement=list[step],line=typeof statement==='string'?statement:'';
  const firstIseoMessage=label==='E02'?list.findIndex(s=>typeof s==='string'&&s.startsWith('i ')):-1;
  if(firstIseoMessage>=0&&step<firstIseoMessage)return{kind:'message',system:false,source:'메시지',icon:'●',title:'이서 언니',body:'서안아, 아까 이력서 막혔다고 했지?',time:'지금'};
  if(label==='Start'){
   const pocket=list.findIndex(s=>typeof s==='string'&&s.startsWith('휴대폰을 주머니'));
   const salary=list.find(s=>typeof s==='string'&&s.startsWith('phone 급여가 입금되었습니다.'));
   const notice=list.find(s=>typeof s==='string'&&s.startsWith('notice 노스윈드 레저 그룹 운영 안내 —'));
   const prior=list.slice(0,step+1).filter(s=>s===salary||s===notice||typeof s==='string'&&s.startsWith('y ')).at(-1);
   const companyAt=list.findIndex(s=>typeof s==='string'&&s.startsWith('알림을 넘기자'));
   const teamAt=list.findIndex(s=>typeof s==='string'&&s.startsWith('입금 알림을 지워도'));
   if(pocket>=0&&step>=pocket||teamAt>=0&&step>=teamAt||prior?.startsWith('y '))return null;
   if(notice&&(prior===notice||companyAt>=0&&step>=companyAt)){const [title,...body]=notice.slice(7).split(' — ');return{kind:'company',system:true,icon:'▣',source:'노스윈드 레저 그룹',title,body:body.join(' — '),reaction:line===notice?'연봉 동결에, 매각이라.':null}}
   if(salary&&(prior===salary||line.startsWith('손안에서 휴대폰이 울린다.')))return{kind:'bank',system:true,icon:'₩',source:'토즈 · 입금 알림',title:salary.slice(6),body:'레이크포트 파크 · 급여 입금',time:'지금',reaction:line===salary?'오늘도 월급은 들어왔네.':null};
  }
  // The other authored phone item is a calendar reminder, not an exchange of messages.
  if(label==='E05'){
   const appointment=list.find(s=>typeof s==='string'&&s.startsWith('phone 면접 — 내일 / 수도권 사무실'));
   if(appointment&&(line===appointment||line.startsWith('서안이 휴대폰을 집는다. 화면이 켜지면서 내일 일정 알림'))){const [title,...body]=appointment.slice(6).split(' — ');return{kind:'calendar',system:true,icon:'▦',source:'서안의 일정 알림',title,body:body.join(' — '),reaction:line===appointment?'내일… 면접?':null}}
  }
  return null;
 }
 function sync(context){
  const next=resolve(context),nextKey=JSON.stringify(next);current=next;
  card.hidden=!next;document.body.dataset.notificationKind=next?.kind||'';document.body.dataset.systemNotification=String(!!next?.system);document.body.dataset.notificationCaption=String(!!next?.reaction);
  if(nextKey===key)return next;key=nextKey;card.scrollTop=0;
  if(!next){delete card.dataset.kind;return null}
  card.dataset.kind=next.kind;const nextMail=next.kind==='company';
  if(mail!==nextMail){card.innerHTML=nextMail?mailMarkup:bannerMarkup;mail=nextMail;}
  const icon=card.querySelector('.message-app-icon');if(icon)icon.textContent=next.icon;
  document.getElementById('arrival-source').textContent=next.source;document.getElementById('arrival-title').textContent=next.title;document.getElementById('arrival-body').textContent=next.body;
  const time=card.querySelector('time');if(time){time.hidden=!next.time;time.textContent=next.time||'';}return next;
 }
 return{resolve,sync,current:()=>current,isOpen:()=>!card.hidden};
})();

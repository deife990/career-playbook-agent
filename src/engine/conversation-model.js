'use strict';
// One relationship model supplies the theme, participants, profile and remote portrait.
const CP_CONVERSATIONS=(()=>{
 const records={
  work:{id:'work',theme:'teams',peer:'yoon',name:'운영팀 · 윤 팀장',owner:'나',incoming:'윤 팀장',outgoing:'나',channel:'업무 · 운영팀 단체 채팅',asset:'yoon-front.png'},
  seoan:{id:'seoan',theme:'kakao',peer:'seoan',name:'서안',owner:'나',incoming:'서안',outgoing:'나',channel:'개인 메시지 · 나 ↔ 서안',asset:'seoan-front.png'},
  iseo:{id:'iseo',theme:'ios',peer:'iseo',name:'이서 언니',owner:'서안',incoming:'이서',outgoing:'서안',channel:'개인 메시지 · 서안 ↔ 이서',asset:'iseo-front-v0118.png'}
 };
 function resolve({label,speaker}){return label==='E02'&&['i','out'].includes(speaker)?records.iseo:['msg','replymsg'].includes(speaker)?records.seoan:speaker==='y'?records.work:null}
 return {records,resolve};
})();

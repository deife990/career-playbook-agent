'use strict';
// ART REGISTRY — single source for which background/sprite file is current.
// To swap art: add the file under assets/, change the filename here, run checks/visual. Never edit game.js for art.
// Speaker ids are used in story.js lines ("s 안녕", "thought ..."). Colours are name-plate colours.
const CP_CAST = {
  scenes: {office:'office-evening-v81.png',gate:'gate-night.png',cafe:'lake-pub-night.png',home:'home-protagonist-v0102.png'},
  characters: {
    thought:{name:'나 · 속마음',color:'#3e6674'},
    staff:{name:'동료',color:'#605568'},
    reply:{name:'다른 동료',color:'#605568'},
    s:{name:'서안',color:'#86563d',sprites:{smile:'seoan-smile-v4.png',neutral:'seoan-front.png',avert:'seoan-avert-v4.png',serious:'seoan-serious-v4.png',listening:'seoan-listening-v4.png',laugh:'seoan-laugh-v4.png',shy:'seoan-shy-v5.png',burst:'seoan-burst-v5.png',thoughtful:'seoan-thoughtful-v6.png'}},
    me:{name:'나',color:'#3e6674'},
    y:{name:'윤 팀장 · 팀 채팅',color:'#605568'},
    n:{name:'나리',color:'#8a6757',sprites:{front:'nari-front.png',smile:'nari-smile.png',thoughtful:'nari-thoughtful.png'}},
    phone:{name:'휴대폰 알림',color:'#57736b'},
    notice:{name:'사내 공지',color:'#617180'},
    i:{name:'이서 · 메시지',color:'#766089'},
    msg:{name:'서안 · 메시지',color:'#86563d'},
    replymsg:{name:'나 · 메시지',color:'#3e6674'},
    out:{name:'서안 → 이서',color:'#86563d'},
    ai:{name:'CareerPilot 예시',color:'#3e6674'}
  }
};

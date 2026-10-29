'use strict';
// A single route is selected at entry. Each subsequent surface has one next action.
const CP_WIZARD=(()=>{
 const actions={ChatGPT:[
  '아래 링크로 ChatGPT용 파일을 받아요. 압축을 풀지 말고 다운로드 폴더에 그대로 두세요.',
  'ChatGPT 왼쪽의 플러그인을 열고, Personal(개인용) 탭을 선택해요.',
  '개인용 플러그인의 추가 메뉴에 ZIP 업로드가 보이면, 방금 받은 ChatGPT용 파일을 골라요. 메뉴가 없다면 아래 도움말을 열어주세요.',
  '설치 화면에서 이름이 CareerPilot인지 확인하고 설치해요. 설치된 플러그인 목록에서 다시 확인하세요.',
  '새 채팅을 열고 입력창에서 @를 입력해 CareerPilot을 골라요. 입력창에 이름이 들어오면 준비됐어요.'
 ],Claude:[
  '아래 링크로 Claude용 파일을 받아요. 압축을 풀지 말고 다운로드 폴더에 그대로 두세요.',
  'Claude를 열고 왼쪽 사이드바의 Customize(사용자 지정), 그 안의 Skills(스킬)을 선택해요.',
  'Skills의 + 버튼 → Create skill → Upload a skill 순서로 열고, 받은 Claude용 ZIP을 선택해요.',
  'Skills 목록에서 CareerPilot 오른쪽 스위치를 켜요. 꺼져 있으면 대화에서 사용할 수 없어요.',
  '새 대화를 열어요. /careerpilot을 선택하거나 CareerPilot 이름을 넣어 요청할 수 있어요.'
 ]};
 // Compatibility entry for restored legacy preparation views; new UI lives in CP_GUIDE.
 function render(){window.CP_GUIDE?.sync()}
 return {render,actions};
})();

const CP_PUB_POSES={E01:[['호숫가 펍.','chin'],['창밖으로','seated'],['소매','chin']],E01Talk:[['공지에 매각','chin'],['설명회 때','chin'],['아침에 같은','seated'],['컵을 내려놓','chin'],['창밖','window']],E04:[['내려놓는다. 서안은 컵','chin']],E05:[['벌써 지원','chin'],['창밖','window']]};
const CP_STAGE=(()=>{
 const pubLabels=new Set(['E01','E01Talk','E02','E04','Promise','E05','C1_CALL_A','C1_CALL_B','C1_CALL_C','C2_A','C2_B','C2_C','C2_CALL_A','C2_CALL_B','C2_CALL_C','C3_A','C3_B','C3_C']);
 function render(label,statement){
  const active=playing(),gate=active&&label==='P02',pub=active&&(pubLabels.has(label)||label.startsWith('Tutor')||/^E03/.test(label));
  const home=active&&(['E05Messages','E05Last','CardLesson','Finish','ReplyA','ReplyB','ReplyC','EndQuiet'].includes(label)||/^C3_CALL_/.test(label));
  document.body.dataset.home=String(home);
  const art=document.getElementById('narrative-art'),img=document.getElementById('narrative-image');art.hidden=!(gate||pub||home);document.body.dataset.narrativeArt=String(gate||pub||home);document.body.dataset.linear=String(active&&label==='TutorLinear');
  if(gate||pub||home){
   const pose=typeof statement==='string'?CP_PUB_POSES[label]?.find(([prefix])=>statement.includes(prefix))?.[1]:null;document.body.dataset.pubPose=pose||'';
   const actionPose=pose==='chin'||pose==='window'||typeof statement==='string'&&/杯|컵을 내려놓|소매|팔을 테이블|설명회|본사가|본사 돈|창밖|시선을 내렸다/.test(statement);
   const reflective=actionPose||(label==='E01Talk'||label==='E05'||(typeof statement==='string'&&/이력서|모르겠|막막|망설|무섭|뭘 바꾸고/.test(statement)))&&!(typeof statement==='string'&&/잔에 맺힌|컵을|잔을/.test(statement));
   const laugh=pose==='laugh'||label==='C1_CALL_C'||(typeof statement==='string'&&/웃는다|성실했네|약속할까/.test(statement));
   const message=label==='E02'&&typeof statement==='string'&&/^(i|out) /.test(statement);
   const file=message?'lake-pub-night.png':home?'home-protagonist-v0102.png':gate?'gate-together-v0141-sheets.png':laugh?'seoan-pub-laugh-v092.png':(pose!=='seated'&&reflective)?'seoan-pub-chin-v091.png':'seoan-pub-seated-v092.png';
   if(!img.src.endsWith(file))img.src='assets/'+file;
   img.alt=message?'호숫가 야경이 보이는 빈 펍. 이서와 서안의 메시지 대화가 이어진다.':home?'펍에서와 같은 짧은 갈색 머리의 주인공이 집에서 외투를 벗고 책상에 앉아 휴대폰을 본다. 얼굴은 보이지 않는다.':gate?'게이트를 막 나온 두 사람이 호숫가 길에서 헤어지기를 망설이며 마주 선다. 주인공은 뒷모습이다.':laugh?'어깨에 힘을 빼고 앉은 서안이 잔에 한 손을 가볍게 얹은 채 웃는다.':reflective?'아이보리 니트 차림의 서안이 한 손으로 턱을 가볍게 괴고 생각한다.':'테이블 맞은편 서안이 어깨에 힘을 빼고 앉아 한 손은 잔에 가볍게 두고, 다른 팔은 몸 옆으로 내려놓는다.';
  }
 }
 // Kept for the general engine advance contract. Tutorial steps have no typing wait.
 function finishTyping(){return false}
 return {render,finishTyping};
})();

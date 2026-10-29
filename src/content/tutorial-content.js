'use strict';
// Authored fiction, shared by step view, transcript and rereading. Never an AI response.
window.CP_TUTORIAL_CONTENT = (()=>{
 const message=(speaker,text)=>Object.freeze({speaker,text});
 const data={
 S01:{title:'정리가 안 됐으면 질문부터',aside:'어디서부터 말할지 모르겠어서, 질문부터 부탁했어.',requestId:'W01_START',messages:[message('CareerPilot','현재 어떤 일을 하고 있나요? 최근 일하면서 마음에 남은 장면 하나부터 말해도 괜찮아요.')],explanation:'처음부터 바꿀 것과 지킬 것을 정리해서 가져오지 않아도 돼요.',action:'서안의 답 보기',nextId:'S02'},
 S02:{title:'최근 장면에서 단서 찾기',messages:[message('서안','테마파크 운영 업무 7년째야. 오늘도 마감할 때 같은 민원을 처리했어. 운영 방식을 바꿔보면 어떨까 생각했는데, 처리하고 나면 늘 다음 날 준비야.'),message('CareerPilot','반복해서 대응하는 일에 익숙하지만, 운영 방식을 직접 바꿔볼 기회가 아쉬웠군요. 새 운영안을 기획하고 시험하는 경험을 늘리는 게 바꾸고 싶은 점의 후보일까요?')],aside:'응. 그냥 회사를 바꾸고 싶은 건지, 맡는 일을 바꾸고 싶은 건지 조금 나뉘네.',explanation:'최근 장면에서 출발해 임시 후보를 찾은 거예요. 이 한 번의 대화로 이직 여부가 결정되지는 않아요.',action:'모르는 조건은 어떻게 할까?',nextId:'S03'},
 S03:{title:'모르는 것은 미정으로',messages:[message('CareerPilot','일을 바꾸더라도 계속 지키고 싶은 생활이 있나요?'),message('서안','온호시에 계속 살고 싶어. 엄마 가게도 가깝고, 여기 생활이 좋아. 준비하는 동안 수입도 끊기면 안 돼. 필요한 급여랑 어디까지 출퇴근할 수 있는지는 아직 모르겠어. 그건 미정으로 남겨줘.')],explanation:'모른다고 말해도 대화는 계속돼요. 빈칸을 채우려고 조건을 만들어내지 않아요.',action:'정리한 조건 확인하기',nextId:'S04'},
 S04:{title:'내 뜻과 다르면 고치기',messages:[message('CareerPilot','온호시에 계속 살고 싶다는 말은, 근무지도 온호시로 제한한다는 뜻일까요?')],explanation:'사는 곳과 일하는 곳은 다른 조건이에요. 서안은 어떻게 구분해서 말할까요?',correction:message('서안','사는 곳은 온호시에 두고 싶어. 출퇴근할 수 있는 범위는 아직 모르겠어. 거주지와 근무 가능 지역은 나눠서 적어줘.'),before:'근무지도 온호시만 가능한지 확인 필요',after:'거주지는 온호시 유지 희망 / 근무 가능 지역은 미정',action:'조건을 나눠 말하기',nextId:'S05'},
 S05:{title:'오늘은 후보 하나만 남겨도',summary:[['바꾸고 싶은 점의 후보','새 운영안을 기획·시험하는 경험 늘리기'],['지키고 싶은 조건','온호시 거주 희망 / 재직 중 준비하며 수입 유지'],['아직 모르는 점','필요한 급여 / 근무 가능 지역·출퇴근 범위']],messages:[message('서안','오늘 나온 내용과 아직 모르는 점을 정리해줘. 다음엔 여기서 이어서 얘기할게.')],explanation:'오늘은 후보 하나를 발견해도 충분해요. 다음에는 사용하던 AI 대화를 찾아서 이어갈 수 있어요.',action:'펍 장면으로 돌아가기',nextId:null},
 I01:{title:'선택 서비스용 파일 받기'},I02:{title:'서비스의 설치 메뉴에서 ZIP 올리기'},I03:{title:'CareerPilot 목록·활성화 확인'},I04:{title:'대화에서 CareerPilot 사용하는 방법'},I05:{title:'첫 요청 준비'},
 P01:{title:'평소 쓰는 AI를 골라주세요'},P02:{title:'내 상황으로 첫 대화 시작하기',requestId:'W01_START'},C00:{title:'시작했던 대화 확인하기'},C01:{title:'시작한 대화 이어가기',requestId:'W01_CONTINUE'},T01:{title:'설치 없이 일반 대화로 맛보기',requestId:'W01_TASTE'}
 };
 function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value)}return value}return freeze(data);
})();

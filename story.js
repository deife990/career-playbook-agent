'use strict';
const choose = (key, dialog, options) => ({Choice: Object.fromEntries([
  ['Dialog', dialog], ...options.map((text, index) => {
    const value = 'ABC'[index];
    return [value, {Text: text, Do: `jump ${key.toUpperCase()}_${value}`, onChosen: function () {
      this.storage({[key]:value});
      if(key==='c2')this.storage({selfReason:{A:'나도 오늘 한 일 적으려니까 같은 안내만 떠올라. 이러다 다른 데선 뭘 할 수 있을지 모르겠어.',B:'나도 바꾸고는 싶은데, 월급 끊길까 봐 선뜻 못 움직이겠어.',C:'나도 회사는 바꾸고 싶은데, 이 동네는 못 떠나겠어.'}[value]});
    }}];
  })
])});
const callback = key => ({Conditional: {
  Condition: function () { return this.storage(key); },
  A: `jump ${key.toUpperCase()}_CALL_A`, B: `jump ${key.toUpperCase()}_CALL_B`, C: `jump ${key.toUpperCase()}_CALL_C`
}});
const CP_STORY = {script: {
  Opening: [
    'show scene office',
    'staff 오늘도 수고하셨습니다!!',
    'reply 네, 내일 봐요!',
    {Function:{Apply:async function(){await transitionOut('온호시 · 레이크포트 파크');}}},
    'show scene gate',
    {Function:{Apply:async function(){await transitionIn();}}},
    'jump WalkHome'
  ],
  WalkHome: ['thought 아… 오늘도 끝났네.', 'jump RecallDesk'],
  RecallDesk: ['thought 오전엔 이용권 날짜 바꿀 수 있냐는 전화. 어제도 같은 안내 했는데.', 'jump RecallPeople'],
  RecallPeople: ['thought 오후엔 마감표 채우고, 빠진 숫자 확인하고. 어제 파일이랑 날짜만 다르네.', 'jump RecallHold'],
  RecallHold: ['thought 새로운 일 좀 해보나 했는데. 이번에도 보류네.', 'jump WalkQuestion'],
  WalkQuestion: ['thought 하아… 나 여기 계속 다녀도 되나.', 'thought 이직 좀 알아볼까… 다른 데는 좀 다르려나.', 'jump Start'],
  Start: [
    'show scene gate',
    {Function:{Apply:async function(){await pauseBeforeNotice();}}},
    '손안에서 휴대폰이 울린다. 띵동. 걷던 속도를 늦추고, 화면을 얼굴 가까이 들어 알림을 연다.',
    'phone 급여가 입금되었습니다.',
    '알림을 넘기자 오후에 본 사내 공지가 다시 뜬다.',
    'notice 노스윈드 레저 그룹 운영 안내 — 전사 연봉 동결을 유지합니다. 일부 사업장 매각 및 조직 축소에 따라 다음 시즌 신규 투자 계획을 조정합니다. 파크별 세부 운영안은 추후 안내합니다.',
    '입금 알림을 지워도 공지는 남아 있다. 팀 단체 채팅방에 메시지가 하나 더 와 있다.',
    'y 공지 관련해서 제가 확인한 것도 여기까지입니다. 내일 근무는 올려둔 표대로예요. 변경 생기면 제가 다시 올리겠습니다.',
    'y 오늘 마감 끝난 분들은 퇴근하세요. 나머지 질문은 내일 받을게요.',
    '휴대폰을 주머니에 넣고 다시 걷는다.',
    '똑, 똑, 똑.',
    'thought …어?',
    {Function:{Apply:async function(){await transitionOut('고개를 돌리면');}}},
    'show character s shy at center',
    {Function:{Apply:async function(){await transitionIn();}}},
    '뒤를 돌아보자 서안이 손끝을 거두며 한 걸음 물러선다.',
    's 저기… 같이 가도 돼? 아까부터 뒤에 있었는데, 너무 열심히 보고 있길래.',
    'me 아, 미안. 공지 다시 보느라.',
    'show character s neutral at center',
    's 나도 읽었어. 읽을 때마다 내용이 좀 달라졌으면 좋겠는데.',
    '출입구 문이 다시 열린다. 운동 가방을 멘 나리가 우리를 발견하고 손을 든다.',
    'show character s neutral at right', 'show character n front at left',
    'n 둘 다 아직 여기야? 오늘 마감 깔끔하던데.',
    's 이제 가려고. 넌 오늘도 수영?',
    '나리가 벗어둔 외투를 팔에 걸친다.', 'show character n smile at left',
    'n 응. 회사 생각은 물에 들어가기 전까지만. 월급도 들어왔고, 오늘은 딱 여기까지 할래.',
    's 다녀와. 머리 잘 말리고.',
    'n 알았어, 엄마. 둘도 조심히 가!',
    '나리가 운동 가방을 고쳐 메고 버스 정류장 쪽으로 간다. 발소리가 멀어지자 서안이 자기 휴대폰을 꺼낸다.',
    'hide character n', 'show character s neutral at center',
    's 나도 방금 월급 들어왔더라.',
    '서안이 자기 입금 알림을 내 쪽으로 살짝 기울여 보인다.',
    'me 응. 이건 정확하네.',
    's 그러니까. 사람 마음 약해지게.',
    'me 뭐가?',
    's 어제는 진짜 나가려고 했거든. 오늘 입금 보니까 일단 저녁부터 먹고 생각할까 싶어.',
    '서안이 은행 앱을 닫는다. 다시 켜려다, 휴대폰을 주머니에 넣는다.',
    '직원 출입구 너머로 마지막 시설 조명이 꺼진다. 내일이면 비슷한 시간에 다시 켜질 불이다.',
    choose('c1', 's 우리, 이번에는 진짜 나가볼까?', ['일단 게이트부터 나갈까?', '나도 요즘 그 생각했어.', '나 데리고 나가려고?'])
  ],
  C1_A: ['s 좋아. 그건 내가 열어줄 수 있지.', '서안이 웃으며 한 발 옆으로 선다.', 's 나머지는 따뜻한 데 가서 얘기하자. 너 아까부터 손 비비고 있어.', 'jump P02'],
  C1_B: ['서안이 휴대폰을 쥔 손을 바꾼다.', 's 그럼 나 혼자 타이밍 재던 건 아니네. 며칠째 눈치 봤는데.', 'me 무슨 타이밍?', 's 한잔하자고 할 타이밍. 회사 욕 말고 다른 얘기도 좀 하려고.', 'jump P02'],
  C1_C: ['s 응. 일단 게이트 밖으로. 그 뒤는 같이 알아보고.', 'me 계획은 있어?', 's 호숫가 펍이 아직 문을 안 닫았다는 데까진 확인했어.', 'jump P02'],
  P02: ['서안이 출입증을 찍는다. 게이트 옆에서 내가 나오는 걸 기다린다.', 's 조용한 데 앉아 있을 시간 있어? 오늘은 게이트 앞에서 바로 헤어지기 싫어서.', 'me 이 시간에?', 's 한 잔만. 오늘은 다른 얘기도 좀 하고 싶어.', '휴대폰을 잠그고 게이트 밖으로 걸음을 옮긴다. 평소에는 여기서 각자 집으로 향했다.', 'jump E01'],
  E01: [
    {Function:{Apply:async function(){await transitionOut('1화 · 떠날 이유, 남을 이유');}}},
    'show scene cafe',
    {Function:{Apply:async function(){await transitionIn();}}},
    '호숫가 펍. 찬바람을 뒤로하고 문을 닫는다. 재킷을 벗어 의자에 걸자 서안도 맞은편에 앉는다.',
    '창밖으로 호수의 불빛이 흔들린다. 탄산수 두 잔이 놓이자 서안이 내 쪽으로 잔 하나를 밀어준다.',
    'show character s smile at center',
    's 여기. 문에서 먼 쪽. 네 자리야.',
    '서안이 니트 소매를 살짝 걷고, 가방을 의자 밑으로 밀어 넣는다.', callback('c1')
  ],
  C1_CALL_A: ['s 게이트 탈출 성공. 다음은 여기서 나가기. 그건 좀 천천히 해도 되고.', 'jump E01Talk'],
  C1_CALL_B: ['s 나도 그 생각 했다는 말. 그거 듣고 한잔하자고 하길 잘했다 싶었어.', 'jump E01Talk'],
  C1_CALL_C: ['s 나랑 같이 알아보자는 얘기야. 아직 계획은 없고. 지금부터 같이 짜면 안 돼?' , 'me 한 잔이 참가비야?', '서안이 참다가 결국 소리 내 웃는다. 잔을 내려놓고, 웃음이 멎기를 기다린다.', 's 응. 환불은 안 돼. 이미 한 모금 마셔서.', 'jump E01Talk'],
  E01Talk: [
    's 공지에 매각 얘기 있었잖아. 다른 지역 체험 시설이래. 지난번에도 몇 군데 정리했고.', 'me 그럼 우리도 뭐 달라지나?',
    's 우리 쪽 얘기는 아직 없더라. 새로 해보자던 일은 또 미뤄졌고. 그건 내가 직접 들었어.',
    '서안이 잔에 맺힌 물방울을 손끝으로 한 번 밀어낸다.',
    's 설명회 때 들었잖아. 우리 파크, 본사 돈 빌려서 버티는 거.',
    's 근데 월급날엔 그걸 자꾸 잊어버려.',
    'me 그래도 본사가 메워주는 동안은 괜찮겠지.',
    's 그 본사가 지금 사업장 팔고 사람 줄이는 중이잖아.',
    'me 오늘 월급은 들어왔는데, 앞으로도 괜찮을지는 모르겠네.', 's 응. 새 시즌이어도 내가 맡을 일은 거의 그대로고.',
    '옆 테이블의 웃음소리가 낮아진다.',
    's 아침에 같은 시설 확인하고, 비슷한 민원 받고, 저녁엔 같은 순서로 마감하고. 요즘은 어제 일인지 지난주 일인지도 헷갈려.',
    'me 나는 오늘 이용권 날짜 바꿔달라는 전화만 세 번 받았어. 셋 다 같은 안내로 끝났고.',
    '서안이 컵을 내려놓는다.', 's 그러다 이력서를 열면 고객 응대, 운영 관리… 뻔한 말만 쓰게 돼. 분명 바쁘게 일했는데, 언제 뭘 해결했는지 잘 기억도 안 나고.',
    'me 그래서 나가고 싶은 거야?', 's 응. 다른 일은 해보고 싶어. 근데 이사까지 생각하면 좀 막막해서.', '잠깐 말을 멈추고 창밖을 본다.',
    's 근데 내 고향 온호시는 좋아해. 퇴근하면 엄마 가게 들러서 반찬 하나 집어오고. 회사 바꾸려다 그런 일상까지 다 바뀔까 봐 망설여져.',
    '서안이 창밖을 보다가 다시 내 쪽으로 몸을 돌린다.',
    choose('c2', 's 난 이런데. 너는 뭐 때문에 멈춰 있어?', [
      '계속 이렇게 지내면, 다른 데서 뭘 할 수 있을지 모르겠어.',
      '월급은 들어오잖아. 이걸 놓고 나가는 게 무서워.',
      '회사는 떠나고 싶은데, 이 도시를 떠나기는 어려워.'
    ])
  ],
  C2_A: ['s 여기선 다들 내가 뭘 하는지 아는데, 밖에선 처음부터 설명해야 하니까?' , 'me 응. 새로 배울 기회도 줄고. 그냥 시간이 갈까 봐.', 's 나도 그래. 남이 한 일은 금방 떠오르는데, 내 얘기만 하려면 맨날 같은 말이 나와.', 'jump E02'],
  C2_B: ['s 알지. 통장도 정확하고, 내일 누가 무슨 말 할지도 대충 알고.', 'me 다른 데 가면 다시 배워야 하고. 거기가 더 낫다는 것도 모르겠고.', 's 나도 입금 알림 좋아해. 계속 받고 싶고. 그래서 다니면서 알아보자는 거야.', 'jump E02'],
  C2_C: ['서안이 시선을 든다. 이번에는 대답이 조금 빠르다.', 's 그건 나도. 이 동네 슈퍼 주인까지 나를 아는데, 처음부터 다시 하기 좀 아깝지.', 'me 여기 생활을 그대로 가져갈 수는 없으니까.', 's 응. 회사는 바꾸고 싶은데 단골집까지 바꾸고 싶은 건 아니거든.', 'jump E02'],
  E02: [
    '띵동. 테이블 위 휴대폰이 켜진다. 서안이 잔을 내려놓고, 화면에 뜬 이름을 확인한다.',
    's 이서 언니한테 연락왔네? 아까 내 이력서 얘기했거든.',
    'i 서안아, 아까 이력서 막혔다고 했지? 전에 보낸 CareerPilot 기억나? 그걸로 해봤어? 링크 다시 보낼게.',
    'out 설치는 해뒀는데 내 얘기하려니까 또 멈췄어. 나 아직 이력서 창도 안 닫았는데.',
    'i 나도 맨날 그랬거든. ChatGPT나 Claude에서 CareerPilot 켜놓고, 오늘 걸렸던 장면 하나부터 얘기해봐.',
    'out 매일 마감하고 민원 받았다는 얘기밖에 안 나오면?',
    'i 그중에 유난히 정신없었던 하루 하나만 골라봐. 뭘 물어보면 평소 말하듯 답하고. 내일 어떻게 됐는지 알려줘.',
    '서안이 답장을 보내고 휴대폰을 내 쪽으로 돌린다.',
    's 이서 언니. 작년에 먼저 옮겼잖아. 오후에 이력서 쓰다가 막혔다고 했더니, 또 자기 일처럼 찾아봤네.',
    'me 써봤어?',
    's 설치는 해뒀어. 그런데 내 얘기를 하려니까 또 멈추더라.',
    'me 어디서부터?',
    's 뭘 바꾸고 싶은지 물으면 그냥 다른 일, 이 말만 나와. 오늘도 똑같이 마감했는데.',
    'me {{selfReason}}',
    's 응. 일단 오늘 있었던 일부터 말해볼까. 네가 옆에서 좀 들어줘.',
    'jump TutorialStart'
  ],
  TutorialStart: [
    '서안이 의자를 내 옆으로 조금 끌어온다. 맞은편에 있던 얼굴이, 이제 고개만 돌리면 바로 옆에 있다.',
    's 거기선 화면 잘 안 보이지? 이쪽으로 조금만 와봐.',
    '휴대폰을 두 사람 사이에 세운다. 화면을 보려다 서로의 어깨가 살짝 닿는다. 서안이 손을 멈췄다가, 아무렇지 않은 척 화면을 켠다.',
    's …이 정도면 보이겠다. 내 걸로 먼저 해볼게. 너는 옆에서 봐줘.',
    'jump TutorRequest'
  ],
  // Stable engine holds. The modal advances its own authored steps, never the script.
  TutorRequest: ['서안의 휴대폰에서 CareerPilot 사용 예시를 봅니다. 가상 대화이며 실제 응답은 달라질 수 있어요.', 'jump E03'],
  TutorNext: [
    's 그냥 다른 일이 하고 싶다는 줄 알았는데, 새로 해보고 싶은 일이 있었네.',
    'me 모르는 것도 아직 남아 있고.',
    's 응. 오늘 다 정할 필요는 없겠다. 다음엔 여기서 이어서 물어봐야지.',
    'jump E03'
  ],
  E03: [{Choice: {
    Dialog:'이번에는 내 상황으로 시작할까요? 지금 직접 해보거나, 나중에 내 준비에서 시작할 수 있어요. 어떤 선택을 해도 이야기는 이어져요.',
    actual:{Text:'내 상황으로 시작하기',Do:'jump E03Actual',onChosen:function(){bridge.practice=null;}},
    example:{Text:'서안의 예시 다시 보기',Do:'jump E03Example'},
    skip:{Text:'지금은 이야기 계속',Do:'jump E04'}
  }}],
  E03Actual:['첫 대화는 본인의 상황으로 시작해요. 설치·실습 없이도 이야기를 계속할 수 있어요.','jump E04'],
  E03Example:['서안의 CareerPilot 사용 예시를 다시 봅니다. 가상 대화입니다.','jump E03'],
  E04: [
    '휴대폰을 내려놓는다. 서안은 컵을 손바닥으로 굴리다가 내가 고개를 들자 손을 멈춘다.',
    's 이거 생각보다 오래 걸리겠는데.', 'me 이직 준비?', 's 뭘 바꾸고 싶은지 말하는 거. 회사 이름만 바꾸면 끝인 줄 알았더니.',
    '서안이 냅킨 모서리를 접다가 내 쪽을 본다. 근무 중엔 무전기 너머로만 듣던 목소리가, 오늘은 이렇게 가깝다.', callback('c2')
  ],
  C2_CALL_A: ['s 시간만 갈까 봐 무섭다고 했잖아. 내 것도 한 줄이야. 서로 뭐 했는지 물어봐주자. 웃지는 말고.', 'jump Promise'],
  C2_CALL_B: ['s 월급은 계속 받자. 둘 다. 사직서 쓰고 여기서 한 잔 값으로 눈치 보지 말고.', 'me 동맹 규칙 1번?', 's 응. 일단 사직서는 아직 보내지 마. 면접 얘기할 때까진.', 'jump Promise'],
  C2_CALL_C: ['s 이 도시 남는 거, 일단 적어두자. 너 바꾸라고 설득하러 나온 건 아니니까.', 'me 그럼 갈 데가 적을 수도 있잖아.', 's 적을 수도 있지. 여기 남아서 옮길 데가 있는지는, 나도 아직 안 찾아봤어.', 'jump Promise'],
  Promise: ['s 대신 하나 약속할까?', 'me 벌써 계약 조건이 나와?', 's 응. 구두 계약이라 까먹기 쉬워. 하나만.',
    choose('c3','우리 사이의 약속', ['준비하다 막히면 서로 말하기.', '먼저 나가도 연락 끊지 않기.', '회사를 나가는 거랑 이 도시를 떠나는 건 따로 생각하기.'])],
  C3_A: ['s 그럼 나 오늘 아주 성실했네.', 'me 왜?', 's 계속 막혔잖아. 내 얘기 하는데. 내일도 이럴 수 있으니까 미리 말해둔다.', 'jump E05'],
  C3_B: ['서안이 내 쪽을 본다. 대답이 조금 늦는다.', 's 그럼 회사 얘기 없을 때도 연락해도 되는 거네.', '서안이 컵을 들었다가 다시 내려놓는다.', 's 알았어. 그럼 내가 먼저 할게. 회사 얘기 없는 날에도.', 'jump E05'],
  C3_C: ['서안이 내 얼굴을 본다. 이번에는 농담을 고르는 표정이 아니다.', 's 사실 그 말, 누가 해줬으면 했어.', 'me 일단 그렇게 생각해보자.', 's 응. 나중에 내가 또 한꺼번에 생각하면 지금 말 다시 해줘. 네가 말하면 좀 믿어져.', 'jump E05'],
  E05: [
    '서안이 휴대폰을 집는다. 화면이 켜지면서 내일 일정 알림이 잠깐 보인다.', 'phone 면접 — 내일 / 수도권 사무실',
    '서안은 화면을 뒤집으려다 멈춘다.', 'me 내일?', 's 응.', 'me 벌써 지원했어?',
    's 응. 공고 닫히기 전에. 보내고 나서야 실감 났어.', '잠깐 정적이 흐른다. 서안이 시선을 내렸다가 다시 올린다.',
    's 이거 말하려고 오늘 보자고 했어. 잔에 얼음 녹을 때까지 딴 얘기만 했네.',
    'me 그럼 아까 자기 일 설명하다 막혔다는 건?', 's 보낼 땐 됐거든. 내일 사람이 앞에 앉아서 물어본다고 생각하니까, 내가 쓴 말이 내 말 같지가 않아.',
    '같이 출발한다고 생각했는데, 서안은 이미 한 발 먼저 나가 있었다.',
    '서안이 의자 밑 가방 쪽으로 손을 내렸다가 멈춘다. 대신 휴대폰을 고쳐 쥔다.',
    's 면접 보러 가는 건 하루면 되는데.', 'me 붙으면?', '서안은 창밖을 본다. 어두운 호수에 펍 안쪽의 불빛이 비친다.',
    's 그다음은… 아직 잘 모르겠어.', '서안이 내 쪽으로 시선을 돌린다.', 's 면접 끝나면 여기로 오는 버스는 예매해놨어.',
    '서안이 휴대폰을 손안에서 한 번 돌린다.', 's 끝났다고 연락할 사람도 있고. 그다음 건 아직 모르겠지만.',
    'jump E05Messages'
  ],
  E05Messages: [
    {Function:{Apply:async function(){await transitionOut('그날 밤 · 집');}}},
    'hide character s', 'show scene home',
    {Function:{Apply:async function(){await transitionIn();}}},
    '집. 외투를 걸고 작은 스탠드만 켠다. 펍의 말소리 대신 냉장고 돌아가는 소리가 들린다.',
    '가방을 내려놓고 앉자, 서안에게서 새 메시지가 왔다.',
    'msg 집에 잘 들어갔어? 나도 도착.', 'msg 아까 네 자리, 문 안쪽으로 잡길 잘했네. 집에 와서야 손이 따뜻해졌어.', 'msg 오늘 그 얘기 들어줘서 고마워.', callback('c3')],
  C3_CALL_A: ['msg 막히면 말하라며. 벌써 쓰게 됐네. 내 이력서 한 줄만 봐줄래?', 'jump E05Last'],
  C3_CALL_B: ['msg 회사 얘기 없어도 연락해도 된다고 해놓고 첫 연락이 이력서네. 한 줄만 봐줘.', 'jump E05Last'],
  C3_CALL_C: ['msg 회사랑 도시는 따로. 메모해놨어. 내일은 일단 내 일부터 제대로 말하고 올게. 한 줄만 봐줄래?', 'jump E05Last'],
  E05Last: [
    '서안이 이력서 일부를 보내왔다. “레이크포트 파크 · 운영 7년 / 주요 업무: 고객 응대, 일일 마감.”',
    'msg 지원할 때 쓴 건 이 두 줄이야. 매일 하는 일은 다 비슷해 보여서 이것저것 뺐더니, 정작 내가 해결한 일이 하나도 안 보이네.',
    'msg 내일 구체적으로 뭘 했냐고 물으면 뭐부터 얘기하지. 지난여름에 마감 직전에 단체 손님 몰렸던 날 기억나?',
    '그 아래로 ‘입력 중…’이 나타난다.',
    'msg 그날 대기 줄 나누고, 다른 구역에 지원 요청하고, 마지막 손님 나갈 때까지 내가 있었잖아. 그런 얘기부터 해도 되겠지?',
    'jump CardLesson'
  ],
  CardLesson: [
    'msg CareerPilot에도 그날 일을 하나씩 물어봐달라고 보내볼게. 근사한 문장 만들기 전에, 내가 뭘 했는지부터 기억나게.',
    'msg 아까 네 옆에서 해보니까 좀 덜 막히더라. 일단 그날 일부터 적어볼게. 내일은 내가 쓴 걸 내 말로 얘기하고 싶어.',
    'msg 너도 오늘 얘기한 거 잊기 전에 한 줄만 남겨놔.',
    'msg 그리고…',
    'msg 집에 도착했다는 답장도 좀 줘.',
    {Choice:{Dialog:'답장을 보낸다.',
      A:{Text:'도착했어. 내일 면접 잘 봐.',Do:'jump ReplyA'},
      B:{Text:'응. 끝나면 연락해. 기다릴게.',Do:'jump ReplyB'},
      C:{Text:'도착했어. …돌아오는 버스 몇 시 거야?',Do:'jump ReplyC'}
    }}
  ],
  ReplyA:['replymsg 도착했어. 내일 면접 잘 봐.','msg 응. 네가 들어줬으니까 내 얘기 좀 해볼게. 잘 자.','jump EndQuiet'],
  ReplyB:['replymsg 응. 끝나면 연락해. 기다릴게.','msg 기다린다고 하니까… 끝나자마자 연락해야겠다. 잘 자.','jump EndQuiet'],
  ReplyC:['replymsg 도착했어. …돌아오는 버스 몇 시 거야?','msg 여덟 시 반. 왜, 마중 나오게? …내일 연락할게.','jump EndQuiet'],
  EndQuiet:[{Function:{Apply:async function(){await transitionOut('내일도, 연락하기로 했다.');}}},{Function:{Apply:async function(){await transitionIn();}}},'jump Finish'],
  Finish:['1화 끝']
}};

// Author-directed expression beats. A pose stays in place between beats;
// all eight expressions share one frontal master, lighting and framing.
const CP_EXPRESSION_BEATS={
  Start:[['저기…','shy'],['나도 읽었어.','neutral'],['이제 가려고.','listening'],['다녀와.','smile'],['그러니까.','avert']],
  E01:[['여기.','smile'],['오늘은.','shy']],
  C1_CALL_C:[['응. 환불은','burst']],
  C3_B:[['그럼 회사','shy'],['알았어.','shy']],
  E01Talk:[['공지에 매각','serious'],['설명회 때','serious'],['근데 월급날엔','avert'],['아침에 같은','neutral'],['그러다 이력서','thoughtful'],['근데 내 고향','thoughtful']],
  E02:[['이서 언니.','smile'],['예전에 언니가','thoughtful'],['응. 설치는 내가','avert'],['아까 새 일을','neutral']],
  TutorialStart:[['거기선 화면','smile'],['…이 정도면','avert']],
  E04:[['이거 생각보다','listening'],['뭘 바꾸고','serious']],
  Promise:[['대신 하나','smile'],['응. 구두 계약','laugh']],
  E05:[['응. 공고','serious'],['이거 말하려고','avert'],['면접 끝나면','smile'],['끝났다고','avert']]
};
for(const [label,lines] of Object.entries(CP_STORY.script)){
  let expression=null;
  CP_STORY.script[label]=lines.flatMap((line,index)=>{
    // E03Actual keeps its v0.11.9 statement offsets for existing saves.
    if(typeof line!=='string'||label==='E03Actual')return [line];
    if(line.startsWith('show character s ')){expression=line.split(' ')[3];return [line];}
    if(!line.startsWith('s '))return [line];
    const beat=CP_EXPRESSION_BEATS[label]?.find(([prefix])=>line.slice(2).startsWith(prefix));
    const fallback=label.startsWith('TutorInstall')||label.startsWith('TutorChatGPT')?'listening':/^C[123]_/.test(label)?'smile':'neutral';
    const mood=beat?.[1]||expression||fallback;
    if(mood===expression)return [line];expression=mood;
    const duo=label==='Start'&&index>lines.indexOf('show character n front at left')&&index<lines.indexOf('hide character n');
    return ['show character s '+mood+' at '+(duo?'right':'center'),line];
  });
}

for(const [origin,key] of [['Start','C1'],['E01Talk','C2'],['Promise','C3']]){
 const choice=CP_STORY.script[origin].find(line=>line?.Choice).Choice;
 for(const option of ['A','B','C'])CP_STORY.script[key+'_'+option].unshift('me '+choice[option].Text);
}

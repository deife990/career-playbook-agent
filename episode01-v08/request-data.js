'use strict';
// Canonical first request shared by every teaching and copy surface.
const FIRST_REQUEST = 'CareerPilot으로 이직을 준비하고 싶어. 내 삶과 커리어에서 바꾸고 싶은 점과 지키고 싶은 조건을 정리하고 싶어. 먼저 내 현재 상황부터 질문 하나씩 해줘.';
const TASTE_REQUEST = '이직할지 아직 정하지 못했어. 지금 하는 일, 바꾸고 싶은 점, 지키고 싶은 생활 조건을 정리하도록 질문을 하나씩 해줘. 모르는 조건은 미정으로 남겨줘. 회사나 직무를 바로 추천하기보다 내 상황부터 물어봐줘.';

// Only these authored requests can be handed off; no user/AI conversation content.
const REQUESTS = {W01_START:FIRST_REQUEST, W01_TASTE:TASTE_REQUEST};

# v0.11.8 · 이서와 윤 팀장 눈매 차별화

C-01 · 변경 파일: index.html, game.js, scene-ui.js, scene-ui.css, assets/*-v0118.png, face-review.html · 확인 크기: 1280×720, 800×450, 375×812 · 남은 문제: 없음(차별화 강도는 비교 화면에서 미감 검토 가능).

사용자 지시에 따라 서안과 나리의 원본 외형은 고정했습니다. 이서는 가로로 긴 차분한 눈매와 낮은 눈꺼풀 선, 윤 팀장은 조금 더 올라간 눈꼬리와 직선적인 눈썹으로 조정했습니다. 머리·의상·체형을 바꾸는 재설계는 진행하지 않았습니다.

## 새 리소스

- 이서: assets/iseo-front-v0118.png, assets/iseo-concerned-v0118.png, assets/iseo-smile-v0118.png
- 윤 팀장: assets/yoon-front-v0118.png, assets/yoon-neutral-v0118.png, assets/yoon-serious-v0118.png
- 타이틀 눈매 재료: assets/title-cast-eyes-v0118.png

생성 방식은 내장 image_gen입니다. 입력 이미지와 최종 프롬프트는 [assets/production-v0118.json](assets/production-v0118.json)에 기록했습니다. 새 파일은 모두 프로젝트 안에 저장했고 기존 PNG도 보존했습니다.

단체 그림을 통째로 대체하면 고정 대상에게 생성 오차가 생길 수 있어, 실제 타이틀은 기존 assets/title-cast-v010.png 위에 이서·윤 팀장의 눈과 눈썹 영역만 마스크로 겹칩니다. 서안·나리와 배경, 몸, 의상 등 나머지 영역은 기존 단체 원본입니다. 생성된 타이틀 재료를 단독 최종 타이틀로 사용하지 않습니다.

## 연결과 확인

- 메일 회상 윤 팀장, Teams 프로필, 이서 메시지의 기본·걱정·미소 및 프로필을 새 리소스로 연결했습니다. 윤 팀장 neutral은 기존 동작에 없는 새 장면을 만들지 않고 예비 리소스로 보관합니다.
- 세 크기에서 타이틀, 윤 팀장 메일, 이서 메시지 화면을 열어 이미지와 가로 넘침을 확인했습니다. review/v0118/qa.json 및 각 화면 PNG 참고.
- 대사·선택지·61개 라벨·저장 스키마를 변경하지 않았고 기존 원문 보호 검사가 통과했습니다.
- [face-review.html](face-review.html)에서 이전/수정, 얼굴 확대/전체 자세, 컬러/흑백 비교를 제공합니다.

# 서안 — 선택한 A안의 표정 4종

2026-10-20 · 표정 시안 0.1 · 사용자 A안 선택 반영 / 최종 스프라이트 마감 전

사용자는 **A안의 섬세하고 부드러운 일러스트**를 선택했다. B안 추천은 비교 당시 제작 의견으로 보관하고, 이후 서안 제작은 A안을 기준으로 한다. 기존 얼굴 시안을 참고해 정수리 여백을 확보한 기본 원화를 만든 다음, 그 기본 원화를 입력으로 나머지 세 표정을 각각 편집했다. 얼굴·헤어·니트·집업의 부드러운 묘사를 유지했다.

| 기본 | 옅은 웃음 |
|---|---|
| ![서안 기본](assets/character-studies/seoan-a-expressions-v01/01-neutral.png) | ![서안 옅은 웃음](assets/character-studies/seoan-a-expressions-v01/02-soft-smile.png) |
| 상대를 편안하게 보는 눈과 살짝 다문 입. 급여 대화·평범한 질문. | 눈가와 입꼬리를 함께 올린 닫힌 입의 웃음. 게이트 농담·자리 챙겨주기. |

| 시선 회피 | 진지함 |
|---|---|
| ![서안 시선 회피](assets/character-studies/seoan-a-expressions-v01/03-averted-gaze.png) | ![서안 진지함](assets/character-studies/seoan-a-expressions-v01/04-serious.png) |
| 눈동자를 옆으로 돌리고 말을 고르는 표정. 커피 제안·자기 부탁 직전. | 정면 시선과 웃음기 없는 입. 내일 면접 공개·중요한 약속. |

## 제작 확인과 남은 마감

네 장 모두 **1024×1536 RGBA PNG**, 투명 알파 채널과 완전 투명 영역이 있음을 파일로 확인했다. 원본 이미지를 프로젝트로 복사했으며 별도 이미지 편집 프로그램이나 코드로 그림을 수정하지 않았다. 내장 image_gen으로 기본 원화 편집 1회와 나머지 표정 편집 3회를 수행했다.

육안으로 눈동자 방향·입꼬리·눈가의 차이를 확인했다. 기본과 웃음은 의도적으로 작은 변화이고 시선 회피가 가장 뚜렷하다. 이는 제작자 검토이며 사용자 선호·모바일 가독성·실행 중 교체 품질을 검증한 것은 아니다.

최종 게임 자산으로 쓰기 전에는 다음을 정리한다.

1. **인물 위치:** 표정마다 얼굴·머리·어깨와 옷 주름의 위치가 조금 달라진다. 현재는 공통 몸 위에 정확히 겹치는 얼굴 레이어가 아닌, 각각의 상반신 그림이다. 화면 시안에 배치해 기준 크기·얼굴 위치를 고정하고 교체 시 움직임을 줄인다.
2. **가장자리:** 머리 주변에 부드러운 색 번짐이 남았다. 투명 채널이 있다는 사실만으로 깨끗한 누끼가 완성됐다고 판단하지 않는다. 밝은 카페·어두운 출입구 양쪽에 올려 확인한 뒤 가장자리 마감이 필요하다.
3. **레이어:** 몸·얼굴 분리와 출입증 켜기/끄기 레이어는 아직 없다. 첫 화면 시안은 현재 상반신 그림으로 가능하지만, 최종 조립에서 필요한 파일 구조를 결정한다.

다음 제작 작업은 이 A안으로 **타이틀·카페 대사/선택·설치/준비 패널**의 대표 화면 방향을 잡는 것이다. 최종 그림을 모두 완성할 때까지 임시 화면 배치를 미룰 필요는 없다. 엔진 한 장면 시험은 임시 그림으로 병행할 수 있다. 게임 코드·배경·조연 원화는 이 표정 작업에 포함하지 않았다.

## 저장 자료

- [기본](assets/character-studies/seoan-a-expressions-v01/01-neutral.png) · [옅은 웃음](assets/character-studies/seoan-a-expressions-v01/02-soft-smile.png) · [시선 회피](assets/character-studies/seoan-a-expressions-v01/03-averted-gaze.png) · [진지함](assets/character-studies/seoan-a-expressions-v01/04-serious.png)
- [실제 생성 프롬프트 4개](assets/character-studies/seoan-a-expressions-v01/prompts.json) · [파일 확인 기록](assets/character-studies/seoan-a-expressions-v01/asset-check.json)
- [이전 A/B 비교](SEOAN_VISUAL_REVIEW.md) · [비주얼 기준](VISUAL_DIRECTION.md) · [제작 일정](BETA_RUNBOOK.md) · [1화 조립표](EP01_OPENING_STORYBOARD.md)

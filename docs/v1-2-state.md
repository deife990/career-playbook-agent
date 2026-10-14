# v1.2 상태와 이전 팩 호환성

schema_version은 1.0.0을 유지합니다. 새 필드는 선택적이고 null을 허용합니다.
v1.2 독자는 v1.0/v1.1 팩을 그대로 읽으며 기존 값·ID·null·배열 순서를 보존합니다.
단순 복원·재출력에서 빠진 필드를 빈 배열로 만들지 않습니다. 새로운 필드를 사용하는 팩은
이전의 엄격한 독자를 업데이트해야 합니다. 기존 팩을 삭제하거나 필드를 버려 변환하지 않습니다.

| 위치 | 추가 내용 |
|---|---|
| career-profile.json의 career_episodes | 일반화하고 확인한 전역 경험 사건 |
| CareerEvidence | 출처 유형, bridge_source, ownership_classification, episode_id, scope, 개인정보 검토, 최소 출처 |
| applications/<id>.json의 evidence_discovery_sessions | 해당 지원의 기준·후보·범위·검색 라운드·중단 이유 |

Source references는 날짜·일반화한 제목·자료 종류만 담습니다. 원문 메일·붙여넣은 원문 전체·
내부 URL·다른 지원의 source ID를 전역 근거로 옮기지 않습니다. raw_content_stored=false입니다.
저장되는 후보도 sanitization과 맥락 검토가 필요합니다. 확인 전의 후보는 확인된 사실이 아닙니다.

새 전역 행동 근거는 A/B/C, 정확한 사용자 확인, 개인정보 검토를 요구하며 USER FACT /
USER_CONFIRMED로 기록합니다. D/E는 개인 행동 근거로 승격하지 않습니다. 개인 결과가 미확인일
때 팀 결과를 대신 넣지 않습니다. 사건과 근거에는 일치하는 행동과 유효한 전역 ID를 연결합니다.

기존 제출본·지원 답변·원래 JD·실제 면접 답변/복기·원래 이직 조건은 유지합니다. 새로운 확인된
경험은 별도 전역 근거와 Story Bank에 추가합니다. 기존 사실이 충돌하면 자동 덮어쓰지 않습니다.
회사별 검색 기준과 면접관 정보는 전역 경력 사실이 아닙니다.

Python 파일은 개발용 검증 도구입니다. 설치 ZIP은 Markdown/JSON/YAML만 포함하며,
사용자에게 Python·서버·추가 계정·API key를 요구하지 않습니다. 파일 저장이 불가능한 환경에서는
대화 안의 정리와 이름 있는 JSON 내보내기를 제공하고, 저장되지 않은 기억을 저장했다고 말하지 않습니다.

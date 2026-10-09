# v1.1 상태 확장 및 제출본 보존

기존 `schema_version: 1.0.0`과 네 가지 파일 종류를 유지한다. 기존 pack은 변환 없이
읽으며 없는 선택 필드를 생성하거나 과거 제출 사실을 추정하지 않는다. 새 확장 필드가
있는 pack은 이전 V1의 엄격한 validator에서는 읽히지 않을 수 있으므로 최신 CareerPilot로
복구한다. 원본 pack을 보관하고 현재 상태와 충돌하면 전체 덮어쓰기 대신 선택을 요청한다.

- ResumeVersion: revision/derived_from_id, summary/skills/employment/sections/assertions/artifacts,
  screening. bullet에는 bullet_key, story_ids/claim_ids, confidence/evidence_status, role_relevance,
  requirement_keys, responsibility, previous_text, used_in_round_ids를 선택적으로 기록한다.
- JobAnalysis.requirements: key/text/category/classification/source_ids/confidence/verification_question.
  W04 기존 매핑은 유지하고 W05 coverage는 DIRECT_MATCH/TRANSFERABLE/PARTIAL/GAP/UNKNOWN으로 분리한다.
- Application: screening, compensation_conversations, ats_vendor, submissions. answers는 field_key,
  type/limit/limit_unit/source/story/claim links/status/user/motivation confirmation을 추가한다.
- InterviewRound: submission_id와 resume_version_id. 실제 제출한 자료를 기준으로 준비한다.
- CareerEvidence: confidence와 EXPOSURE/CONTRIBUTOR/OWNER/LEADER/UNKNOWN 책임 경계.

제출 확인 전에는 DRAFT/USER_APPROVED 상태다. 실제 제출을 사용자가 확인하면 `submissions`에
고유 ID, 해당 opportunity의 resume_version_id, 실제 날짜, JD 내용·출처, 정확한 application
answers/cover letter를 보존한다. 정확한 hash 계산이 가능하면 resume_sha256을 기록한다.
불가능하면 null로 남기며 hash 검증을 했다고 말하지 않는다. 기록과 연결된 ResumeVersion은
수정하거나 삭제하지 않는다. 정정·재제출은 새 resume/submission ID를 만든다. 제출 날짜가
불명확하면 먼저 사실을 확인한다. 지원 단계 변경은 별도의 확인된 lifecycle event다.

내보내기/복구 validator는 hash와 회사 범위를 검사하고 현재 pack이 있는 경우 과거 제출
기록과 이력서의 정확한 내용을 비교한다. hash가 null이어도 기존 제출본 수정은 거절한다.
독립적으로 받은 pack의 null hash는 무결성의 암호학적 증거가 아니다.

DOCX/PDF는 선택적인 sidecar다. 예:
`applications/opportunity-x/resume/submitted-v1.pdf` 및 `.docx`.
canonical 상태는 여전히 `applications/opportunity-x.json` 안에 있고, 이력서 내용·QA·파일 경로·
가능한 hash가 들어간다. pack JSON만 내보냈다면 바이너리 파일까지 복구했다고 말하지 않는다.
지원 host에서는 sidecar와 submission-metadata.json을 함께 묶어 전달할 수 있다.

# G2 개발 진단: Claude 모델 식별값 누락과 재개 제한

## 확인된 사실과 분류

복원 후보 Claude `evd-07-privacy`의 첫 subject 호출은 CLI 성공 응답을 반환했다.
`turn-1.stdout.txt`의 `is_error=false`, `subtype=success`이며 실제 답변도 있다.
그러나 `modelUsage={}`, input/output/cache usage 모두 0이고 모델 식별값이 없다.
동결 엔진은 이를 `CLI default; model ID not exposed`로 기록했다. 교차 심판은
`gpt-5.6-sol`과 assertion 3개 PASS를 반환했으나, 실행기의 모델 일치 검사가
`ValueError: Observed subject/judge model differs from approved lock`으로 차단했다.

이는 **CLI 응답의 관측 정보 누락**이다. 실제 모델 변경, 네트워크 장애, 계정 한도,
과금 0원 또는 실제 토큰 사용 0을 증명하지 않는다. 현재 로그만으로 공급자 측 누락
원인은 확정할 수 없다. 엔진이 존재하는 식별값을 잘못 읽었다는 증거도 없다.
일치 검사의 거부는 정당하지만 오류 메시지는 '불일치'와 '미확인'을 구분하지 않는다.

자동 PASS를 유효한 판정으로 승격하지 않는다. `observed-result.json`의 PASS, 원문,
subject checkpoint, stderr/stdout과 ERROR ledger를 모두 보존한다. 주변 실행이 같은
모델이었다는 이유로 식별값을 대신 채우지 않는다. 다시 채점해도 subject 신원은
확인되지 않으므로 심판만 재호출하지 않는다.

## 왜 기존 --resume으로 계속하지 않았는가

`scripts/run_variant_evals.py`는 ERROR의 subject checkpoint를 복사하고 첫 미완료
시나리오부터 실행한다. 이 checkpoint에는 미확인 모델값이 이미 들어 있다.
`scripts/run_model_evals.py`는 완료된 subject를 재사용하므로 다음 재개는 같은
미확인 subject를 다시 채점한 뒤 같은 일치 검사에 실패한다. 실행기는 ERROR에서
중단하며, 뒤의 미실행 시나리오만 선택하는 옵션은 없다.

따라서 Claude를 반복 재개하거나 checkpoint를 지우지 않았다. 영향받지 않은 ChatGPT
승인 분량은 동일 지문으로 진행했다. 패키지·평가 프롬프트·시나리오·하네스 변경은 없다.

## 승인 전에 제시한 재개 도구 수정안

사용자 승인 뒤에만 다음 최소 변경을 적용할 수 있다.

1. 실행기의 모델 미확인 오류와 실제 모델 불일치를 구분하고 둘 다 차단한다.
2. 명시한 시나리오의 **미실행 건만** 선택하는 옵션을 추가한다. 완료 PASS/FAIL은
   항상 건너뛰고 기존 ERROR는 격리 보존한다. 전체 보고는 계속 INCOMPLETE로 남긴다.
3. 미확인 모델 ERROR를 자동 재채점/subject 재생성/통과 처리하지 않도록 테스트한다.
   원래 동결 C 엔진은 수정하지 않는다.

대상은 `scripts/run_variant_evals.py`와 관련 실행기 테스트다. 모든 Python 파일을
묶는 execution lock은 새 지문이 필요하다. **패키지 지문, 개발/홀드아웃 manifest,
C suite/protocol 지문은 바뀌지 않는다.** 기존 완료 판정의 canonical case key는
스크립트 해시를 포함하지 않으므로 사라지거나 재실행되지 않는다. 이전 lock/보고는
보존하고 새 lock과 연결한 감사 기록을 남겨야 한다. 변경이 모델 프롬프트/호출/채점에
영향하지 않았는지도 무호출 검증한다. 이 수정안 제시 당시에는 구현하지 않았다.

미실행 Claude 13건은 subject 16 + judge 13 = **최소 29호출**이다. 기존 미확인
1건은 이 13건과 별개이며 이 방식으로는 해결되지 않는다. 사라진 식별값을 독립적으로
확인할 자료가 없다면, 해당 건을 ERROR로 남길지 별도 subject 재시도를 승인할지
사람의 판단이 필요하다. 후자는 추가 호출이며 이번 n=1 완료 결과를 지우는 재실행으로
취급하지 않도록 원래 응답/관측 PASS/ERROR를 모두 남겨야 한다. 자동 재시도는 하지 않는다.

이 문서는 오류를 본 뒤 작성한 운영 검토이며 사전 합격 기준을 바꾸지 않는다.
후보 수정, D/F, 홀드아웃 호출, main 병합·푸시·태그·릴리스는 승인 대상에 포함하지 않는다.

## 후속 승인과 구현

사용자가 **“실행기 수정과 남은 13건 재개 승인”**을 선택했다. 미확인 ERROR의 subject
재생성은 승인에 포함되지 않는다. 진행 중인 ChatGPT 18판정을 먼저 마치고 원래 lock 검증과
원본 로그를 `checkpoint-01.json` 및 `raw-attempts-checkpoint-01.tar.gz`로 보존한 뒤 수정했다.

구현은 `--unstarted-scenario` 명시 선택이며 development 모드에서만 쓴다. 선택 목록 전체를
호출 전에 검사해 기존 ERROR가 포함되면 거부한다. 기존 PASS/FAIL은 선택돼도 재실행하지
않고, 선택 밖 ERROR는 원문 그대로 전체 보고에 포함한다. 전체 18건 분모를 줄이지 않는다.
새 ERROR도 배치를 중단하며, 식별값 누락을 실제 모델 불일치와 구분한다. 기본 재개 동작은
바꾸지 않았고 동결 C 엔진·프롬프트·패키지도 바꾸지 않았다.

미실행 13건에는 같은 플랫폼 심판 2건이 포함된다. 최소 호출은 Claude subject 16 +
Claude judge 2 + ChatGPT judge 11이다. 기존 C 평균으로 계획하면 Claude 약 536,902토큰
(20% 여유 644,283), ChatGPT 약 93,819토큰 (20% 여유 112,583)이다. 서로 다른 집계이므로
합산/비교하거나 사용량 퍼센트·청구액으로 환산하지 않는다. 추가 심판 인용 보정은 늘어날 수 있다.

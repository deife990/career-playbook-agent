# v1.2 배포 준비

배포 대상은 **1.2.0-rc.7**입니다. 사용자 요청에 따라 브라우저 검증을 제외한 범위에서
배포 준비 검사를 통과한 후보입니다. 자동 테스트 189개, 정적 검사, ChatGPT·Claude
모델 검증 각각 48/48, 설치 파일 구성과 재현 가능한 빌드를 확인했습니다.
회사 Copilot 환경에서의 실행과 브라우저 설치 검증을 통과했다고 주장하지 않습니다.

## 전달할 파일

| 서비스 | 설치 파일 | SHA-256 |
|---|---|---|
| ChatGPT | `careerpilot-chatgpt-v1.2.0-rc.7.zip` | `6cd90aa020d64e7e37cb3ee0b71f112ca939de6291cbad00b2d3a4fc0941c5fd` |
| Claude | `careerpilot-claude-v1.2.0-rc.7.zip` | `98530e295349ee4dbd9ea392ee2bd03277f1068ab9955afc4700d0836f8a27e8` |

각 ZIP을 압축 해제하거나 다시 압축하지 않고 해당 서비스에 업로드합니다.
사용자는 사용하는 서비스에 맞는 ZIP 하나만 받으면 됩니다.
업데이트 전에 기존 경력 정보를 내보내고, 업데이트 후 복원합니다.
[설치 안내](quick-start.md) · [경력 정보 복원](state-portability.md)

로컬 전달 묶음은 `dist/distribution/v1.2.0-rc.7/`에 준비합니다. 설치 ZIP 두 개,
체크섬, 배포 안내, 소스 커밋과 검증 범위를 기록한 manifest만 포함합니다.
이전 버전 ZIP, 모델 실행 로그, 개인 경력 정보는 넣지 않습니다. `dist/`는 Git에서
제외하며, GitHub의 Build install packages 작업도 최신 설치 ZIP과 체크섬만 제공합니다.

## 새 저장소 복제본에서 재현하기

Python 3.12와 `requirements-dev.txt`의 개발 도구를 설치합니다. PDF 추출 테스트에는
Poppler가 필요합니다. 이 도구들은 사용자 설치 ZIP의 의존성이 아닙니다.

```bash
python -m pip install -r requirements-dev.txt
python -m scripts.run_static_evals
python -m pytest -q
python - <<'PY'
from pathlib import Path
import shutil
version = Path('VERSION').read_text().strip()
destination = Path('dist/evals')
destination.mkdir(parents=True, exist_ok=True)
for platform in ('chatgpt', 'claude'):
    shutil.copyfile(
        Path('evals/reports') / f'{platform}-{version}.json',
        destination / f'{platform}.json',
    )
PY
python -m scripts.package_release --require-ready \
  --native-exclusion evals/browser-exclusion-1.2.0-rc.7.json
git diff --exit-code -- adapters
```

저장된 모델 검증을 새로 실행한 결과로 기록하지 않습니다. 배포 준비 검사는 현재
설치 파일·평가 시나리오의 식별값, 전체 사례, 주장별 판정을 다시 확인합니다.
파일이나 버전이 바뀌면 기존 통과 기록과 브라우저 제외 기록을 재사용할 수 없습니다.
위 두 SHA-256과 빌드 결과가 동일한지 확인합니다.

## GitHub 상태와 공개 릴리스

v1.1 완료 기준본과 v1.2 구현·검증은 별도 커밋으로 기존 작업 브랜치에 올립니다.
PR #2는 v1.1 완료와 v1.2 변경사항을 함께 설명하는 Draft로 유지합니다.
이번 작업 범위는 배포 파일 준비와 소스 커밋·푸시이며, `main` 병합·태그 생성·
GitHub Releases 게시는 별도 실행 사항입니다. 공개 다운로드는 게시 전까지 기존
v1.0 파일을 유지하고, v1.2는 작업 브랜치의 빌드 결과를 사용합니다.

기본 태그 릴리스 절차는 완전한 브라우저 검증을 요구합니다. 현재의 사용자 지정
범위로 후보를 전달할 때는 위의 명시적 제외 기록과 검증 범위를 함께 제공합니다.
정식 `1.2.0`으로 버전만 변경해 기존 rc.7 검증을 대신하지 않습니다.

[현재 후보 검증](../evals/reports/release-candidate-1.2.0-rc.7.json)
· [설치 파일 식별 기록](../evals/reports/artifact-identity-1.2.0-rc.7.json)
· [검증 제외 범위](validation-scope.md)

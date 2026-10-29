# 퇴사할 건데, 좋아해도 될까요?

LUAN(AI Career Assistant, 구 CareerPilot)의 사용법을 이야기 속에서 익히는 웹 비주얼 노벨.
현재 버전 **v0.14.1-dev** · 미배포 · UI/UX 기준 v1.1.1

```bash
python3 -m http.server 8922 --bind 127.0.0.1   # http://127.0.0.1:8922/
```

| 폴더 | 내용 |
|---|---|
| `src/content/` | 스토리 대본, 인물·배경 레지스트리(`cast.js`), 튜토리얼·요청 문구 |
| `src/engine/` | 진행·저장·저장 호환 |
| `src/tutorial/` | 튜토리얼 동작(GuidePanel, 설치 미리보기, 실습) |
| `src/ui/` | 장면 표현 계층 |
| `styles/tokens/` → `components/` → `patches/` | 디자인 토큰 → 컴포넌트 → 동결된 과거 덧칠 |
| `assets/` | 현재 쓰는 원화만 (이전 버전은 `../art-archive/`) |
| `docs/` | 모듈 안내(STORY·ART·UIUX·TUTORIAL), 원고 `docs/story/`, 이전 보고서 `docs/history/` |
| `checks/` | lint, 원고 대조, 브라우저 검사, 시각 비교(`visual/`) |

**작업 전 [AGENTS.md](AGENTS.md)를 읽는다.** 변경 기록: [CHANGELOG.md](CHANGELOG.md) · 결정: [DECISIONS.md](DECISIONS.md)

# v1.2 source decisions

Public-source research was completed on 2026-10-12 before implementation. These sources are design
references, not installed skills, dependencies or permissions. Original implementation follows the
user-supplied specification. No source code or verbatim skill body was copied.

| Primary source | Decision | Applied / excluded |
|---|---|---|
| [GitHub performance-review-writer](https://github.com/github/awesome-copilot/blob/main/skills/performance-review-writer/SKILL.md) | ADAPT | Work contribution discovery and weak-detail marking; replace direct workplace reads with bounded manual sanitized exchange. |
| [Microsoft Work IQ](https://github.com/microsoft/work-iq) | ADAPT search concepts; REJECT dependency | Source types, tenant/permission constraints and grounded retrieval inform prompts; no installation, consent or direct access. |
| [Microsoft Copilot brag-sheet](https://github.com/microsoft/copilot-brag-sheet/blob/main/skills/brag-sheet/SKILL.md) | ADAPT | Scan before drafting, group related signals, retain gaps and confirm before storage; abstract coding records into work episodes. No automatic capture. |
| [brag-skill](https://github.com/kammradt/brag-skill/blob/main/SKILL.md) | ADAPT | Aggregate optional sources and group by deliverable; no session-history collection or outgoing Slack integration. |

Optional Outlook implementations were unnecessary. Existing third-party notices remain applicable
to earlier reused material; no additional dependency or copied-license obligation is introduced here.

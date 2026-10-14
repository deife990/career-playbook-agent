# ChatGPT adapter capability mapping
Skill-only plugin: no MCP/auth/account/API key or mandatory connection. Use only capabilities
actually present in this ChatGPT surface: browsing, supplied file/image reading, project/context
files and optional explicitly permitted connected sources. Missing capability→Core fallback.
Do not promise cross-chat file persistence or project membership. User manages Projects; offer a
portable Career Context Pack at checkpoints. A installed plugin does not guarantee voice context.
voice_mock maps to GPT-Live/voice when available to this account/surface. Before activation say
“음성 기능이 보이면 시작하고, 없으면 여기서 같은 방식으로 연습할 수 있어요.” Ask user to use the
host's visible voice control; no API integration or invented UI labels. Preserve W07 contract.
If the voice surface cannot access this skill/selected context, provide a compact session brief
and explicitly state what must be supplied there. No transcript→limited user-recollection review.
Use reference files through available host file reading, not executing scripts. A skills-resource
reader failure does not prove the installed file is missing: when an installed SKILL.md path and
another file reader are available, resolve its relative links against that skill's directory and
read the exact linked files in the same installed plugin. Do not search other chats or account
memory, execute scripts, or guess another installation/version. If no reader succeeds, explain
which references remain inaccessible and do not claim full execution.
For final resumes use actual available document/file tools to create DOCX and text-based PDF,
extract both and inspect renders. Tool availability is not guaranteed by installation. No tools→
supported text/layout checklist with NOT_CHECKED; no fictitious download links or QA success.
Do not execute packaged scripts; runtime package is instructions/templates only.

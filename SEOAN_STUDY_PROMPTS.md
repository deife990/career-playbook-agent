# 서안 얼굴 비교 — 실제 생성 프롬프트

2026-10-20 · 기본 내장 image_gen 사용 · 생성 2회 · 외부 CLI/API 미사용

얼굴 선택 전 비교용 시안이다. A는 신규 생성, B는 A를 입력으로 사용한 스타일 편집이다. 결과는 프로젝트의 assets/character-studies/seoan-v01/에 복사해 보관했다. 투명 배경이나 레이어 분리를 요청하지 않았고 최종 스프라이트가 아니다. 사용자가 얼굴 방향을 고른 다음 표정 4종으로 확장한다.

## A — 섬세한 웹툰 일러스트 방향

```text
Use case: stylized-concept.
Asset type: original female character face-and-costume direction study A for a Korean office-romance web visual novel, not final sprite production.
Primary request: Draw Seoan, a very attractive 31-year-old adult Korean woman and practical theme-park operations colleague. A familiar coworker the player wants to meet again after work: composed, quietly warm, perceptive, slightly dry humor. Adult romantic appeal, elegant and approachable, never a schoolgirl.
Style A: contemporary Korean romance webtoon character illustration. Refined adult facial anatomy, softly elongated oval face, natural spacing between eyes/nose/mouth, horizontally elongated almond eyes with restrained iris size, delicate eyelids and elegant natural lashes. Warm brown eyes, a single small catchlight. Clean confident fine linework, tidy one-layer cel shadows with only very subtle soft skin accents. Clearly drawn 2D art, not photorealism or painterly portraiture. Beautiful, polished original character design.
Hair: dark chocolate collarbone-length long bob with ends slightly curved inward; natural side part, hair tucked behind one ear, one small matte-silver hoop earring visible. Healthy dark hair with a few broad highlights, no fantasy hair colors.
Clothes: warm ivory fine-knit crewneck under an unzipped dark deep-teal lightweight zip-up jacket, simple practical adult fit. No lanyard in this face comparison. No logos, no jewelry except the small hoop.
Expression: a relaxed attentive gaze directed at viewer, a very slight closed-mouth smile; subtle warmth in the eyes, not flirtatious wink or exaggerated blush.
Composition/framing: a single character, upper waist up, near-frontal three-quarter view, shoulders turned slightly, head upright; face large enough to assess eyelashes and mouth. Both shoulders fully visible, hands below crop. Plain warm cream background with no scenery, graphics, text or labels. Square canvas. Leave comfortable space above hair and on each side.
Lighting: soft warm cafe light from front-left, gentle form shadows, consistent accurate ivory and deep teal clothing.
Constraints: an independently designed fictional adult, no resemblance to celebrities or specific existing characters. Natural adult proportions, no glamour cleavage or pinup pose, no chibi, no enormous eyes, no teen round baby face, no 3D, no photo, no watermark. Produce one image only.
```

## B — 웹툰·애니 혼합 방향

입력 이미지: `assets/character-studies/seoan-v01/seoan-a-webtoon-detail.png`.

```text
Use case: style-transfer.
Asset type: character direction study B for an original Korean office-romance web visual novel.
Input image 1 is the EDIT TARGET and identity/composition reference: Seoan, a very attractive 31-year-old adult Korean woman, chocolate collarbone-length bob, small silver hoop earring, ivory knit and dark teal zip jacket.
Primary request: Re-illustrate this exact character and portrait in a clearer 2D Korean-webtoon / Japanese-anime hybrid style that is easier to read in a visual-novel dialogue scene. This must be a clearly visible style alternative to the detailed source, not merely a color filter.
Keep: the same adult identity, mature softly elongated facial silhouette and nose-to-mouth distance, haircut and hair part, visible earring, gaze toward viewer, subtle closed-mouth smile, head angle, shoulder angle, same portrait crop and composition, jacket silhouette, neckline and clothing colors, plain warm cream background and same warm lighting.
Change only illustration treatment and restrained eye stylization:
- cleaner medium-fine contour lines with purposeful line-weight changes;
- visibly flatter 2D cel shading, with one clean shadow tone per skin/hair/clothing surface;
- warm brown anime-influenced eyes and irises slightly larger and clearer than the source, still horizontally elongated and adult, modest restrained eyelashes and one small catchlight;
- simplify nose and lips into elegant drawn shapes, reduce glossy lips, no painted skin texture;
- hair drawn as coherent dark-chocolate shapes with broad clean highlights rather than hundreds of individual strands;
- simplify jacket folds and knit texture, keep clothing shape and practical design unchanged.
Mood: beautiful approachable adult coworker, quiet warmth and dry humor, an attractive romantic lead, not a teen idol, not a fashion advertisement.
Constraints: single character, no text, no labels, no collage, no UI, no scenery, no new accessories, no lanyard. No chibi, no baby face, no large round childlike eyes, no school uniform, no exaggerated blush, no pinup pose, no 3D, no photography, no watercolor, no watermark. Same canvas proportions as input. One image only.
```

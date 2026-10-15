# E-stage variant scenarios (draft, not part of C)

These files are **not** in `evals/scenarios/`, so they do not enter the frozen C suite
fingerprint and cannot invalidate the C resume record. They stay drafts until E starts; before
any E model call they are frozen with their own variant-suite fingerprint, tiers and repeat
counts, then run on both the unchanged rc.7 baseline packages and the E candidate. The frozen C
scenarios are never edited.

Each variant changes the occupation, wording, numbers and (for debrief) which fields are given,
so a fix that merely memorizes the C wording cannot pass. They test two general principles:

1. **Scope preservation** - quality or method qualifiers (structured, data-driven, accuracy,
   careful, collaborative) and added actions or outcomes are not attached to what the user said
   they did, in positioning or resume wording.
2. **Provided fields only** - fields the user did not give (round number, speaker, date, result)
   are Unknown or asked once, never marked confirmed.

Variants `var-debrief-speaker-*` state the speaker explicitly, separating the disputed judge
attribution from the unsupported round-number finding recorded for `debrief-first` run 3.

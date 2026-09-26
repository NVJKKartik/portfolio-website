# Content inventory (internal)

Built from three inputs: the original portfolio (`../src`, live at nvjkkartik.netlify.app), the first redesign (this `site/`), and public sources. Verification detail lives here and in `SOURCES.md`, not on the site.

## Background and journey

| Item                                                                                | Where it came from                                                                                                  | Status                                                                                                             | On the site                            |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| Data Science & AI, IIIT Dharwad, 2021 – 2025                                        | old portfolio ("pursuing a degree"); years from Kartik, 2026-09-26                                                  | Self-reported. Years only, so the chronology wall fades its end across 2025                                        | Journey (first stop), About, back wall |
| IIT Bombay, Research Associate, Dept of Educational Technology, May 2023 – Aug 2024 | old portfolio `Jobs/IITB.js`                                                                                        | Self-reported; the TALE/T4E papers and IITB awards page corroborate the affiliation                                | Journey                                |
| AffectBots, multimodal tutoring with real-time emotion recognition (88%)            | old portfolio                                                                                                       | Self-reported. The number stays off the site                                                                       | Journey (qualitative)                  |
| Speaker diarization with pyannote + Whisper (TALE 2024, Best Student Paper)         | old portfolio + IEEE/TALE                                                                                           | Verified (paper and award). Old "65% on 200 hours" conflicts with the paper's 137 recordings, so it's dropped      | Research, Journey                      |
| CRFs for SSMR triggers (T4E)                                                        | old portfolio + Springer/Crossref                                                                                   | Paper verified. Method is self-reported (abstract unreachable)                                                     | Research, Journey                      |
| Vocab.AI, Full Stack Developer Intern, Aug 2023 – May 2024                          | old portfolio `Jobs/vocab.js`                                                                                       | Self-reported. "+10% engagement" and "81% accuracy" kept off the site                                              | Journey                                |
| NIT Puducherry, MLOps Intern, Dept of CSE, Dec 2023 – Jan 2024                      | old portfolio `Jobs/NITPY.js`                                                                                       | Self-reported. 77% / 86% / 95% figures shown on the case study only                                                | Journey, Work (lung nodules)           |
| E2MIP (Jun 2023 post stub)                                                          | old `src/posts/e2mip.mdx`                                                                                           | **Dropped.** Dated before the NIT-Py role and no participation record found                                        | —                                      |
| IIT Madras, RBCDSAI Research Intern, "June 2024 – Present"                          | old portfolio `Jobs/IITM.js`                                                                                        | **Stale "Present"** corrected: three months from Jun 2024 (confirmed by Kartik). "Preliminary results" not claimed | Journey                                |
| Future AGI, Dec 2024 – now                                                          | patent assignee, traceAI org, Luma host, repo activity from Apr 2025; start and role change from Kartik, 2026-09-26 | Verified employer. Intern from Dec 2024, full-time from Jul 2025; now senior engineer and tech lead                | Journey, Work, About, back wall        |

## Projects

| Project                                                                                                     | Evidence                                       | Kartik's role (from commits)                         | Notes                                                       |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| traceAI                                                                                                     | GitHub, v1.0.0 release                         | Top committer (215); published v1.0.0                |                                                             |
| AgentCompass                                                                                                | arXiv 2509.14647                               | First author                                         | Preprint. Demo is illustrative                              |
| Nexus (Hackfest '24)                                                                                        | `hackfest-dev/HF24-Nexus`                      | Top committer (24)                                   | Old site called it "Emotional Monitoring of Crypto Traders" |
| Hivemind                                                                                                    | `NVJKKartik/Hivemind`                          | Top committer (66)                                   | Old site mislabelled its screenshot as the DRS project      |
| Alumni Connect                                                                                              | `NVJKKartik/Alumni_connect`                    | Contributor (7; Ashxsh1 = Aarsh Desai leads with 18) | Old site said "Designed a Flutter app". Kept to "worked on" |
| Centio.AI / BrainBox                                                                                        | `VinayakRai5/Centio.AI`, `NVJKKartik/Brainbox` | Contributor                                          |                                                             |
| Emotion detector for online classes (DRS hackathon)                                                         | `PlatJack/DRS-Hackathon-2`                     | Contributor (3)                                      | "First place, 48 hours" is self-reported                    |
| Lung nodule analysis                                                                                        | old portfolio                                  | —                                                    | No repo. Shown with a typographic plate                     |
| llama2-qlora-hi-7b, Emotion–Cause Pairs, AI Task Allocation, Photo-Metadata, Quotation-Generator, BlackJack | HF / GitHub                                    | Owner                                                | Experiments grid                                            |
| Old template projects (Slice, Smart Sparrow, Volkihar, Gamestack, stock dashboard)                          | Hamish Williams / Mayank Jain template         | **Not Kartik's**                                     | Excluded                                                    |

## Contribution wording

Contributor rankings ("top committer") are gone from the site. Nexus and Hivemind credit now lists what Kartik's commit messages show he built; traceAI credit is the v1.0.0 release he published and the npm packages he maintains; Alumni Connect credits Aarsh Desai as lead. PlatJack and Ashxsh1 are both Aarsh Desai, and the papers' "Vinayak" is Vinayak Rai (from Kartik, 2026-09-26); the site uses the names, sources keep the handles.

## Research, awards, patent

Unchanged from `SOURCES.md`: AgentCompass (preprint), TALE 2024 Best Student Paper (co-author, 2nd of 7), T4E chapter (first author), US 12,608,610 B1 (co-inventor, 4th of 4).

## Writing, talks, community

- 28 posts snapshotted (all DEV + Medium's latest 10). Canonical links point to the originals.
- Harness Engineering, Bengaluru Tech Week, 6 Sep 2026: listed as a **host**.
- Profiles: GitHub, LinkedIn (unreadable to tools), DEV, Medium, Hugging Face, npm, PyPI (bot-walled).

## Media used

- Real: AgentCompass paper page 1, taxonomy figure, trace UI capture, recommendation panel (all from arXiv 2509.14647); patent drawing D00000 (USPTO, public domain); project screenshots from the old repo (`pro1`–`pro5`); traceAI README banner.
- Drawn: one plate per easel without real material (`scripts/plates`), labelled as illustration on /receipts/.
- Redesigned: interface studies for Nexus, Centio.AI and Alumni Connect (2026, sample data), each shown beside its original.
- Rendered: the hall posters, OG image and study stills, from the live site by `scripts/brand/make-brand.mjs`.
- Future AGI work from public PRs (see `content/sources.ts`, pr* entries); commit authorship checked per PR.
- Removed at Kartik's request: every personal photo.

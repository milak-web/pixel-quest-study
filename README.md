# Pixel Quest | رحلة البكسل

**Play on phone or computer: [https://milak-web.github.io/pixel-quest-study/](https://milak-web.github.io/pixel-quest-study/)**

No sign-in is required. This repository and its GitHub Pages website are public.

Arabic study library with independent subject sections and subject-specific interactive exercises.

### Information security and cryptography

- 32 levels, 96 concepts, 192 question variants and a final 32-question challenge.
- Security decisions, malware classification, identity roles, incident ordering and signature scenarios.
- Caesar, Playfair and Hill workbenches with editable inputs and visible calculation steps, plus an educational MD5 experiment.
- [Free practice](https://milak-web.github.io/pixel-quest-study/information-security/practice.html) is available without completing levels.
- Based on five supplied slide decks (169 slides) and two Word documents. The organized reference and source map identify coverage and explain source contradictions. Original course files are not included.

### Digital image processing

Based on 45 supplied course photographs and a corrected study guide.

- 16 sequential levels and 48 small concepts.
- Interactive pixel, storage, wave, zoom, convolution, logic, geometry and filter labs.
- 96 question variants, explanations, mistake review and a final 16-question challenge.
- Optional sound, keyboard input, Arabic/English numerals, and responsive phone layout.
- Progress is stored locally in each browser. Phone and computer progress are separate.

## Run locally

Open `docs/index.html` in a modern browser, or serve `docs` over HTTP. Each course is self-contained and works offline. Companion image-processing PDFs are in `docs/assets`; the security reference and source map are in `docs/information-security`. Each subject has its own save key. The image-processing save key is preserved from the original single-course site.

## Development

Edit `src/`, then run `python build.py`. Run `node tests.cjs`, `node tests-security.cjs` and `node tests-app.cjs` for content, grading, cipher calculations and full application progression checks. No dependency installation is required.

## GitHub Pages

The publishing source is the `main` branch's `/docs` directory. `.nojekyll` disables Jekyll processing. No API tokens or credentials belong in this repository.

Question results measure practice in the game, not predicted examination performance. Original-note contradictions are explained in the lessons and detailed guide.

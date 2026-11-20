# Pixel Quest | رحلة البكسل

**Play on phone or computer: [https://milak-web.github.io/pixel-quest-study/](https://milak-web.github.io/pixel-quest-study/)**

No sign-in is required. This repository and its GitHub Pages website are public.

Arabic study game for digital image processing, based on 45 supplied course photographs and a corrected study guide.

- 16 sequential levels and 48 small concepts.
- Interactive pixel, storage, wave, zoom, convolution, logic, geometry and filter labs.
- 96 question variants, explanations, mistake review and a final 16-question challenge.
- Optional sound, keyboard input, Arabic/English numerals, and responsive phone layout.
- Progress is stored locally in each browser. Phone and computer progress are separate.

## Run locally

Open `docs/index.html` in a modern browser, or serve `docs` over HTTP. The game is self-contained and works offline. Companion reference PDFs are in `docs/assets`.

## Development

Edit `src/`, then run `python build.py`. Run `node tests.cjs` for content, grading, progression and calculation checks. No dependency installation is required.

## GitHub Pages

The publishing source is the `main` branch's `/docs` directory. `.nojekyll` disables Jekyll processing. No API tokens or credentials belong in this repository.

Question results measure practice in the game, not predicted examination performance. Original-note contradictions are explained in the lessons and detailed guide.

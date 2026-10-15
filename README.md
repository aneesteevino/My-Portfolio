# Muhammad Anees · AI Engineer

A light, résumé-grounded portfolio built with Next.js 15, React 19, TypeScript,
Tailwind CSS 4, and Lenis. All fonts, media, logos, and the downloadable résumé
are served locally. There are no runtime image CDNs, analytics scripts, WebGL,
GSAP, or page-transition libraries.

## Run

Use Node.js 22 LTS or newer:

```sh
npm install
npm run dev
```

Open http://localhost:3000. For the production server:

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

Assets are included; Python is needed only to rebuild them. `package-lock.json`
pins the installed dependency versions. Use `npm ci` in CI.

## Content and sources

All biography, education, skills, experience, project descriptions, numbers, and
certification text live in `src/lib/data.ts`. The résumé summary is verbatim,
with PDF line wraps normalized to spaces. `COPY` contains the UI wording requested
in the design brief. Components do not invent personal claims.

The original résumé is copied byte-for-byte to `public/resume.pdf`. Its embedded
links contain GitHub, LinkedIn, and email only. Project repository links were
verified against the public account under the separate authorization to review
GitHub. See `docs/project-review.md` for evidence and the limits of that review.

No personal location, ID number, department, certification URL, standalone
achievement, coding rank, testimonial, or unsupported social profile is included.
The ID card shows the graduation year as **Graduation**, rather than claiming an
official document expiry. Decorative barcode bars are not an invented ID number.
Illustrative project interfaces are explicitly labelled and contain no fabricated
customer data, analytics, scores, or screenshots.

## Sections

| Order | Section | Component and interaction |
| --- | --- | --- |
| Hero | AI Engineer | Responsive outlined name and résumé-based introduction |
| 01 | About | Accessible flipping ID card, damped pointer-driven pendulum, quick facts |
| 02 | Skills | Compact animated capability deck with family tabs, logos, and project evidence |
| 03 | Work | Six résumé projects, expanding horizontal / mobile vertical accordion, CSS illustrations |
| 04 | Certifications | Google / Coursera certification, ink-fill hover and keyboard focus |
| 05 | Experience | Chronological education and employment path, scroll-drawn spine |
| 06 | Contact | Email copy with live status, contact links, letter animation, footer |
| Omitted | Achievements | Résumé contains no standalone achievements. Array remains empty and nav link is absent. |

An unused `Achievements.tsx` provides the sticky gallery/count-up behavior for
future **verified** data. It is not rendered and no achievement has been invented.

## Robo Cat chat — 15 October 2026

A small floating robot-cat button opens an accessible chat. A deterministic intent
and context layer retrieves every relevant fact from `src/lib/data.ts`, including
compound requests and project follow-ups. Gemini 3.5 Flash Lite may phrase that
structured context more naturally; it never receives permission to add facts.
When Gemini fails, the interface identifies the response as a verified local
fallback rather than presenting it as provider output. The API applies a basic
per-IP rate limit and keeps the provider key on the server. Conversation state is
kept in session storage so closing and reopening the dialog preserves the current
page-session chat; **Clear Chat** explicitly removes it. Portfolio, comparison,
hiring, project-fit, and business qualification questions receive evidence-backed
answers. General knowledge, news, weather, politics, and sports are declined.
Business answers separate verified evidence from proposed scope, discovery needs,
risks, and unavailable timeline or budget facts.

For local Gemini responses, copy `.env.example` to `.env.local` and set:

```sh
GOOGLE_GENERATIVE_AI_API_KEY=your_server_only_key
```

Never prefix the key with `NEXT_PUBLIC_`. Without it, the same interface uses the
local verified answers. The native dialog supports Escape, keyboard focus
containment, focus restoration, an auto-growing composer, Enter/Shift+Enter,
Stop and Retry controls, guarded auto-scroll, and a responsive bottom-sheet layout.

The large hero pet is removed and the full outlined name fits inside mobile
viewports. The ID card uses the supplied `public/portrait-card.png` photo with a
soft black shadow.
Archived video assets and their rebuild script are retained but never loaded by
the page.

## Rebuild the archived hero media

Put the original source video at `intro.mp4`. Source video and original résumé
are ignored by Git to avoid duplicating the published derivatives.

```sh
python -m pip install -r scripts/requirements.txt
python scripts/build-hero-assets.py intro.mp4 --crop 576:720:356:0 --portrait-crop 296:370:500:0
```

The supplied video is 1280×720, 24 fps, 10 seconds. The manually inspected crop
keeps the head and shoes visible, centres the subject, and scales to 768×960.
If `--crop` is omitted, foreground occupancy is estimated from seven frames with
NumPy against the expected plain light backdrop. Uncertain detection stops with
an actionable crop request. Crop coordinates are `width:height:x:y`. Never use
the example crop for another source without inspection.

Pipeline:

1. Decode sample frames and select the sharpest portrait candidate.
2. Crop, scale and apply `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98`.
3. Begin at source time 0.5 s. Play through the body; cross-fade source 9.5–10 s
   into source 0–0.5 s with `xfade`. The resulting 9.5-second loop ends where it
   begins in source time.
4. Decode 48 kHz stereo PCM. NumPy performs the identical overlap on audio,
   sample-aligned with the picture. There is no `acrossfade`, time stretching,
   or retiming. A missing audio stream is an error rather than a silent substitute.
5. Encode H.264 CRF 24, slow, yuv420p, AAC 96 kbps, faststart; encode VP9 CRF 36
   with Opus 80 kbps. Export `portrait-bust.webp`, hero poster, `og.jpg`, and a
   small `build-report.json` with crop, duration, and boundary measurements.

ffmpeg can be supplied using `--ffmpeg`, installed on PATH, or resolved from
`imageio-ffmpeg`. Test another source's loop both visually and audibly; a fade
removes a hard cut, but incompatible poses can still produce visible overlap.

## Fonts and logo credits

The self-hosted fonts are Inter Tight Variable, Instrument Serif regular/italic,
and JetBrains Mono Variable. Each is distributed under SIL Open Font License 1.1;
licences are included beside the fonts in `src/fonts/`.

Brand SVGs are original Devicon variants (MIT; `public/logos/LICENSE-devicon.txt`)
and Simple Icons paths (CC0; `public/logos/LICENSE-simple-icons.txt`). Simple Icons
receive their official brand fill colours. OpenAI and Groq use Lobe Icons SVGs
under MIT (`LICENSE-lobe-icons.txt`). `public/logos/sources.json` records
the upstream URL of every copied logo. Trademarks remain the property of their
owners; inclusion describes the technical stack and does not imply endorsement.
Unavailable logos and conceptual skills use original thin-line, labelled glyphs,
not counterfeit brand marks. UI illustrations and the favicon are original SVG/CSS.

To refresh local assets (requires internet only at build time):

```sh
python scripts/fetch-static-assets.py
```

The original `Resume.pdf` must be present for this helper's final copy step.

## Accessibility and motion

Semantic sections, one H1, visible keyboard focus, skip link, native links and
buttons, dialog focus containment, Escape-to-close, body scroll locking, and
screen-reader copy feedback are implemented. Skill inspector responds to focus;
the ID card supports Enter/Space and tap. Content remains visible with JavaScript
disabled. IntersectionObserver reveal transitions run once. `prefers-reduced-motion`
disables Lenis and decorative CSS/rAF movement, avoids sticky horizontal motion,
and disables decorative transitions. No custom cursor is used.

Component styles live in `<style>` elements. Shared classes use Tailwind's
`@layer components`; base link and button resets live in `@layer base`.

## Verification

```sh
npx playwright install chromium
npm run build
npm run test:ui
```

For an existing Chromium installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to
its absolute executable path. Tests cover 360, 390, 1440, and 1920 px widths;
navigation; all skill families; mouse, touch, and keyboard project activation;
clipboard success/failure; the PDF response signature; chat input and persistence;
Stop and Retry; compound/business/comparison/unknown/injection and multi-turn chat
scenarios; overlay stacking; reduced motion; runtime errors; and axe A/AA checks.
Screenshots and JSON results go to `artifacts/`.

```sh
npx lighthouse http://localhost:3000 --chrome-flags="--headless" --only-categories=performance,accessibility --output=html --output-path=artifacts/lighthouse.html
```

Lighthouse needs a running production server. Audit results and review limits
are recorded in `docs/verification.md`; do not interpret an unrun audit as passed.

## GitHub and Vercel

Import this repository into Vercel as a Next.js project, with the workspace root
as the project root, and use the default `npm run build` command. Add
`GOOGLE_GENERATIVE_AI_API_KEY` as a sensitive, server-only environment variable
to enable Gemini phrasing. The local fallback needs no secret. Set
`NEXT_PUBLIC_SITE_URL` if using a custom domain; otherwise Vercel's production
domain supplies metadataBase automatically.
GitHub push and Vercel deployment need the corresponding authenticated accounts.
No remote deployment or repository creation is claimed unless a verified URL
appears in the delivery notes.

`public/resume.pdf` is the single résumé download and chatbot source. Keep ignore
patterns case-safe: an unanchored `Resume.pdf` entry in `.vercelignore` excludes
the lowercase public asset on Vercel's Windows CLI path matching and causes a
production 404. The repository intentionally does not contain that pattern.

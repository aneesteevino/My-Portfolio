# Verification — 14 October 2026

- Production build passes, including lint and TypeScript checks. First-load JS: 124 KB.
- Five Playwright tests pass: responsive layout/assets/console, pet interaction,
  menu and ID keyboard behavior, skills/projects/contact/PDF, reduced motion and axe.
- No horizontal overflow at 360, 390, 1440 and 1920 px. Screenshots saved at
  artifacts/portfolio-1440x900.png and artifacts/portfolio-390x844.png.
- Local production Lighthouse mobile: Performance 94, Accessibility 100;
  FCP 1.7 s, LCP 2.8 s, TBT 100 ms, CLS 0.001. No run warnings.
- Production dependency audit: zero vulnerabilities after PostCSS 8.5.29 override.
  Development-only lint/audit tool dependencies still have advisories.
- Hero video removed from rendered page; grayscale CSS 3D robot cat added.
  Keyboard/click/touch activation, pause control and reduced motion supported.
- ID portrait uses the user's supplied PNG unchanged.
- Vercel deployment dpl_ABUPnDFEdMyYi4jRY2APxSG8Swq9 built and promoted.
  Public alias returned HTTP 200 with pet and new photo present, no video element:
  https://muhammad-anees-portfolio-ghulam-abbas-projects-c760340a.vercel.app
- Former video assets and rebuild script are archived in source but not loaded.
  Earlier caption limitation no longer applies to the rendered site.
- Repository showcases are not represented as certified working live demos;
  see project-review.md for individual limitations.

## Small Robo Cat chat update — 14 October 2026

Supersedes the large pet described above. Hero now fits the entire outlined name
at 360/390/1440/1920 px. A small fixed mascot opens a lazy-loaded native dialog.
The chatbot extracts answers from portfolio data locally, links sources, supports
project follow-ups and declines unsupported facts. No LLM, API key, request to an
inference service, or persisted chat history. Not a general-purpose AI model.

Six tests pass, including chat-open axe, unknown facts, follow-ups, mobile layout,
focus restoration and the existing portfolio behavior. Build passes, first-load
JS 125 KB. Latest mobile Lighthouse: Performance 94, Accessibility 100; FCP 1.7 s,
LCP 2.8 s, TBT 120 ms, CLS 0.001, speed index 2.7 s, no warnings.

Deployment dpl_J7QgxpKdb2t8hCk4tj2dhspnUTqQ promoted. Public-site browser check
confirmed chat answers and zero mobile overflow. Screenshots: chat-mobile.png
and hero-chat-mobile.png in local artifacts/.

## Gemini chat and portrait update — 14 October 2026

- The hero ghost name now reads **MUHAMMAD ANEES** and remains inside the viewport
  at 360, 390, 1440 and 1920 px.
- The ID card uses the user's latest supplied portrait byte-for-byte, with a soft
  black CSS shadow around its frame.
- Robo Cat floats and greets visitors. Its native dialog animates open, messages
  rise in, three dots show while waiting, and streamed text has a cursor. At
  600 px and below it becomes an 88dvh bottom sheet with a fixed composer and
  independently scrolling conversation and suggestion rows.
- The server route selects an answer with the local verified-fact matcher before
  Gemini 2.5 Flash Lite may rephrase it. Unsupported questions and provider
  failures return the local response. The provider credential is server-only.
- Seven Playwright tests pass. They cover all prior behavior plus the full hero
  name, 360 px dialog bounds, streaming feedback, fallback answers, reduced
  motion, no horizontal overflow, and axe WCAG A/AA checks.
- The production build, lint and TypeScript checks pass. First-load JavaScript is
  125 kB. Mobile chat visual review is saved as
  `artifacts/chat-mobile-390x844.png`.

## Capability deck and intent update — 15 October 2026

- Replaced the long periodic grid with a compact capability deck. Seven horizontal
  family tabs reveal only the selected discipline; logo chips animate into a
  responsive two/three-column field with project evidence in a concise inspector.
- Project panels now toggle closed from their spine control. Desktop panels also
  expose a visible, labelled close button inside the expanded view.
- Robo Cat now answers hiring, business-value, product-fit, and contribution
  questions from verified skills, experience, and projects. It provides contextual
  evidence for commerce/search, support, recruitment, legal, and travel use cases,
  and explicitly identifies unsupported industry experience.
- Weather, politics, sports, market prices, news, and other general-knowledge
  prompts are declined. Private and unsupported personal questions remain blocked.
- Seven Playwright tests pass, including 360–1920 px overflow checks, WCAG A/AA,
  capability switching, project closing, business answers, and unrelated-query
  refusal. Build passes at 126 kB first-load JavaScript.

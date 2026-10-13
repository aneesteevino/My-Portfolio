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

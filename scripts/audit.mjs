import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const chrome = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const preset = process.argv.includes("--desktop") ? "desktop" : "mobile";
fs.mkdirSync("artifacts", { recursive: true });
const args = [
  "node_modules/lighthouse/cli/index.js",
  "http://localhost:3000",
  "--chrome-flags=--headless --no-sandbox",
  "--only-categories=performance,accessibility",
  "--output=json",
  "--output=html",
  `--output-path=artifacts/lighthouse-${preset}`,
  "--quiet",
];
if (chrome) args.push(`--chrome-path=${chrome}`);
if (preset === "desktop") args.push("--preset=desktop");
const result = spawn(process.execPath, args, { stdio: "inherit" });
result.on("exit", (code) => {
  if (code) {
    process.exitCode = code;
    return;
  }
  const report = JSON.parse(
    fs.readFileSync(
      path.join("artifacts", `lighthouse-${preset}.report.json`),
      "utf8",
    ),
  );
  console.log(
    JSON.stringify(
      {
        preset,
        scores: Object.fromEntries(
          Object.entries(report.categories).map(([k, v]) => [
            k,
            Math.round(v.score * 100),
          ]),
        ),
        metrics: Object.fromEntries(
          [
            "first-contentful-paint",
            "largest-contentful-paint",
            "total-blocking-time",
            "cumulative-layout-shift",
            "speed-index",
          ].map((k) => [k, report.audits[k].displayValue]),
        ),
        warnings: report.runWarnings,
      },
      null,
      2,
    ),
  );
});

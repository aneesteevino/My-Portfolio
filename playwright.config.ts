import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
      args: ["--autoplay-policy=user-gesture-required"],
    },
  },
  reporter: [
    ["list"],
    ["json", { outputFile: "artifacts/playwright-results.json" }],
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000,
  },
});

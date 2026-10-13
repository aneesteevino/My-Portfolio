import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

test("responsive layout, assets, and console across required widths", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await mkdir("artifacts", { recursive: true });
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
    [360, 800],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(width);
    for (const id of [
      "about",
      "skills",
      "work",
      "certifications",
      "experience",
      "contact",
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBe(width);
    }
    const broken = await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs
          .filter(
            (i) =>
              (i as HTMLImageElement).complete &&
              !(i as HTMLImageElement).naturalWidth,
          )
          .map((i) => (i as HTMLImageElement).src),
      );
    expect(broken).toEqual([]);
    await page.evaluate(() => {
      document
        .querySelectorAll(".rv,.rv-mask")
        .forEach((e) => e.classList.add("is-in"));
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: `artifacts/portfolio-${width}x${height}.png`,
        fullPage: true,
      });
  }
  expect(errors).toEqual([]);
});

test("pet responds to keyboard and touch, with no video", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  const pet = page.getByRole("button", { name: "Pet the little robot cat" });
  await pet.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".pet-caption [role=status]")).toHaveText("Hello, friend.");
  await page.getByRole("button", { name: "Pause pet animation" }).click();
  await expect(page.locator(".pet-stage")).toHaveClass(/pet-paused/);
  await page.setViewportSize({width:390,height:844});
  await pet.click();
  await expect(page.locator(".pet-stage")).toHaveClass(/pet-happy/);
  await expect(page.locator("img[src=\"/portrait-card.png\"]")).toHaveCount(1);
});

test("mobile menu traps focus, closes with Escape, and ID card supports keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("#mobile-navigation a").last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  const card = page.getByRole("button", { name: /Flip identification card/ });
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(card).toHaveAttribute("aria-pressed", "false");
});

test("skills filtering, accordion, contact copy, and résumé download", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Languages", exact: true }).click();
  await expect(page.locator(".element.dimmed")).not.toHaveCount(0);
  await page.getByRole("button", { name: /Ts TypeScript Languages/ }).focus();
  await expect(page.locator(".skill-inspector h3")).toHaveText("TypeScript");
  const project = page.locator(".project-spine").nth(2);
  await project.focus();
  await expect(project).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#project-travel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await page.getByRole("button", { name: "Copy", exact: true }).click();
  await expect(page.locator("#contact").getByRole("status")).toHaveText("Copied ✓");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "aneeskhanteevino12@gmail.com",
  );
  const response = await page.request.get("/resume.pdf");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect(await page.locator("#achievements").count()).toBe(0);
});

test("reduced motion and accessibility", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(1200);
  expect(await page.locator(".pet-model").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  for (const id of ["about", "skills", "work", "contact"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  }
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

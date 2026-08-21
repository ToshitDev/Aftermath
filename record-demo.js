const { chromium } = require('playwright');

async function safeClick(page, textPattern, waitAfter = 1500) {
  try {
    const el = page.getByText(textPattern, { exact: false }).first();
    if (await el.count() > 0) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await el.click();
      await page.waitForTimeout(waitAfter);
    }
  } catch (e) {
    console.log(`Skipped click: ${textPattern}`);
  }
}

async function safeScrollTo(page, textPattern, pause = 2000) {
  try {
    const el = page.getByText(textPattern, { exact: false }).first();
    if (await el.count() > 0) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(pause);
    }
  } catch (e) {
    console.log(`Could not scroll to: ${textPattern}`);
  }
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { dir: './demo-video', size: { width: 1280, height: 800 } },
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  await page.goto('https://aftermath-seven.vercel.app');
  await page.waitForTimeout(2500);
  await safeScrollTo(page, 'Your situation', 2000);

  await safeClick(page, /try an example scenario/i, 3000);

  await safeScrollTo(page, 'Tuition Refund', 2200);
  await safeClick(page, /see details/i, 1500);
  await safeScrollTo(page, 'Financial Aid Risk', 2200);
  await safeScrollTo(page, 'Transcript Impact', 1800);
  await safeScrollTo(page, 'Future Aid Eligibility', 1800);
  await safeScrollTo(page, 'Scholarship Impact', 1800);
  await safeScrollTo(page, 'Health Insurance', 1800);
  await safeScrollTo(page, 'Coming Back Later', 1800);

  await safeScrollTo(page, 'Who Reviews This', 2000);
  try {
    const dropdown = page.locator('select').first();
    if (await dropdown.count() > 0) {
      await dropdown.click();
      await page.waitForTimeout(1200);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(800);
    }
  } catch (e) {}

  await safeScrollTo(page, 'Next Steps', 2200);
  try {
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      await checkbox.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {}

  await safeScrollTo(page, 'Before You Decide', 2500);
  await safeScrollTo(page, 'GMU CAPS', 2000);

  await page.waitForTimeout(1500);
  await context.close();
  await browser.close();
  console.log('Video saved in ./demo-video');
})();

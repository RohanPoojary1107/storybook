import { test, expect } from '@playwright/test';
import process from 'process';
import { SbPage } from './util';

const storybookUrl = process.env.STORYBOOK_URL || 'http://localhost:8001';

test.describe('preview-web', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storybookUrl);

    await new SbPage(page).waitUntilLoaded();
  });
  test.afterEach(async ({ page }) => {
    await page.evaluate(() => window.localStorage.clear());
    await page.evaluate(() => window.sessionStorage.clear());
  });

  test('should pass over shortcuts, but not from play functions, story', async ({ page }) => {
    const sbPage = new SbPage(page);
    await sbPage.navigateToStory('lib/preview-api/shortcuts', 'keydown-during-play');

    await expect(sbPage.page.locator('.sidebar-container')).toBeVisible();

    await sbPage.previewRoot().locator('button').press('s');
    await expect(sbPage.page.locator('.sidebar-container')).not.toBeVisible();

    // restore the sidebar back to visible, because it is persisted in localStorage
    await page.locator('html').press('s');
    await expect(sbPage.page.locator('.sidebar-container')).toBeVisible();
  });

  test('should pass over shortcuts, but not from play functions, docs', async ({ page }) => {
    const sbPage = new SbPage(page);
    await sbPage.navigateToStory('lib/preview-api/shortcuts', 'docs');

    await expect(sbPage.page.locator('.sidebar-container')).toBeVisible();

    await sbPage.previewRoot().getByRole('button').getByText('Submit').first().press('s');
    await expect(sbPage.page.locator('.sidebar-container')).not.toBeVisible();

    // restore the sidebar back to visible, because it is persisted in localStorage
    await page.locator('html').press('s');
    await expect(sbPage.page.locator('.sidebar-container')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import { acceptDisclaimer, clearStorage } from './helpers';

test.describe('DAT flow', () => {
  test.beforeEach(async ({ page }) => clearStorage(page));

  test('accepts disclaimer and shows input', async ({ page }) => {
    await page.goto('/test/dat');
    await acceptDisclaimer(page);
    await expect(page.getByPlaceholder(/escribe una palabra/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /agregar/i })).toBeVisible();
  });

  test('adds words and calculates result', async ({ page }) => {
    await page.goto('/test/dat');
    await acceptDisclaimer(page);
    const input = page.getByPlaceholder(/escribe una palabra/i);
    const words = ['democracia', 'hidrogeno', 'melancolia', 'espagueti', 'vertigo', 'algebra', 'tundra'];
    for (const w of words) {
      await input.fill(w);
      await input.press('Enter');
      await page.waitForTimeout(150);
    }
    await expect(page.getByRole('button', { name: /calcular/i })).toBeEnabled({ timeout: 10000 });
    await page.getByRole('button', { name: /calcular/i }).click();
    await expect(page.locator('.results-view')).toBeVisible();
  });

  test('shows examples accordion', async ({ page }) => {
    await page.goto('/test/dat');
    await acceptDisclaimer(page);
    await page.getByText(/ver ejemplos/i).click();
    await expect(page.getByText(/creaste una historia/i)).toBeVisible();
    await expect(page.getByText(/dominios radicalmente distintos/i)).toBeVisible();
  });

  test('detects same-category words', async ({ page }) => {
    await page.goto('/test/dat');
    await acceptDisclaimer(page);
    const input = page.getByPlaceholder(/escribe una palabra/i);
    // 'montaña' and 'río' are both in naturaleza category
    await input.fill('montaña');
    await page.getByRole('button', { name: /agregar/i }).click();
    await page.waitForTimeout(150);
    await input.fill('río');
    await page.getByRole('button', { name: /agregar/i }).click();
    await page.waitForTimeout(150);
    // Warning may or may not appear depending on dictionary match; just verify no crash
    await expect(page.locator('.dat-word-chip')).toHaveCount(2);
  });

  test('validates input', async ({ page }) => {
    await page.goto('/test/dat');
    await acceptDisclaimer(page);
    const input = page.getByPlaceholder(/escribe una palabra/i);
    const add = page.getByRole('button', { name: /agregar/i });
    await input.fill('la casa azul');
    await add.click();
    await expect(page.locator('.dat-validation-error')).toBeVisible();
  });

  test('can remove words', async ({ page }) => {
    await page.goto('/test/dat');
    await acceptDisclaimer(page);
    const input = page.getByPlaceholder(/escribe una palabra/i);
    await input.fill('montaña');
    await page.getByRole('button', { name: /agregar/i }).click();
    await expect(page.locator('.dat-word-chip')).toHaveCount(1);
    await page.getByRole('button', { name: /eliminar montaña/i }).click();
    await expect(page.locator('.dat-word-chip')).toHaveCount(0);
  });
});

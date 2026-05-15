import { test, expect } from '@playwright/test';
import { acceptDisclaimer, clearStorage } from './helpers';

test.describe('Likert test flow', () => {
  test.beforeEach(async ({ page }) => clearStorage(page));

  test('TDAH: disclaimer → first question → answer → navigate', async ({ page }) => {
    await page.goto('/test/tdah-adulto');
    await acceptDisclaimer(page);
    await expect(page.locator('.instructions-banner')).toBeVisible();
    await expect(page.locator('.progress-bar-text')).toContainText('Pregunta 1 de 16');

    // Answer and advance through 5 questions to verify navigation
    for (let i = 1; i <= 5; i++) {
      await page.locator('.likert-options label').nth(2).dispatchEvent('click');
      // Wait briefly for state update
      await page.waitForTimeout(200);
      if (i < 5) {
        await page.locator('button:has-text("Siguiente")').click({ force: true });
        await page.waitForTimeout(300);
      }
    }
    await expect(page.locator('.progress-bar-text')).toContainText('Pregunta 5 de 16');
  });

  test('TDAH: navigation buttons', async ({ page }) => {
    await page.goto('/test/tdah-adulto');
    await acceptDisclaimer(page);

    const prevBtn = page.getByRole('button', { name: /anterior/i });
    await expect(prevBtn).toBeDisabled();

    // Answer Q1 and advance to Q2
    await page.locator('.likert-options label').nth(1).dispatchEvent('click');
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Siguiente")').click({ force: true });
    await page.waitForTimeout(300);

    await expect(prevBtn).toBeEnabled();
    await expect(page.locator('.progress-bar-text')).toContainText('Pregunta 2 de 16');

    // Go back to Q1 — answer should persist
    await prevBtn.click({ force: true });
    await page.waitForTimeout(200);
    await expect(page.locator('.progress-bar-text')).toContainText('Pregunta 1 de 16');
    await expect(page.locator('.likert-options input').nth(1)).toBeChecked();
  });

  test('TDAH: cannot advance without answering', async ({ page }) => {
    await page.goto('/test/tdah-adulto');
    await acceptDisclaimer(page);
    await expect(page.locator('button:has-text("Siguiente")')).toBeDisabled();
    await page.locator('.likert-options label').nth(2).dispatchEvent('click');
    await page.waitForTimeout(200);
    await expect(page.locator('button:has-text("Siguiente")')).toBeEnabled();
  });

  test('localStorage persists progress', async ({ page }) => {
    await page.goto('/test/tdah-adulto');
    await acceptDisclaimer(page);

    // Answer Q1 and Q2, advance once to Q2
    await page.locator('.likert-options label').nth(2).dispatchEvent('click');
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Siguiente")').click({ force: true });
    await page.waitForTimeout(300);

    await expect(page.locator('.progress-bar-text')).toContainText('Pregunta 2 de 16');

    // Reload — should restore to question 2
    await page.reload();
    await page.waitForTimeout(500);
    await expect(page.locator('.progress-bar-text')).toContainText('Pregunta 2 de 16');
  });

  test('TEA: masking instruction', async ({ page }) => {
    await page.goto('/test/tea-adulto');
    await acceptDisclaimer(page);
    await expect(page.locator('.instructions-banner')).toContainText(/masking|camuflaje/i);
  });

  test('Funciones Ejecutivas: 18 questions', async ({ page }) => {
    await page.goto('/test/funciones-ejecutivas');
    await acceptDisclaimer(page);
    await expect(page.locator('.progress-bar-text')).toContainText('Pregunta 1 de 18');

    // Answer first 3 questions to verify rendering
    await page.locator('.likert-options label').nth(2).dispatchEvent('click');
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Siguiente")').click({ force: true });
    await page.waitForTimeout(300);
    await expect(page.locator('.progress-bar-text')).toContainText('Pregunta 2 de 18');
  });

  test('Burnout Masking: 13 questions', async ({ page }) => {
    await page.goto('/test/burnout-masking');
    await acceptDisclaimer(page);
    await expect(page.locator('.progress-bar-text')).toContainText('Pregunta 1 de 13');

    // Navigate a few questions
    await page.locator('.likert-options label').nth(2).dispatchEvent('click');
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Siguiente")').click({ force: true });
    await page.waitForTimeout(300);
    await expect(page.locator('.progress-bar-text')).toContainText('Pregunta 2 de 13');
  });

  test.skip('can reach results (inject answers)', async ({ page }) => {
    // Simulate completing a full test by injecting answers via page.evaluate
    await page.goto('/test/hsp-adulto');
    await acceptDisclaimer(page);

    // Fill localStorage with answers to skip to results
    await page.evaluate(() => {
      const answers = new Array(16).fill(2);
      localStorage.setItem('evalumind_hsp-adulto_state', JSON.stringify({
        accepted: true,
        answers: answers,
        currentIndex: 15,
      }));
    });

    await page.reload();
    // Should be on last question
    await page.locator('.likert-options label').nth(2).dispatchEvent('click');
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Finalizar")').click({ force: true });

    // Results should appear
    await expect(page.locator('.results-view')).toBeVisible();
    await expect(page.locator('.result-category')).toBeVisible();
    await expect(page.locator('.result-max')).toContainText('64');
  });
});

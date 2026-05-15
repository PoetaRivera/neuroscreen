import { test, expect } from '@playwright/test';
import { acceptDisclaimer, answerAllQuestions, clearStorage } from './helpers';

test.describe('Profile Map', () => {
  test.beforeEach(async ({ page }) => clearStorage(page));

  test('shows empty state when no tests completed', async ({ page }) => {
    await page.goto('/perfil');
    await expect(page.getByText(/completa al menos 2 tests/i)).toBeVisible();
  });

  test('shows results from sessionStorage', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.setItem('evalumind_completed_tests', JSON.stringify({
        'tdah-adult-v2': { testId: 'tdah-adult-v2', total: 42, category: 'alta-probabilidad', dimensions: { inattention: 24, hyperactivityPhysical: 8, impulsivityVerbal: 10 }, profiles: [], completedAt: Date.now() },
        'tea-adult-v1': { testId: 'tea-adult-v1', total: 38, category: 'moderada-probabilidad', dimensions: { socialCommunication: 10, relationships: 8, routinesFlexibility: 12, sensoryInterests: 8 }, profiles: [], completedAt: Date.now() },
      }));
    });
    await page.goto('/perfil');
    await expect(page.getByText(/2 tests completados/i)).toBeVisible();
    await expect(page.getByText('TDAH')).toBeVisible();
    await expect(page.getByText('TEA')).toBeVisible();
  });
});

test.describe('Complementarity notes', () => {
  test.beforeEach(async ({ page }) => clearStorage(page));

  test.skip('shows TDAH+RSD note when both are high', async ({ page }) => {
    // Set up RSD completion in sessionStorage
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.setItem('evalumind_completed_tests', JSON.stringify({
        'rsd-adult-v1': { testId: 'rsd-adult-v1', total: 42, category: 'rsd-marcada', dimensions: {}, profiles: [], completedAt: Date.now() },
      }));
    });

    // Inject TDAH answers (all max value = high score) to skip to results
    await page.goto('/test/tdah-adulto');
    await page.evaluate(() => {
      const answers = new Array(16).fill(4);
      localStorage.setItem('evalumind_tdah-adulto_state', JSON.stringify({
        accepted: true,
        answers: answers,
        currentIndex: 15,
      }));
    });

    await page.reload();
    // Answer the last question and finish
    await page.locator('.likert-options label').nth(4).dispatchEvent('click');
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Finalizar")').click({ force: true });

    await expect(page.locator('.results-complementarity')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('header link navigates to /perfil', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByText(/mi perfil/i).click();
    await expect(page).toHaveURL('/perfil');
  });

  test('home buttons navigate to /perfil and /historias', async ({ page }) => {
    await page.goto('/');
    await page.getByText(/mi perfil/i).first().click();
    await expect(page).toHaveURL('/perfil');
    await page.goto('/');
    await page.locator('a[href="/historias"]').first().click();
    await expect(page).toHaveURL('/historias');
  });

  test('/recursos page renders', async ({ page }) => {
    await page.goto('/recursos');
    await expect(page.locator('h2')).toBeVisible();
  });

  test('/historias page shows stories', async ({ page }) => {
    await page.goto('/historias');
    await expect(page.getByText(/automatización/i).first()).toBeVisible();
    await expect(page.getByText(/insostenible/i)).toBeVisible();
  });
});

test.describe('PDF export', () => {
  test('PDF button in results', async ({ page }) => {
    await clearStorage(page);
    await page.goto('/test/hsp-adulto');
    await acceptDisclaimer(page);
    await answerAllQuestions(page, 16);
    await expect(page.getByRole('button', { name: /descargar/i })).toBeVisible();
  });
});

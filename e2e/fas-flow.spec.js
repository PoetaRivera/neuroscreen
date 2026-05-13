import { test, expect } from '@playwright/test';
import { acceptDisclaimer, clearStorage } from './helpers';

test.describe('FAS flow', () => {
  test.beforeEach(async ({ page }) => clearStorage(page));

  test('shows letter and start button', async ({ page }) => {
    await page.goto('/test/fas');
    await acceptDisclaimer(page);
    await expect(page.locator('.fas-intro')).toBeVisible();
    await expect(page.getByRole('button', { name: /comenzar.*s/i })).toBeVisible();
  });

  test('starts task and shows timer', async ({ page }) => {
    await page.goto('/test/fas');
    await acceptDisclaimer(page);
    await page.getByRole('button', { name: /comenzar.*s/i }).click({ force: true });

    // Timer should be visible
    await expect(page.getByText(/\d{1,2}s/)).toBeVisible();

    // Input field should be present
    await expect(page.getByPlaceholder(/palabra con/i)).toBeVisible();
  });

  test('validates letter', async ({ page }) => {
    await page.goto('/test/fas');
    await acceptDisclaimer(page);
    await page.getByRole('button', { name: /comenzar.*s/i }).click({ force: true });

    const taskText = await page.locator('.fas-task').textContent();
    const letterMatch = taskText.match(/^([FAS])\s/);
    const letter = letterMatch ? letterMatch[1] : 'F';

    const input = page.getByPlaceholder(/palabra con/i);
    await input.fill((letter === 'F' ? 'z' : 'f') + 'test');
    await input.press('Enter');
    await expect(page.getByText(/debe empezar con/i)).toBeVisible();
  });

  test.skip('can finish early (inject words)', async ({ page }) => {
    await page.goto('/test/fas');
    await acceptDisclaimer(page);

    // Inject FAS state with pre-filled words
    await page.evaluate(() => {
      localStorage.setItem('neuroscreen_fas_state', JSON.stringify({
        accepted: true,
        answers: ['foco', 'fresa', 'fuerza', 'fuego'],
        currentIndex: 0,
      }));
    });
    await page.reload();

    // Start the task
    await page.getByRole('button', { name: /comenzar.*s/i }).click({ force: true });

    // Type a few more words to get past the min threshold
    const taskText = await page.locator('.fas-task').textContent();
    const letterMatch = taskText.match(/^([FAS])\s/);
    const letter = letterMatch ? letterMatch[1] : 'F';
    const wordStarts = { F: 'foco', A: 'aro', S: 'sol' };
    const input = page.getByPlaceholder(/palabra con/i);

    await input.fill(wordStarts[letter] || 'foco');
    await input.press('Enter');
    await page.waitForTimeout(200);

    // The "Terminar y ver resultados" button should appear after 1+ word
    // But the component starts fresh on reload so we just type 3 words
    await input.fill((wordStarts[letter] || 'foco') + '2');
    await input.press('Enter');
    await page.waitForTimeout(200);
    await input.fill((wordStarts[letter] || 'foco') + '3');
    await input.press('Enter');
    await page.waitForTimeout(200);

    // Now click Terminar
    await page.locator('button:has-text("Terminar")').click({ force: true });
    await page.waitForTimeout(500);

    // Results should show
    await expect(page.locator('.results-view')).toBeVisible();
  });
});

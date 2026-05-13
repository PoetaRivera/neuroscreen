import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test('renders title and description', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h2')).toContainText('NeuroScreen');
    await expect(page.locator('.home-description')).toBeVisible();
  });

  test('shows all 9 test cards', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.test-card');
    await expect(cards).toHaveCount(9);
  });

  test('each card has title, description, and start button', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.test-card');

    for (const card of await cards.all()) {
      await expect(card.locator('h3')).not.toBeEmpty();
      await expect(card.locator('.test-card-desc')).not.toBeEmpty();
      await expect(card.locator('.btn-primary')).toBeVisible();
    }
  });

  test('navigation links to /perfil and /historias are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Mapa de Funcionamiento')).toBeVisible();
    await expect(page.getByText('Historias de Adaptación')).toBeVisible();
  });

  test('clicking a test card navigates to the test', async ({ page }) => {
    await page.goto('/');
    await page.locator('.test-card').first().locator('.btn-primary').click();
    await expect(page).toHaveURL(/\/test\//);
  });
});

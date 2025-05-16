
import { test, expect } from '@playwright/test';

test('User can log in', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=🔐 Sign In / Sign Up')
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'test123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*products/);
});


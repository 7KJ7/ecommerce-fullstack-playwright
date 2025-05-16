import { test, expect } from '@playwright/test';

test('Register with a new user', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Go to registration page (update if you use a dedicated route)
  await page.click('text=🔐 Sign In / Sign Up');

  const uniqueEmail = `user${Date.now()}@test.com`;
  await page.getByRole('button', { name: /no account\? register here/i }).click();;

  await page.fill('input[type="email"]', uniqueEmail);
  await page.fill('input[type="password"]', 'test1234');
  await page.click('button[type="submit"]');

  await expect(page.getByText('User registered successfully')).toBeVisible();
});

test(' Register with existing email fails', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.click('text=🔐 Sign In / Sign Up');
  await page.getByRole('button', { name: /no account\? register here/i }).click();;


  await page.fill('input[type="email"]', 'user@example.com'); // existing email
  await page.fill('input[type="password"]', 'test1234');
  await page.click('button[type="submit"]');

  await expect(page.getByText(/User already exists/i)).toBeVisible();
});


import { test, expect } from '@playwright/test';


test('user cannot login with invalid credentials(invalid email) ', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=🔐 Sign In / Sign Up')
  await page.fill('input[type="email"]', 'wrong@example.com');
  await page.fill('input[type="password"]', 'test123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/.*login/);
  const error = await page.locator('text=Invalid credentials');
  await expect(error).toBeVisible();

});

test('user cannot login with invalid credentials(invalid password)', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=🔐 Sign In / Sign Up')
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'test1234');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/.*login/);
  const error = await page.locator('text=Invalid credentials');
  await expect(error).toBeVisible();

});




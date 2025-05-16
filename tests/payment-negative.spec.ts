
import { test, expect } from '@playwright/test';

test(' Payment fails with invalid card values (non-numeric, expired, too long)', async ({ page }) => {
  const email = 'test@example.com';
  const password = 'test123';

  await page.goto('http://localhost:3000');

  await page.getByRole('button', { name: /sign in/i }).click();
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/.*products/);

  await page.getByRole('button', { name: /add to cart/i }).first().click();
  await page.getByRole('button', { name: /proceed to payment/i }).click();
  await expect(page).toHaveURL(/.*payment/);

  // CASE 1: Alphabetic card number
  await page.fill('input[name="cardNumber"]', 'abcd1234abcd5678');
  await page.fill('input[name="expiry"]', '12/34');
  await page.fill('input[name="cvc"]', '123');
  await page.getByRole('button', { name: /pay now/i }).click();
  await expect(page.getByText('Card number must be exactly 16 digits.')).toBeVisible();

  // CASE 2: Too long card number
  await page.fill('input[name="cardNumber"]', '12345678901234567890');
  await page.fill('input[name="expiry"]', '12/34');
  await page.fill('input[name="cvc"]', '123');
  await page.getByRole('button', { name: /pay now/i }).click();
  await expect(page.getByText('Card number must be exactly 16 digits.')).toBeVisible();

  // CASE 3: Expired expiry date
  await page.fill('input[name="cardNumber"]', '4242424242424242');
  await page.fill('input[name="expiry"]', '21/21');
  await page.fill('input[name="cvc"]', '123');
  await page.getByRole('button', { name: /pay now/i }).click();
  await expect(page.getByText('Expiry must be in MM/YY format.')).toBeVisible();
});

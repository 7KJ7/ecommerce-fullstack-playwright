
import { test, expect } from '@playwright/test';

test('Full e-commerce flow: login, add to cart, checkout, verify & delete order, logout', async ({ page }) => {
  const email = 'test@example.com';
  const password = 'test123';

  await page.goto('http://localhost:3000');

  await page.click('text=🔐 Sign In / Sign Up');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/.*products/);

  const addButtons = await page.getByRole('button', { name: /add to cart/i }).all();
  expect(addButtons.length).toBeGreaterThan(0);
  await addButtons[0].click();

  await page.getByRole('button', { name: /proceed to payment/i }).click();
  await expect(page).toHaveURL(/.*payment/);

  await page.fill('input[name="cardNumber"]', '4242424242424247');
  await page.fill('input[name="expiry"]', '08/27');
  await page.fill('input[name="cvc"]', '124');
  await page.getByRole('button', { name: /pay now/i }).click();

  await expect(page.locator('text=payment successful')).toBeVisible();
  await page.getByRole('button', { name: /back to products/i }).click();
  await expect(page).toHaveURL(/.*products/);

  const orderList = page.locator('text=🧾 Order History').locator('..').locator('li');
  await expect(orderList.first()).toBeVisible();

  const deleteButton = await orderList.first().getByRole('button', { name: /delete/i });
  await deleteButton.click();

  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: /sign out/i }).click();
  await expect(page).toHaveURL(/.*login/);
});

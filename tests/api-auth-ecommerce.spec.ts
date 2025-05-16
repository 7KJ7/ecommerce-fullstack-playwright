
import { test, expect, request } from '@playwright/test';

let token: string;
let validProductId: string;

test.beforeAll(async () => {
  const context = await request.newContext();

  // Log in and get token
  const login = await context.post('http://localhost:5000/api/login', {
    data: {
      email: 'test@example.com',
      password: 'test123',
    },
  });

  const loginData = await login.json();
  token = loginData.token;
  console.log('✅ TOKEN:', token);
  expect(token).toBeTruthy();

  // Fetch product list to get a valid product ID
  const productRes = await context.get('http://localhost:5000/api/products');
  const products = await productRes.json();
  expect(products.length).toBeGreaterThan(0);

  validProductId = products[0]._id;
  console.log('✅ Using productId:', validProductId);
});

test('GET /api/products returns product list', async ({ request }) => {
  const res = await request.get('http://localhost:5000/api/products');
  expect(res.ok()).toBeTruthy();
  const products = await res.json();
  expect(Array.isArray(products)).toBe(true);
});

test('GET /api/orders returns orders for authenticated user', async ({ request }) => {
  const res = await request.get('http://localhost:5000/api/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(res.ok()).toBeTruthy();
  const orders = await res.json();
  expect(Array.isArray(orders)).toBe(true);
});

test('POST /api/cart adds a product to cart', async ({ request }) => {
  const res = await request.post('http://localhost:5000/api/cart', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      productId: validProductId,
      qty: 1,
    },
  });

  expect(res.ok()).toBeTruthy();
  const result = await res.json();
  expect(result.message).toBeDefined();
});
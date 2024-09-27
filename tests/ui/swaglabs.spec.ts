import { test, expect } from '@playwright/test';

test('Login com credenciais corretas', async ({ page }) => {

  // login
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('Login com credenciais incorretas', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

  // credenciais incorretas 
  const invalidCredentials = [
    { username: 'invalid_user', password: 'wrong_password', expectedMessage: 'Epic sadface: Username and password do not match any user in this service' },
    { username: 'standard_user', password: '', expectedMessage: 'Epic sadface: Password is required' },
  ];
  // login
  for (const { username, password, expectedMessage } of invalidCredentials) {
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');

    const errorMessage = await page.locator('h3[data-test="error"]');
  }
});

test('Adicionar e remover produtos do carrinho', async ({ page }) => {

 // Login
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

 // adiciona três produtos
  await page.click('.btn_primary[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('.btn_primary[data-test="add-to-cart-sauce-labs-bike-light"]');
  await page.click('.btn_primary[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
  await page.click('.shopping_cart_link');

  // remove dois produtos
  const productsToRemove = [
    'sauce-labs-bike-light',
    'sauce-labs-bolt-t-shirt'
  ];
  for (const productId of productsToRemove) {
    const removeButtonLocator = page.locator(`.btn_secondary[data-test="remove-${productId}"]`);
    await expect(removeButtonLocator).toBeVisible(); 
    await removeButtonLocator.click(); 
  }

  // validação
  const remainingItems = await page.locator('.cart_item');
  await expect(remainingItems).toHaveCount(1);
  const remainingProductName = await remainingItems.locator('.inventory_item_name').innerText();
  expect(remainingProductName).toBe('Sauce Labs Backpack'); 
});

test('Simular erro na finalização da compra', async ({ page }) => {
  // login
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // adiciona produto ao carrinho
  await page.click('.btn_primary[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // finaliza compra
  await page.click('[data-test="continue"]');

  // validação
  const errorMessage = await page.locator('h3[data-test="error"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText('Error: First Name is required');
});

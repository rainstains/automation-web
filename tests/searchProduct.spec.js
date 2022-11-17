const { test, expect } = require('@playwright/test')
const { loginValid, URL } = require('./login.spec')

// const url = "https://staging.evermosa2z.com/"

test('Search Product', async ({ page }) => {
    await loginValid(page,URL)

    await page.getByRole('link', { name: 'Jualan apa sekarang ?' }).click();
    await page.getByPlaceholder('Cari Produk di Evermos…').fill('');
    await page.getByPlaceholder('Cari Produk di Evermos…').press('Enter');

    await expect(page.getByRole('link', { name: /kopi/ })).toBeVisible() 

    
})

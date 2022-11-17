const { expect, test } = require('@playwright/test')
var randomstring = require('randomstring')

const url = "https://staging.evermosa2z.com/"

const phoneNumber = [
    "62696969000",
    "6281111111113",
    "62252500000",
    "6281123123111"
]

const password = [
    "123123123",
    "123123123",
    "123123123",
    "evermos123",
]

async function loginValid(page) {
    var index = randomstring.generate({
        length: 1,
        charset: '02'
    });

    await page.goto(url+'login');
    await page.getByPlaceholder('Nomor Telepon Anda').fill(phoneNumber[index]);
    await page.getByPlaceholder('Kata Sandi Anda').fill(password[index]);
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(url+'catalog',5500) ;
    await page.locator('.appNav__panel > a:nth-child(5)').click();
    await expect(page.getByText('+'+phoneNumber[index])).toBeVisible()
    await page.getByRole('link', { name: 'Beranda' }).click();
}

test.describe('Login Function', () => {
    test('Login - Negative', async ({ page }) => {
        var index = randomstring.generate({
            length: 1,
            charset: '13'
        });
    
        await page.goto(url+'login');
        await page.getByPlaceholder('Nomor Telepon Anda').fill(phoneNumber[index]);
        await page.getByPlaceholder('Kata Sandi Anda').fill(password[index]);
        await page.getByRole('button', { name: 'Masuk' }).click();
        await expect(page.getByText('Nomor ini belum terdaftar sebagai reseller')).toBeVisible;
        await expect(page).toHaveURL(url+'login',2500) ;
    })

    test('Login - Positive', async ({ page }) => {
        await loginValid(page)
    })
    
})




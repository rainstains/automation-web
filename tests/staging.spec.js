const { expect, test } = require('@playwright/test')
var randomstring = require('randomstring')

const URL = "https://staging.evermosa2z.com/"

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

const querySearch = [
    "kopi",
    "",
    "",
    "",
    "",
    "",
]

async function loginValid(page,url) {
    var index = randomstring.generate({
        length: 1,
        charset: '02'
    });

    await page.goto(url+'login');
    await page.getByPlaceholder('Nomor Telepon Anda').fill(phoneNumber[index]);
    await page.getByPlaceholder('Kata Sandi Anda').fill(password[index]);
    await page.getByRole('button', { name: 'Masuk' }).click();
    await page.getByText('Jualan apa sekarang').waitFor()
    await expect(page).toHaveURL(url+'catalog') ;
    return phoneNumber[index]
}

test.describe('Login Function', () => {
    test('Negative', async ({ page }) => {
        var index = randomstring.generate({
            length: 1,
            charset: '13'
        });
    
        await page.goto(URL+'login');
        await page.getByPlaceholder('Nomor Telepon Anda').fill(phoneNumber[index]);
        await page.getByPlaceholder('Kata Sandi Anda').fill(password[index]);
        await page.getByRole('button', { name: 'Masuk' }).click();
        await expect(page.getByText('Nomor ini belum terdaftar sebagai reseller')).toBeVisible;
        await expect(page).toHaveURL(URL+'login',2500) ;
    })

    test('Positive', async ({ page }) => {
        var phone = await loginValid(page,URL)
        await page.locator('.appNav__panel > a:nth-child(5)').click();
        await expect(page.getByText('+'+phone)).toBeVisible()
        await page.getByRole('link', { name: 'Beranda' }).click();
    })
    
})

test.describe('Search Product', () => {
    test('Positive', async ({ page }) => {
        var index = randomstring.generate({
            length: 1,
            charset: '123456789'
        })

        await loginValid(page,URL)
    
        await page.getByRole('link', { name: 'Jualan apa sekarang ?' }).click();
        await page.getByPlaceholder('Cari Produk di Evermos…').fill(querySearch [0]);
        await page.getByPlaceholder('Cari Produk di Evermos…').press('Enter');
        //await expect(page.getByRole('link', { name: querySearch[0] })).toBeVisible() 
        await expect(page.locator('#__layout > div > div.appSection > div')).toBeVisible()
        
        await expect(page.getByRole('link', { name: /kopi/})).not.toHaveCount(0)
    })
})


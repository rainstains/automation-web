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

async function loginValid(page) {
    var index = randomstring.generate({
        length: 1,
        charset: '02'
    })

    await page.goto(URL+'login')
    await page.getByPlaceholder('Nomor Telepon Anda').fill(phoneNumber[index])
    await page.getByPlaceholder('Kata Sandi Anda').fill(password[index])
    await page.getByRole('button', { name: 'Masuk' }).click()
    await page.getByText('Jualan apa sekarang').waitFor()
    await expect(page).toHaveURL(URL+'catalog') 
    return phoneNumber[index]
}

async function searchProduct(page){
    var index = randomstring.generate({
        length: 1,
        charset: '0'
    })

    await page.getByRole('link', { name: 'Jualan apa sekarang ?' }).click()
    await page.getByPlaceholder('Cari Produk di Evermos…').fill(querySearch [0])
    await page.getByPlaceholder('Cari Produk di Evermos…').press('Enter')
    return index
}

test.describe('Login Function', () => {
    test('Negative', async ({ page }) => {
        var index = randomstring.generate({
            length: 1,
            charset: '13'
        })
    
        await page.goto(URL+'login')
        await page.getByPlaceholder('Nomor Telepon Anda').fill(phoneNumber[index])
        await page.getByPlaceholder('Kata Sandi Anda').fill(password[index])
        await page.getByRole('button', { name: 'Masuk' }).click()
        await expect(page.getByText('Nomor ini belum terdaftar sebagai reseller')).toBeVisible
        await expect(page).toHaveURL(URL+'login',2500) 
        await page.close()
    })

    test('Positive', async ({ page }) => {
        var phone = await loginValid(page,URL)
        await page.locator('.appNav__panel > a:nth-child(5)').click()
        await expect(page.getByText('+'+phone)).toBeVisible()
        await page.getByRole('link', { name: 'Beranda' }).click()
        await page.close()
    })
    
})

test.describe('Search Product', () => {
    test('Positive', async ({ page }) => {
        await loginValid(page)
        var index = await searchProduct(page)
        await expect(page.locator('#__layout > div > div.appSection > div')).toBeVisible()
        await expect(page.getByRole('link', { name: querySearch[index]})).not.toHaveCount(0)
        await page.close()
    })
})

test.describe('Order Product', () => {
    test('Positive', async ({ page }) => {
        await loginValid(page)
        var index = await searchProduct(page)

        await page.getByRole('link', { name: querySearch[index] }).first().click()
        
        await new Promise(r => setTimeout(r, 2500))

        const tutup = page.getByText(/mohon maaf/||/tutup/)
        console.log(tutup)

        // if (expect.soft(page.getByText(/tutup/)).not.toHaveCount(0)) {
        //     await expect(page.getByText(/tutup/),"TOKO TUTUP (NEGATIVE CASE)").toBeVisible()
        //     await new Promise(r => setTimeout(r, 2000))
        //     await page.close()
        // }else{
            await page.reload()
            await page.getByRole('link', { name: 'Beli Sekarang' }).click()
            await page.getByRole('heading', { name: 'Detail Pengiriman' }).waitFor()

            await new Promise(r => setTimeout(r, 2000))

            await page.locator('a').filter({ hasText: 'Lanjutkan' }).click()
            await new Promise(r => setTimeout(r, 1500))
            await page.getByText('Berhasil!').waitFor()
            await page.getByRole('button', { name: 'Lihat Keranjang' }).click()
            await page.getByRole('heading', { name: 'Keranjang' }).waitFor()
            await page.getByRole('link', { name: 'Lanjut ke Checkout' }).click()
            await page.getByRole('heading', { name: 'Checkout' }).waitFor()
            await page.getByRole('link', { name: 'Proses Sekarang' }).click()
            await page.getByText('Lanjutkan Pembayaran?').waitFor()
            await page.getByRole('button', { name: 'Bayar' }).click()
            await page.getByRole('heading', { name: 'Pilih Metode Pembayaran' }).waitFor()

            await new Promise(r => setTimeout(r, 2000))
            
            await page.locator('a').filter({ hasText: 'Danamon OnlineInternet Banking & m-Banking' }).click()
            await page.locator('span').filter({ hasText: 'Danamon Online Banking' }).waitFor()
            await page.getByRole('button', { name: 'Pay now' }).click()

            await new Promise(r => setTimeout(r, 2000))

            await page.getByRole('heading', { name: 'Detail Transaksi' }).waitFor()
            await page.getByRole('button', { name: 'Pay' }).click()
            await page.getByRole('heading', { name: 'Danamon Online' }).waitFor()
            await page.getByText('Payment Success').waitFor()
            await page.getByRole('button', { name: 'Back to merchant website' }).click()

            await page.reload()

            await expect(page.getByRole('heading', { name: 'Pembayaran Berhasil!' })).toBeVisible()
            await expect(page.getByText('Total Sudah Dibayar:')).toBeVisible()

            await page.getByRole('link', { name: 'Lihat Daftar Pesanan' }).click()
            await page.getByRole('link', { name: 'Beranda' }).click()
            await page.close()
       // }
    })

})


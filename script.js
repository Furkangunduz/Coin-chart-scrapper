const puppeteer = require("puppeteer");
require("dotenv").config()

const base_url = "https://coinmarketcap.com/currencies/"
const canvasSelector = "#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.jKrmxw.container > div > div.sc-16r8icm-0.sc-19zk94m-1.gRSJaB > div.sc-16r8icm-0.dSXRna > div:nth-child(1) > div > div > div > div:nth-child(3) > div > div.tk0ro3-0.ckaobf > div > div > div:nth-child(3) > div.chart-wrapper > div.chart > div > table"
const cookieCloseSelector = "#cmc-cookie-policy-banner > div.cmc-cookie-policy-banner__close"
const coinList = { "BTC": "bitcoin" }

const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

async function getScreenShot(currencie) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        'args': [
            "--incognito",
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });
    const page = await browser.newPage();
    const URL = base_url + currencie

    await page.goto(URL);
    try {
        await page.waitForSelector(cookieCloseSelector)
        await page.click(cookieCloseSelector)
        await page.evaluate(() => { window.scrollBy(0, 600); })
        await page.waitForSelector(canvasSelector);
        await page.mouse.move(0, 0);
        const element = await page.$(canvasSelector);
        await element.screenshot({ path: 'chart.png' });
    } catch (error) {

    }
    await browser.close();
    return 0;
}

const uploadImg = async () => {
    let url
    await cloudinary.uploader.upload('chart.png', (err, image) => {
        if (err) {
            console.warn(err)
        } else {
            url = image.url
        }
    })

    return url
}


module.exports = {
    getScreenShot,
    uploadImg,
    coinList
}



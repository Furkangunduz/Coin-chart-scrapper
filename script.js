const puppeteer = require("puppeteer");
require("dotenv").config()

const base_url = "https://coinmarketcap.com/currencies/"
const canvasSelector = "div.chart-wrapper"

const coinList = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "USDT": "tether",
    "BNB": "binance-usd",
    "XRP": "xrp",
    "ADA": "cardano",
    "SOL": "solana",
    "DOT": "polkadot",
    "DOGE": "dogecoin",
    "TRX": "tron",
    "AVAX": "avalanche",
}

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

    try {
        const page = await browser.newPage();
        const URL = base_url + currencie

        await page.goto(URL);

        await page.evaluate(() => { window.scrollBy(0, 600); })
        await page.waitForSelector(canvasSelector);
        await page.evaluate(() => {
            const cookiesBannerSelector = "#cmc-cookie-policy-banner"
            let el = document.querySelector(cookiesBannerSelector)
            if (el) el.style.display = "none"
        })
        await page.mouse.move(0, 0);
        const element = await page.$(canvasSelector);
        await element.screenshot({ path: 'chart.png' });

        console.log('done');
        await browser.close();
    } catch (e) {
        console.log("Our Error", e)
        await browser.close();
    }
}

const uploadImg = async () => {
    let url
    await cloudinary.uploader.upload('chart.png', (err, image) => {
        if (err) {
            console.warn(err)
        } else {
            url = "https" + image.url.substring(4)
        }
    })
    console.log(url)
    return url
}


module.exports = {
    getScreenShot,
    uploadImg,
    coinList
}



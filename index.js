import puppeteer from 'puppeteer';
import {JSDOM} from 'jsdom'
import express from 'express'
import asyncHandler from 'express-async-handler'
import bodyParser from "body-parser";
import morgan from "morgan";

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
const JS_SELECTORS = {
    CHEAPEST_PRICE_TAG: '#hprt-table > tbody > tr:nth-child(1) > td:nth-child(3) > div > div > div:nth-child(1) > div:nth-child(2) > div > span'
}

const app = express()
app.use(bodyParser.json())
morgan.token('body', req => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :body'))
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.post('/booking-price', asyncHandler(async (req, res) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--lang=pl-PL'],
        timeout: 10000,
        headless: true
    });
    // const cookies = [
    //     {
    //         'name': '',
    //         'value': ''
    //     },
    //     {
    //         'name': '',
    //         'value': ''
    //     }
    // ];
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT)

    const bookingLink = req.body.link
    if (bookingLink == null) {
        res.json("0")
        return
    }

    await page.goto(bookingLink);
    // await page.setCookie(...cookies)
    await page.waitForFunction(
        'window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500'
    )

    const pageSourceHtml = await page.content()
    await browser.close()

    const dom = new JSDOM(pageSourceHtml);
    const priceTag = dom.window.document.querySelector(JS_SELECTORS.CHEAPEST_PRICE_TAG).textContent;

    res.set('Content-Type', 'text/html');
    res.send(priceTag.replaceAll(/[^0-9,.]/g, ''));
}));

const PORT = 9999
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

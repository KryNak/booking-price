import puppeteer from 'puppeteer';
import express from 'express'
import asyncHandler from 'express-async-handler'
import bodyParser from "body-parser";
const app = express()
app.use(bodyParser.json())

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

app.post('/booking-price', asyncHandler(async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT)

    const bookingLink = req.body.link
    if(bookingLink == null) {
        res.json("0")
        return
    }

    await page.goto(bookingLink);

    const xPath = '::-p-xpath(//*[@id="hprt-table"]/tbody/tr[1]/td[3]/div/div[1]/div[1]/div[2]/div/span[1])';
    await page.waitForSelector(xPath)
    const element = await page.$(xPath)
    const price = await page.evaluate(i => i.textContent, element)
    await browser.close()

    res.json(price.replace("zł", "").trim());
}));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

const PORT = 9999
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

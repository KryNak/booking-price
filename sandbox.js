import { JSDOM } from 'jsdom'

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
const LINK = "https://www.booking.com/hotel/jp/tokyo-bay-shiomi-prince.pl.html?aid=304142&label=gen173nr-1FCAEoggI46AdIM1gEaLYBiAEBmAEeuAEXyAEP2AEB6AEB-AEMiAIBqAIDuALs3Zi1BsACAdICJDQwZTgzYzhhLTcxZTYtNGFkMS1iZmE0LWYzZTAwNzMyYWU2MtgCBuACAQ&sid=2cde988ebec4e3b32424560d89d31fee&all_sr_blocks=575217122_397711310_2_2_0;checkin=2024-09-17;checkout=2024-09-20;dest_id=-246227;dest_type=city;dist=0;group_adults=2;group_children=0;hapos=5;highlighted_blocks=575217122_397711310_2_2_0;hpos=5;matching_block_id=575217122_397711310_2_2_0;no_rooms=1;req_adults=2;req_children=0;room1=A%2CA;sb_price_type=total;sr_order=popularity;sr_pri_blocks=575217122_397711310_2_2_0__8067654;srepoch=1722190197;srpvid=a5497fb8ad1d0033;type=total;ucfs=1&"

const JS_SELECTORS = {
    CHEAPEST_PRICE_TAG: '#hprt-table > tbody > tr:nth-child(1) > td:nth-child(3) > div > div > div:nth-child(1) > div:nth-child(2) > div > span'
}

async function main() {
    const resp = await fetch(LINK);
    const pageSourceHtml = await resp.text()

    const dom = new JSDOM(pageSourceHtml);
    const priceTag = dom.window.document.querySelector(JS_SELECTORS.CHEAPEST_PRICE_TAG).textContent;
    console.log(priceTag.replaceAll(/[^0-9,.]/g, ''))
}

main()

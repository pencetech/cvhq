import puppeteer, { Browser, BrowserLaunchArgumentOptions, Page } from 'puppeteer';

class PuppeteerApi {
    config: BrowserLaunchArgumentOptions;
    browser: Browser | null;

    constructor(config: BrowserLaunchArgumentOptions) {
        this.config = config;
        this.browser = null;
    }
    
    setConfig(config: BrowserLaunchArgumentOptions) {
        this.config = config
    }

    async newBrowser() {
        return await puppeteer.launch(this.config)
    }

    async getBrowser() {

        if (!this.browser) {
            this.browser = await this.newBrowser()
        }

        return this.browser
    }

    async newPage() {
        const browser = await this.getBrowser()
        const page = await browser.newPage()
        return page
    }

    async handBack(page: Page) {

        // close the page or even reuse it?.
        await page.close()

        // you could add logic for closing the whole browser instance depending what
        // you want.
    }

    async shutdown() {
        if (this.browser) {
            await this.browser.close()
        }
    }


}

const config = {
    executablePath: 'chromium',
    headless: true,
    args: [
        "--no-sandbox",
        "--disable-gpu",
        "--single-process"
    ]
} as BrowserLaunchArgumentOptions

const browserApi = new PuppeteerApi(config)
export default browserApi
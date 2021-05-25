const assert = require('assert')
const puppeteer = require('puppeteer')
const {TestBase} = require('../util/TestBase')

class UiTest extends TestBase {
  constructor () {
    super()
    this.params = {
      isHeadless: process.env.IS_HEADLESS !== '0',
      baseUrl: process.env.BASE_URL || 'http://127.0.0.1:3001',
      timeout: parseInt(process.env.TIMEOUT || '1000', 10),
    }
  }

  async launchBrowser () {
    return await puppeteer.launch({
      headless: this.params.isHeadless,
    })    
  }

  async testSignin () {
    const browser = await this.launchBrowser()
    const {baseUrl, timeout} = this.params

    try {
      const page = await browser.newPage()

      await Promise.all([
        page.waitForNavigation(baseUrl + '/public/iam/signin', {timeout}),
        page.goto(baseUrl + '/private/'),
      ])

      await page.waitForSelector('button[type=submit]', {timeout})

      await page.type('#username', 'admin')
      await page.type('#password', 'password')

      await Promise.all([
        page.waitForNavigation(baseUrl + '/private/', {timeout}),
        page.$eval('button[type=submit]', el => el.click()),
      ])
    } finally {
      await browser.close()
    }
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new UiTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.UiTest = UiTest

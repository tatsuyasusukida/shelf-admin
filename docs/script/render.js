const path = require('path')
const fsExtra = require('fs-extra')
const puppeteer = require('puppeteer')

class Main {
  async run () {
    const browser = await puppeteer.launch()

    try {
      const page = await browser.newPage()

      await page.setViewport({width: 800, height: 1050, deviceScaleFactor: 2})

      const items = this.getItems()

      for (const item of items) {
        const {pathname, file} = item
        const dirname = path.join(__dirname, '../dist/img')
        const destination = path.join(dirname, file + '.png')

        await fsExtra.mkdirp(path.dirname(destination))
        await page.goto('http://127.0.0.1:3001' + pathname)
        await page.screenshot({path: destination})
      }
    } finally {
      await browser.close()
    }
  }

  getItems () {
    return [
      {pathname: '/', file: 'static-page/public-home'},
      {pathname: '/public/layout/', file: 'static-page/public-layout'},
      {pathname: '/public/iam/signin/', file: 'iam/public-signin'},
      {pathname: '/public/iam/signout/finish/', file: 'iam/public-signout-finish'},

      {pathname: '/private/', file: 'static-page/private-home'},
      {pathname: '/private/layout/', file: 'static-page/private-layout'},
      {pathname: '/private/order/', file: 'order/private-index'},
      {pathname: '/private/order/1/', file: 'order/private-view'},
      {pathname: '/private/order/1/print/', file: 'order/private-print'},
      {pathname: '/private/order/1/delete/', file: 'order/private-delete'},
      {pathname: '/private/order/delete/finish/', file: 'order/private-delete-finish'},

      {pathname: '/private/question/', file: 'question/private-index'},
      {pathname: '/private/question/1/', file: 'question/private-view'},
      {pathname: '/private/question/1/print/', file: 'question/private-print'},
      {pathname: '/private/question/1/delete/', file: 'question/private-delete'},
      {pathname: '/private/question/delete/finish/', file: 'question/private-delete-finish'},

      {pathname: '/private/estimate/', file: 'estimate/private-index'},
      {pathname: '/private/estimate/1/', file: 'estimate/private-view'},
      {pathname: '/private/estimate/1/print/', file: 'estimate/private-print'},
      {pathname: '/private/estimate/1/delete/', file: 'estimate/private-delete'},
      {pathname: '/private/estimate/delete/finish/', file: 'estimate/private-delete-finish'},

      {pathname: '/private/iam/signout/', file: 'iam/private-signout'},
    ]
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

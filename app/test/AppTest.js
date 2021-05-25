const assert = require('assert')
const querystring = require('querystring')
const fetch = require('node-fetch')
const {TestBase} = require('../util/TestBase')

class AppTest extends TestBase {
  async testStatus () {
    const cookie = await this.signin()

    await this._testStatus200('http://127.0.0.1:3001/')
    await this._testStatus200('http://127.0.0.1:3001/public/layout/')
    await this._testStatus200('http://127.0.0.1:3001/public/iam/signin/')
    await this._testStatus200('http://127.0.0.1:3001/public/iam/signout/finish/')
    await this._testStatus200('http://127.0.0.1:3001/private/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/layout/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/order/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/order/1/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/order/1/print/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/order/1/delete/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/order/delete/finish/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/question/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/question/1/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/question/1/print/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/question/1/delete/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/question/delete/finish/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/estimate/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/estimate/1/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/estimate/1/print/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/estimate/1/delete/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/estimate/delete/finish/', cookie)
    await this._testStatus200('http://127.0.0.1:3001/private/iam/signout/', cookie)

    await this._testStatus200('http://127.0.0.1:3001/static/css/bootstrap.min.css')
    await this._testStatus200('http://127.0.0.1:3001/static/css/bootstrap-reboot.min.css')
    await this._testStatus200('http://127.0.0.1:3001/static/css/bootstrap-grid.min.css')
    await this._testStatus200('http://127.0.0.1:3001/static/css/bootstrap-utilities.min.css')
    await this._testStatus200('http://127.0.0.1:3001/static/css/bootstrap-icons.css')
    await this._testStatus200('http://127.0.0.1:3001/static/css/screen.css')
    await this._testStatus200('http://127.0.0.1:3001/static/css/print.css')

    const search = '?' + querystring.stringify({
      width: '15',
      height: '49',
      depth: '19',
      row: '1',
      thickness: '17',
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: '1',
    })

    await this._testStatus200('http://127.0.0.1:3001/render/front.svg' + search)
    await this._testStatus200('http://127.0.0.1:3001/render/side.svg' + search)
  }

  async signin () {
    const url = 'http://127.0.0.1:3001/api/v1/public/iam/signin/submit'
    const options = {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        form: {
          username: 'admin',
          password: 'password',
        },
      }),
    }

    const response = await fetch(url, options)
    const body = await response.json()
    const setCookie = response.headers.get('set-cookie')
    const [cookie] = setCookie.split(';')

    return cookie
  }

  async _testStatus200 (url, cookie) {
    const options = cookie ? {headers: {cookie}} : {}
    const response = await fetch(url, options)

    assert.deepStrictEqual(response.status, 200)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new AppTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.AppTest = AppTest

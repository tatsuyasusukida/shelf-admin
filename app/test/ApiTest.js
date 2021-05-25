const assert = require('assert')
const querystring = require('querystring')
const fetch = require('node-fetch')
const {TestBase} = require('../util/TestBase')

class ApiTest extends TestBase {
  async testPublicIamSigninInitialize () {
    const url = 'http://127.0.0.1:3001/api/v1/public/iam/signin/initialize'
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.form, 'object')
    assert.strictEqual(typeof body.validation, 'object')
  }

  async testPublicIamSigninInitialize () {
    const url = 'http://127.0.0.1:3001/api/v1/public/iam/signin/validate'
    const options = {
      method: 'PUT',
      headers: this.makeHeaders(),
      body: JSON.stringify({
        form: {
          username: 'admin',
          password: 'password',
        },
      }),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.validation, 'object')
  }

  async testPublicIamSigninSubmit () {
    const url = 'http://127.0.0.1:3001/api/v1/public/iam/signin/submit'
    const options = {
      method: 'PUT',
      headers: this.makeHeaders(),
      body: JSON.stringify({
        form: {
          username: 'admin',
          password: 'password',
        },
      }),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(body.ok, true)
    assert.strictEqual(body.redirect, '../../../private/')
  }

  async testPrivateIamSignoutSubmit () {
    const cookie = await this.signin()
    const url = 'http://127.0.0.1:3001/api/v1/private/iam/signout/submit'
    const options = {
      method: 'DELETE',
      headers: this.makeHeaders(cookie),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(body.ok, true)
    assert.strictEqual(body.redirect, '../../../public/iam/signout/finish/')
  }

  async testPrivateOrderPrintInitialize () {
    const cookie = await this.signin()
    const url = 'http://127.0.0.1:3001/api/v1/private/order/1/print/initialize'
    const options = {
      method: 'GET',
      headers: this.makeHeaders(cookie),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.order, 'object')
    assert.strictEqual(typeof body.products, 'object')
  }

  async testPrivateOrderDeleteSubmit () {
    const cookie = await this.signin()
    const url = 'http://127.0.0.1:3001/api/v1/private/order/1/delete/submit'
    const options = {
      method: 'DELETE',
      headers: this.makeHeaders(cookie),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(body.ok, true)
    assert.strictEqual(body.redirect, '../../delete/finish/')
  }

  async testPrivateQuestionPrintInitialize () {
    const cookie = await this.signin()
    const url = 'http://127.0.0.1:3001/api/v1/private/question/1/print/initialize'
    const options = {
      method: 'GET',
      headers: this.makeHeaders(cookie),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.question, 'object')
    assert.strictEqual(typeof body.products, 'object')
  }

  async testPrivateQuestionDeleteSubmit () {
    const cookie = await this.signin()
    const url = 'http://127.0.0.1:3001/api/v1/private/question/1/delete/submit'
    const options = {
      method: 'DELETE',
      headers: this.makeHeaders(cookie),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(body.ok, true)
    assert.strictEqual(body.redirect, '../../delete/finish/')
  }

  async testPrivateEstimatePrintInitialize () {
    const cookie = await this.signin()
    const url = 'http://127.0.0.1:3001/api/v1/private/estimate/1/print/initialize'
    const options = {
      method: 'GET',
      headers: this.makeHeaders(cookie),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.estimate, 'object')
    assert.strictEqual(typeof body.products, 'object')
  }

  async testPrivateEstimateDeleteSubmit () {
    const cookie = await this.signin()
    const url = 'http://127.0.0.1:3001/api/v1/private/estimate/1/delete/submit'
    const options = {
      method: 'DELETE',
      headers: this.makeHeaders(cookie),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(body.ok, true)
    assert.strictEqual(body.redirect, '../../delete/finish/')
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

  makeHeaders (cookie) {
    return {
      'content-type': 'application/json',
      'cookie': cookie,
    }
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new ApiTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.ApiTest = ApiTest

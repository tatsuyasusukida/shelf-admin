const assert = require('assert')
const querystring = require('querystring')
const {TestBase} = require('../util/TestBase')
const {Initializer} = require('./Initializer')

class InitializerTest extends TestBase {
  async testMakeFormIamSignin () {
    const initializer = new Initializer()
    const actual = await initializer.makeFormIamSignin()
    const expected = {
      username: '',
      password: '',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeOptionsProductColor () {
    const initializer = new Initializer()
    const actual = await initializer.makeOptionsProductColor()
    const expected = [
      {value: 'ナチュラル', text: 'ナチュラル', background: '#c4b295'},
      {value: 'ホワイト', text: 'ホワイト', background: '#ebe5d7'},
      {value: 'ブラウン', text: 'ブラウン', background: '#573d2b'},
      {value: 'ブラック', text: 'ブラック', background: '#322e2f'},
    ]

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new InitializerTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.InitializerTest = InitializerTest

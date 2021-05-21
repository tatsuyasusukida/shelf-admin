const assert = require('assert')
const querystring = require('querystring')
const {TestBase} = require('../util/TestBase')
const {SummaryMaker} = require('./SummaryMaker')

class SummaryMakerTest extends TestBase {
  async testMakeSummaryOrder () {
    const summaryMaker = new SummaryMaker()
    const order = {
      payment: '代金引換',
    }

    const products = [
      {
        amount: 1,
        price: {
          total: 1234
        },
      },
    ]

    const actual = await summaryMaker.makeSummaryOrder(order, products)
    const expected = {
      shipping: 0,
      shippingText: '0',
      fee: 600,
      feeText: '600',
      subtotal: 1834,
      subtotalText: '1,834',
      tax: 183,
      taxText: '183',
      total: 2017,
      totalText: '2,017',
      amount: 1,
      amountText: '1',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeSummaryQuestion () {
    const summaryMaker = new SummaryMaker()
    const question = {}

    const products = [
      {
        amount: 1,
        price: {
          total: 1234
        },
      },
    ]

    const actual = await summaryMaker.makeSummaryQuestion(question, products)
    const expected = {
      subtotal: 1234,
      subtotalText: '1,234',
      tax: 123,
      taxText: '123',
      total: 1357,
      totalText: '1,357',
      amount: 1,
      amountText: '1',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeSummaryEstimate () {
    const summaryMaker = new SummaryMaker()
    const estimate = {}

    const products = [
      {
        amount: 1,
        price: {
          total: 1234
        },
      },
    ]

    const actual = await summaryMaker.makeSummaryEstimate(estimate, products)
    const expected = {
      subtotal: 1234,
      subtotalText: '1,234',
      tax: 123,
      taxText: '123',
      total: 1357,
      totalText: '1,357',
      amount: 1,
      amountText: '1',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeSummaryBasic () {
    const summaryMaker = new SummaryMaker()
    const products = [
      {
        amount: 1,
        price: {
          total: 1234
        },
      },
    ]

    const actual = await summaryMaker.makeSummaryBasic(products)
    const expected = {
      subtotal: 1234,
      subtotalText: '1,234',
      tax: 123,
      taxText: '123',
      total: 1357,
      totalText: '1,357',
      amount: 1,
      amountText: '1',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testCalculateSubtotal () {
    const summaryMaker = new SummaryMaker()
    const products = [
      {
        price: {
          total: 1000,
        },
      },
    ]

    const actual = await summaryMaker.calculateSubtotal(products)
    const expected = 1000

    assert.deepStrictEqual(actual, expected)
  }

  async testCalculateTax () {
    const summaryMaker = new SummaryMaker()
    const subtotal = 1000
    const actual = await summaryMaker.calculateTax(subtotal)
    const expected = 100

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new SummaryMakerTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.SummaryMakerTest = SummaryMakerTest

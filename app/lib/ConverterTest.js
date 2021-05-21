const assert = require('assert')
const {TestBase} = require('../util/TestBase')
const {Converter} = require('./Converter')

class ConverterTest extends TestBase {
  async testConvertOrder () {
    const converter = new Converter()
    const question = {
      id: 'id',
      date: new Date('2011-06-01Z'),
      number: 'number',
      name: 'name',
      kana: 'kana',
      company: 'company',
      zip: 'zip',
      address: 'address',
      tel: 'tel',
      email: 'email',
      memo: 'memo',
      payment: 'payment',
      price: 1234,
    }

    const actual = await converter.convertOrder(question)
    const expected = {
      id: 'id',
      date: new Date('2011-06-01Z'),
      dateText: '2011年6月1日 9時0分0秒',
      number: 'number',
      name: 'name',
      kana: 'kana',
      company: 'company',
      zip: 'zip',
      address: 'address',
      tel: 'tel',
      email: 'email',
      memo: 'memo',
      memoLines: ['memo'],
      payment: 'payment',
      price: 1234,
      priceText: '1,234',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testConvertQuestion () {
    const converter = new Converter()
    const question = {
      id: 'id',
      date: new Date('2011-06-01Z'),
      number: 'number',
      category: 'category',
      name: 'name',
      kana: 'kana',
      company: 'company',
      zip: 'zip',
      address: 'address',
      tel: 'tel',
      email: 'email',
      content: 'content',
      price: 1234,
    }

    const actual = await converter.convertQuestion(question)
    const expected = {
      id: 'id',
      date: new Date('2011-06-01Z'),
      dateText: '2011年6月1日 9時0分0秒',
      number: 'number',
      category: 'category',
      name: 'name',
      kana: 'kana',
      company: 'company',
      zip: 'zip',
      address: 'address',
      tel: 'tel',
      email: 'email',
      content: 'content',
      contentLines: ['content'],
      price: 1234,
      priceText: '1,234',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testConvertProduct () {
    const converter = new Converter()

    converter.imageMaker = {
      makeImage (product) {
        return 'image'
      }
    }

    converter.priceCalculator = {
      calculatePrice (product) {
        return 'price'
      }
    }

    const product = {
      id: 'id',
      width: 'width',
      height: 'height',
      depth: 'depth',
      row: 'row',
      thickness: 'thickness',
      fix: 'fix',
      back: 'back',
      color: 'color',
      amount: 'amount',
    }

    const number = 'number'
    const actual = await converter.convertProduct(product, number)
    const expected = {
      number: 'number',
      id: 'id',
      width: 'width',
      height: 'height',
      depth: 'depth',
      row: 'row',
      thickness: 'thickness',
      fix: 'fix',
      back: 'back',
      color: 'color',
      amount: 'amount',
      image: 'image',
      price: 'price',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testConvertEstimate () {
    const converter = new Converter()
    const estimate = {
      id: 'id',
      date: new Date('2011-06-01Z'),
      number: 'number',
      name: 'name',
      title: 'title',
      subscribe: 'subscribe',
      email: 'email',
      price: 1234,
    }

    const actual = await converter.convertEstimate(estimate)
    const expected = {
      id: 'id',
      date: new Date('2011-06-01Z'),
      dateText: '2011年6月1日 9時0分0秒',
      number: 'number',
      name: 'name',
      title: 'title',
      subscribe: 'subscribe',
      email: 'email',
      price: 1234,
      priceText: '1,234',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testSplitTest () {
    const converter = new Converter()
    const text = 'line\nline\nline'
    const actual = await converter.splitText(text)
    const expected = ['line', 'line', 'line']

    assert.deepStrictEqual(actual, expected)
  }

  async testFormatNumber () {
    const converter = new Converter()
    const value = 1234
    const actual = await converter.formatNumber(value)
    const expected = '1,234'

    assert.deepStrictEqual(actual, expected)
  }

  async testConvertDate () {
    const converter = new Converter()
    const date = new Date(2011, 6 - 1, 1)
    const actual = await converter.convertDate(date)
    const expected = '2011年6月1日'

    assert.deepStrictEqual(actual, expected)
  }

  async testConvertDateTime () {
    const converter = new Converter()
    const date = new Date(2011, 6 - 1, 1, 12, 34, 56)
    const actual = await converter.convertDateTime(date)
    const expected = '2011年6月1日 12時34分56秒'

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new ConverterTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.ConverterTest = ConverterTest

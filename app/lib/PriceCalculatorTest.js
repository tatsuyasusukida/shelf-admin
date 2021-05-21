const assert = require('assert')
const querystring = require('querystring')
const {TestBase} = require('../util/TestBase')
const {PriceCalculator} = require('./PriceCalculator')

class PriceCalculatorTest extends TestBase {
  async testCalculatePrice () {
    const priceCalculator = new PriceCalculator()
    const product = {
      width: '15',
      height: '49',
      depth: '19',
      row: '1',
      thickness: '17',
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: '1',
    }

    const actual = await priceCalculator.calculatePrice(product)
    const expected = {
      unit: 3200,
      unitText: '3,200',
      total: 3200,
      totalText: '3,200',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeInput () {
    const priceCalculator = new PriceCalculator()
    const product = {
      width: '15',
      height: '49',
      depth: '19',
      row: '1',
      thickness: '17',
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: '1',
    }

    const actual = await priceCalculator.makeInput(product)
    const expected = {
      width: 150,
      height: 490,
      depth: 190,
      row: 1,
      thickness: 17,
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: 1,
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakePlateVertical () {
    const priceCalculator = new PriceCalculator()
    const input = {
      width: 150,
      height: 490,
      depth: 190,
      row: 1,
      thickness: 17,
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: 1,
    }

    const params = {
      thicknessFrame: 30,
      thicknessBack: 8,
      materialLonger: 2000,
      materialShorter: 600,
    }

    const actual = await priceCalculator.makePlateVertical(input, params)
    const expected = {
      width: 190,
      height: 490,
      thickness: 30,
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakePlateHorizontal () {
    const priceCalculator = new PriceCalculator()
    const input = {
      width: 150,
      height: 490,
      depth: 190,
      row: 1,
      thickness: 17,
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: 1,
    }

    const params = {
      thicknessFrame: 30,
      thicknessBack: 8,
      materialLonger: 2000,
      materialShorter: 600,
    }

    const actual = await priceCalculator.makePlateHorizontal(input, params)
    const expected = {
      width: 150,
      height: 190,
      thickness: 30,
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakePlateInner () {
    const priceCalculator = new PriceCalculator()
    const input = {
      width: 150,
      height: 490,
      depth: 190,
      row: 1,
      thickness: 17,
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: 1,
    }

    const params = {
      thicknessFrame: 30,
      thicknessBack: 8,
      materialLonger: 2000,
      materialShorter: 600,
    }

    const actual = await priceCalculator.makePlateInner(input, params)
    const expected = {
      width: 90,
      height: 190,
      thickness: 17,
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakePlateBack () {
    const priceCalculator = new PriceCalculator()
    const input = {
      width: 150,
      height: 490,
      depth: 190,
      row: 1,
      thickness: 17,
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: 1,
    }

    const params = {
      thicknessFrame: 30,
      thicknessBack: 8,
      materialLonger: 2000,
      materialShorter: 600,
    }

    const actual = await priceCalculator.makePlateBack(input, params)
    const expected = {
      width: 150,
      height: 490,
      thickness: 8,
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testFindDiscount () {
    const priceCalculator = new PriceCalculator()
    const amount = 1

    const actual = await priceCalculator.findDiscount(amount)
    const expected = 100

    assert.deepStrictEqual(actual, expected)
  }

  async testFindMaterialPrice () {
    const priceCalculator = new PriceCalculator()
    const thickness = 30
    const params = {
      thicknessFrame: 30,
      thicknessBack: 8,
      materialLonger: 2000,
      materialShorter: 600,
    }

    const actual = await priceCalculator.findMaterialPrice(thickness, params)
    const expected = 10000 / (2000 * 600)

    assert.deepStrictEqual(actual, expected)
  }

  async testCalculateSize () {
    const priceCalculator = new PriceCalculator()
    const plateWidth = 200
    const plateHeight = 100
    const materialWidth = 2000
    const materialHeight = 1000
    const args = [plateWidth, plateHeight, materialWidth, materialHeight]
    const actual = await priceCalculator.calculateSize(...args)
    const expected = {
      longer: 250,
      shorter: 125,
    }

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new PriceCalculatorTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.PriceCalculatorTest = PriceCalculatorTest

const assert = require('assert')
const querystring = require('querystring')
const {TestBase} = require('../util/TestBase')
const {ImageMaker} = require('./ImageMaker')

class ImageMakerTest extends TestBase {
  async testMakeImage () {
    const imageMaker = new ImageMaker()

    imageMaker.initializer = {
      makeOptionsProductColor () {
        return [
          {text: 'text', value: 'color', background: 'background'},
        ]
      },
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

    const search = '?' + querystring.stringify({
      width: 'width',
      height: 'height',
      depth: 'depth',
      row: 'row',
      thickness: 'thickness',
      fix: 'fix',
      back: 'back',
      color: 'color',
      background: 'background',
    })

    const actual = await imageMaker.makeImage(product)
    const expected = {
      front: '/render/front.svg' + search,
      side: '/render/side.svg' + search,
    }

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new ImageMakerTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.ImageMakerTest = ImageMakerTest

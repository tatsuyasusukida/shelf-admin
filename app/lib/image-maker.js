const querystring = require('querystring')
const {Initializer} = require('./initializer')

class ImageMaker {
  makeImage (product) {
    const initializer = new Initializer()
    const options = initializer.makeOptionsProductColor()
    const map = options.reduce((memo, option) => {
      memo[option.value] = option.background
      return memo
    }, {})

    const search = '?' + querystring.stringify({
      width: product.width,
      height: product.height,
      depth: product.depth,
      row: product.row,
      thickness: product.thickness,
      fix: product.fix,
      back: product.back,
      color: product.color,
      amount: product.amount,
      background: map[product.color]
    })

    return {
      front: '/render/front.svg' + search,
      side: '/render/side.svg' + search,
    }
  }
}

module.exports.ImageMaker = ImageMaker

const querystring = require('querystring')
const {Initializer} = require('./Initializer')

class ImageMaker {
  constructor () {
    this.initializer = new Initializer()
  }

  makeImage (product) {
    const options = this.initializer.makeOptionsProductColor()
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
      background: map[product.color]
    })

    return {
      front: '/render/front.svg' + search,
      side: '/render/side.svg' + search,
    }
  }
}

module.exports.ImageMaker = ImageMaker

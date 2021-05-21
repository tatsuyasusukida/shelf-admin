class PriceCalculator {
  constructor () {
    this.params = {
      thicknessFrame: 30,
      thicknessBack: 8,
      materialLonger: 2000,
      materialShorter: 600,
    }
  }

  calculatePrice (product) {
    const plates = []
    const input = this.makeInput(product)

    for (let i = 0; i < 2; i += 1) {
      plates.push(this.makePlateHorizontal(input, this.params))
      plates.push(this.makePlateVertical(input, this.params))
    }

    for (let i = 0; i < input.row; i += 1) {
      plates.push(this.makePlateInner(input, this.params))
    }

    if (product.back === 'あり') {
      plates.push(this.makePlateBack(input, this.params))
    }

    const sum = plates.map(plate => {
        const {width, height, thickness} = plate
        const materialPrice = this.findMaterialPrice(thickness, this.params)
        const plateLonger = Math.max(width, height)
        const plateShorter = Math.min(width, height)
        const {materialLonger, materialShorter} = this.params
        const args = [plateLonger, plateShorter, materialLonger, materialShorter]
        const size = this.calculateSize(...args)

        return size.longer * size.shorter * materialPrice
      })
      .reduce((memo, price) => memo += price, 0)

    const discount = this.findDiscount(input.amount)
    const unit = Math.floor(sum * discount / 100 / 100) * 100
    const total = unit * input.amount

    return {
      unit,
      unitText: new Intl.NumberFormat().format(unit),
      total,
      totalText: new Intl.NumberFormat().format(total),
    }
  }

  makeInput (product) {
    return {
      width: parseInt(product.width, 10) * 10,
      height: parseInt(product.height, 10) * 10,
      depth: parseInt(product.depth, 10) * 10,
      row: parseInt(product.row, 10),
      thickness: parseInt(product.thickness, 10),
      fix: product.fix,
      back: product.back,
      color: product.color,
      amount: parseInt(product.amount, 10),
    }
  }

  makePlateVertical (input, params) {
    return {
      width: input.depth,
      height: input.height,
      thickness: params.thicknessFrame,
    }
  }

  makePlateHorizontal (input, params) {
    return {
      width: input.width,
      height: input.depth,
      thickness: params.thicknessFrame,
    }
  }

  makePlateInner (input, params) {
    return {
      width: input.width - params.thicknessFrame * 2,
      height: input.depth - (input.back === 'あり' ? params.thicknessBack : 0),
      thickness: input.thickness,
    }
  }

  makePlateBack (input, params) {
    return {
      width: input.width,
      height: input.height,
      thickness: params.thicknessBack,
    }
  }

  findDiscount (amount) {
    if (amount >= 15) {
      return 50
    } else if (amount >= 10) {
      return 60
    } else if (amount >= 5) {
      return 70
    } else if (amount >= 3) {
      return 80
    } else if (amount >= 2) {
      return 90
    } else if (amount >= 1) {
      return 100
    } else {
      throw new TypeError(`invalid amount: ${amount}`)
    }
  }

  findMaterialPrice (thickness, params) {
    if (thickness === params.thicknessFrame) {
      return 10000 / (2000 * 600)
    } else if (thickness === 25) {
      return 5000 / (2000 * 600)
    } else if (thickness === 17) {
      return 2500 / (2000 * 600)
    } else if (thickness === params.thicknessBack) {
      return 1250 / (2000 * 600)
    } else {
      throw new Error(`invalid thickness: ${thickness}`)
    }
  }

  calculateSize (plateLonger, plateShorter, materialLonger, materialShorter) {
    if (plateLonger > materialShorter || plateShorter > materialLonger / 2) {
      return {longer: materialLonger, shorter: materialShorter}
    } else {
      if (materialLonger / 2 >= materialShorter) {
        return this.calculateSize(plateLonger, plateShorter, materialLonger / 2, materialShorter)
      } else {
        return this.calculateSize(plateLonger, plateShorter, materialShorter, materialLonger / 2)
      }
    }
  }
}

module.exports.PriceCalculator = PriceCalculator

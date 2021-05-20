class PriceCalculator {
  calculatePrice (product) {
    const plates = []
    const input = {
      width: parseInt(product.width, 10) * 10,
      height: parseInt(product.height, 10) * 10,
      depth: parseInt(product.depth, 10) * 10,
      row: parseInt(product.row, 10),
      thickness: parseInt(product.thickness, 10),
      amount: parseInt(product.amount, 10),
    }

    const thicknessFrame = 30
    const thicknessBack = 8

    const plateVertical = {
      width: input.depth,
      height: input.height,
      thickness: thicknessFrame,
    }

    const plateHorizontal = {
      width: input.width,
      height: input.depth,
      thickness: thicknessFrame,
    }

    const plateInner = {
      width: input.width - thicknessFrame * 2,
      height: input.depth - (product.back === 'あり' ? thicknessBack : 0),
      thickness: input.thickness,
    }

    const plateBack = {
      width: input.width,
      height: input.height,
      thickness: thicknessBack,
    }

    plates.push(plateVertical)
    plates.push(plateVertical)
    plates.push(plateHorizontal)
    plates.push(plateHorizontal)

    for (let i = 0; i < input.row; i += 1) {
      plates.push(plateInner)
    }

    if (product.back === 'あり') {
      plates.push(plateBack)
    }

    let discount

    if (input.amount >= 15) {
      discount = 50
    } else if (input.amount >= 10) {
      discount = 60
    } else if (input.amount >= 5) {
      discount = 70
    } else if (input.amount >= 3) {
      discount = 80
    } else if (input.amount >= 2) {
      discount = 90
    } else if (input.amount >= 1) {
      discount = 100
    }

    const unit = Math.floor(plates.map(plate => {
        let price

        if (plate.thickness === thicknessFrame) {
          price = 10000 / (2000 * 600)
        } else if (plate.thickness === 25) {
          price = 5000 / (2000 * 600)
        } else if (plate.thickness === 17) {
          price = 2500 / (2000 * 600)
        } else if (plate.thickness === thicknessBack) {
          price = 1250 / (2000 * 600)
        } else {
          throw new Error(`invalid thickness: ${plate.thickness}`)
        }

        const plateWidth = Math.max(plate.width, plate.height)
        const plateHeight = Math.min(plate.width, plate.height)
        const materialWidth = 2000
        const materialHeight = 600
        const args = [plateWidth, plateHeight, materialWidth, materialHeight]
        const size = this.calculateSize(...args)

        return size.width * size.height * price
      })
      .reduce((memo, price) => memo += price, 0) * discount / 100 / 100) * 100

    const total = unit * input.amount

    return {
      unit,
      unitText: new Intl.NumberFormat().format(unit),
      total,
      totalText: new Intl.NumberFormat().format(total),
    }
  }

  calculateSize (plateWidth, plateHeight, materialWidth, materialHeight) {
    if (plateWidth > materialHeight || plateHeight > materialWidth / 2) {
      return {width: materialWidth, height: materialHeight}
    } else {
      return this.calculateSize(plateWidth, plateHeight, materialHeight, materialWidth / 2)
    }
  }
}

module.exports.PriceCalculator = PriceCalculator

const {Converter} = require('./Converter')

class SummaryMaker {
  constructor () {
    this.converter = new Converter()
  }

  async makeSummaryOrder (order, products) {
    const shipping = 0
    const fee = order.payment === '代金引換' ? 600 : 0
    const subtotal = this.calculateSubtotal(products) + shipping + fee
    const tax = this.calculateTax(subtotal)
    const total = subtotal + tax
    const amount = products.reduce((memo, product) => {
      return memo + parseInt(product.amount, 10)
    }, 0)

    return {
      shipping,
      shippingText: this.converter.formatNumber(shipping),
      fee,
      feeText: this.converter.formatNumber(fee),
      subtotal,
      subtotalText: this.converter.formatNumber(subtotal),
      tax,
      taxText: this.converter.formatNumber(tax),
      total,
      totalText: this.converter.formatNumber(total),
      amount,
      amountText: this.converter.formatNumber(amount),
    }
  }

  async makeSummaryQuestion (question, products) {
    return await this.makeSummaryBasic(products)
  }

  async makeSummaryEstimate (estimate, products) {
    return await this.makeSummaryBasic(products)
  }

  async makeSummaryBasic (products) {
    const subtotal = this.calculateSubtotal(products)
    const tax = this.calculateTax(subtotal)
    const total = subtotal + tax
    const amount = products.reduce((memo, product) => {
      return memo + parseInt(product.amount, 10)
    }, 0)

    return {
      subtotal,
      subtotalText: this.converter.formatNumber(subtotal),
      tax,
      taxText: this.converter.formatNumber(tax),
      total,
      totalText: this.converter.formatNumber(total),
      amount,
      amountText: this.converter.formatNumber(amount),
    }
  }

  calculateSubtotal (products) {
    return products.reduce((memo, product) => {
      return memo + product.price.total
    }, 0)
  }

  calculateTax (subtotal) {
    return Math.floor(subtotal * process.env.TAX_PERCENT / 100)
  }
}

module.exports.SummaryMaker = SummaryMaker
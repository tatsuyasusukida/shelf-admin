const {Converter} = require('./converter')

class SummaryMaker {
  constructor () {
    this.converter = new Converter()
  }

  async makeSummaryOrder (order, products) {
    const shipping = 0
    const fee = order.payment === '代金引換' ? 600 : 0
    const subtotal = shipping + fee + products.reduce((memo, product) => {
      return memo + product.price.total
    }, 0)

    const tax = Math.floor(subtotal * process.env.TAX_PERCENT / 100)
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
    const subtotal = products.reduce((memo, product) => {
      return memo + product.price.total
    }, 0)

    const tax = Math.floor(subtotal * process.env.TAX_PERCENT / 100)
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

  async makeSummaryEstimate (estimate, products) {
    const subtotal = products.reduce((memo, product) => {
      return memo + product.price.total
    }, 0)

    const tax = Math.floor(subtotal * process.env.TAX_PERCENT / 100)
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
}

module.exports.SummaryMaker = SummaryMaker
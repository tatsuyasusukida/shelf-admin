const bcrypt = require('bcryptjs')
const model = require('../model')
const {Finder} = require('./Finder')

class Validator {
  constructor () {
    this.finder = new Finder()
  }

  makeValidationIamSignin () {
    return {
      ok: null,
      username: {
        ok: null,
        isNotEmpty: null,
      },
      password: {
        ok: null,
        isNotEmpty: null,
        isAuthenticated: null,
      },
    }
  }

  async validateIamSignin (req) {
    const validation = this.makeValidationIamSignin()
    const {form} = req.body

    validation.username = this.validateFieldNotEmpty(form.username)
    validation.password.isNotEmpty = form.password !== ''

    if (validation.password.isNotEmpty) {
      validation.password.isAuthenticated = await this.isAuthenticated(req)
    }

    validation.password.ok = this.isValidField(validation.password)
    validation.ok = this.isValidRequest(validation)

    return validation
  }

  async isAuthenticated (req) {
    const {form} = req.body
    const admin = await this.finder.findAdminByUsername(form.username)

    if (!admin) {
      return false
    }

    const actual = req.body.form.password
    const expected = admin.password

    return await bcrypt.compare(actual, expected)
  }

  validateFieldNotEmpty (value) {
    const validation = {
      ok: null,
      isNotEmpty: null,
    }

    validation.isNotEmpty = value !== ''
    validation.ok = this.isValidField(validation)

    return validation
  }

  isValidRequest (validation) {
    return Object.keys(validation).every(key => {
      return key === 'ok' || validation[key].ok === true
    })
  }

  isValidField (validation) {
    return Object.keys(validation).every(key => {
      return key === 'ok' || validation[key] === true
    })
  }
}

module.exports.Validator = Validator

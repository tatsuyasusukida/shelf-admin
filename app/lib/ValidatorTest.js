const assert = require('assert')
const bcrypt = require('bcryptjs')
const {TestBase} = require('../util/TestBase')
const {Validator} = require('./Validator')

class ValidatorTest extends TestBase {
  async testMakeValidationIamSignin () {
    const validator = new Validator()
    const actual = await validator.makeValidationIamSignin()
    const expected = {
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

    assert.deepStrictEqual(actual, expected)
  }

  async testValidateIamSignin () {
    const validator = new Validator()

    validator.finder = {
      async findAdminByUsername (username, transaction) {
        return {
          password: await bcrypt.hash('password', 10),
        }
      },
    }

    const req = {
      body: {
        form: {
          username: 'username',
          password: 'password',
        },
      },
    }

    const actual = await validator.validateIamSignin(req)
    const expected = {
      ok: true,
      username: {
        ok: true,
        isNotEmpty: true,
      },
      password: {
        ok: true,
        isNotEmpty: true,
        isAuthenticated: true,
      },
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testIsAuthenticated () {
    const validator = new Validator()

    validator.finder = {
      async findAdminByUsername (username, transaction) {
        return {
          password: await bcrypt.hash('password', 10),
        }
      },
    }

    const req = {
      body: {
        form: {
          username: 'username',
          password: 'password',
        },
      },
    }

    const actual = await validator.isAuthenticated(req)
    const expected = true

    assert.deepStrictEqual(actual, expected)
  }

  async testValidateFieldNotEmpty () {
    const validator = new Validator()
    const value = 'not empty'
    const actual = await validator.validateFieldNotEmpty(value)
    const expected = {
      ok: true,
      isNotEmpty: true,
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testIsValidRequest () {
    const validator = new Validator()
    const validation = {
      ok: null,
      field1: {ok: true},
      field2: {ok: true},
      field3: {ok: true},
    }

    const actual = await validator.isValidRequest(validation)
    const expected = true

    assert.deepStrictEqual(actual, expected)
  }

  async testIsValidField () {
    const validator = new Validator()
    const validationField = {
      ok: null,
      isNotEmpty: true,
      isInteger: true,
    }

    const actual = await validator.isValidField(validationField)
    const expected = true

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new ValidatorTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.ValidatorTest = ValidatorTest

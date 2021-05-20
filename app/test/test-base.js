class TestBase {
  async run () {
    const {constructor} = this
    const className = constructor.name
    const propertyNames = Object.getOwnPropertyNames(constructor.prototype)
    const methodNames = propertyNames.filter(name =>  /^test/.test(name))
    const tests = []

    for (const methodName of methodNames) {
      try {
        await this[methodName]()
        tests.push({className, methodName, ok: true})
      } catch (err) {
        const {message, stack} = err
        const error = {message, stack}

        tests.push({className, methodName, ok: false, error})
      }
    }

    return tests
  }

  async print (logger) {
    logger = logger || console

    const tests = await this.run()

    for (const test of tests) {
      const {className, methodName, ok, error} = test

      if (ok) {
        logger.info(`PASS ${className}.${methodName}`)
      } else {
        logger.info(`FAIL ${className}.${methodName}`)
        logger.info(error.stack)
      }
    }
  }
}

module.exports.TestBase = TestBase

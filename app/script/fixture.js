const model = require('../model')
const winston = require('winston')
const {LoggerMaker} = require('../util/LoggerMaker')
const fixture = require('../test/fixture')

class Main {
  async run () {
    try {
      const loggerMaker = new LoggerMaker()

      winston.loggers.add('error', loggerMaker.makeLogger('error', 'json', 'fixture-error.log'))
      winston.loggers.add('warn', loggerMaker.makeLogger('warn', 'json', 'fixture-warn.log'))
      winston.loggers.add('info', loggerMaker.makeLogger('info', 'json', 'fixture-info.log'))
      winston.loggers.add('debug', loggerMaker.makeLogger('debug', 'json', 'fixture-debug.log'))
      winston.loggers.add('access', loggerMaker.makeLogger('info', 'raw', 'fixture-access.log'))
      winston.loggers.add('query', loggerMaker.makeLogger('info', 'json', 'fixture-query.log'))

      await model.sequelize.sync({force: true})
      await fixture()
    } finally {
      model.sequelize.close()
    }
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.error(err.stack)
  }
}

const path = require('path')
const morgan = require('morgan')
const winston = require('winston')
const express = require('express')
const helmet = require('helmet')

class App {
  constructor () {
    this.router = express()

    this.router.set('strict routing', true)
    this.router.set('views', path.join(__dirname, 'view'))
    this.router.set('view engine', 'pug')
    this.router.set('trust proxy', true)

    this.router.use(helmet())
    this.router.use(morgan(process.env.LOG_ACCESS, {
      stream: {
        write: message => {
          winston.loggers.get('access').info(message.trim())
        },
      },
    }))

    this.router.use(this.onRequestInitialize.bind(this))
    this.router.use('/static/', express.static(path.join(__dirname, 'static')))

    this.router.get('/', (req, res) => res.redirect('./private/'))
    this.router.get('/private/', (req, res) => res.render('static-page/private-home'))
    this.router.get('/private/order/', (req, res) => res.render('order/private-index'))
    this.router.get('/private/order/:orderId([0-9]+)/', (req, res) => res.render('order/private-view'))
    this.router.get('/private/order/:orderId([0-9]+)/print/', (req, res) => res.render('order/private-print'))
    this.router.get('/private/order/:orderId([0-9]+)/delete/', (req, res) => res.render('order/private-delete'))
    this.router.get('/private/order/delete/finish/', (req, res) => res.render('order/private-delete-finish'))

    this.router.use(this.onNotFound.bind(this))
    this.router.use(this.onInternalServerError.bind(this))
  }

  onListening () {
    winston.loggers.get('info').info(`Listening on ${process.env.PORT}`)
  }

  onRequest (req, res) {
    this.router(req, res)
  }

  onRequestInitialize (req, res, next) {
    res.locals.env = process.env

    next()
  }

  onNotFound (req, res) {
    res.status(404).end()
  }

  onInternalServerError (err, req, res, next) {
    res.status(500).end()
    this.onError(err)
  }

  onError (err) {
    winston.loggers.get('error').error(err.message)
    winston.loggers.get('debug').debug(err.stack)
  }
}

module.exports.App = App

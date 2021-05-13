const path = require('path')
const querystring = require('querystring')
const helmet = require('helmet')
const morgan = require('morgan')
const nocache = require('nocache')
const winston = require('winston')
const express = require('express')
const session = require('express-session')
const proxyMiddleware = require('proxy-middleware')
const MySQLStore = require('express-mysql-session')(session)
const model = require('./model')

class App {
  constructor () {
    this.session = session({
      cookie: {
        path: '/',
        httpOnly: true,
        secure: process.env.SESSION_SECURE === '1',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      },
      name: 'shelf_admin_session',
      resave: false,
      rolling: true,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      store: new MySQLStore({
        host: process.env.STORE_HOST,
        port: process.env.STORE_PORT,
        user: process.env.STORE_USER,
        password: process.env.STORE_PASSWORD,
        database: process.env.STORE_DATABASE,
      }),
    })

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
    this.router.use('/render/', proxyMiddleware(process.env.URL_RENDER))

    if (process.env.PROXY === '1') {
      this.router.use('/static/', proxyMiddleware('http://127.0.0.1:8081/'))
    } else {
      this.router.use('/static/', express.static(path.join(__dirname, 'static')))
    }

    this.router.get('/', (req, res) => res.render('static-page/public-home'))
    this.router.get('/public/layout/', (req, res) => res.render('static-page/public-layout'))
    this.router.get('/public/iam/signin/', (req, res) => res.render('iam/public-signin'))
    this.router.get('/public/iam/signout/finish/', (req, res) => res.render('iam/public-signout-finish'))

    this.router.get('/private/', (req, res) => res.render('static-page/private-home'))
    this.router.get('/private/layout/', (req, res) => res.render('static-page/private-layout'))
    this.router.get('/private/order/', (req, res) => res.render('order/private-index'))
    this.router.get('/private/order/:orderId([0-9]+)/', (req, res) => res.render('order/private-view'))
    this.router.get('/private/order/:orderId([0-9]+)/print/', (req, res) => res.render('order/private-print'))
    this.router.get('/private/order/:orderId([0-9]+)/delete/', (req, res) => res.render('order/private-delete'))
    this.router.get('/private/order/delete/finish/', (req, res) => res.render('order/private-delete-finish'))

    this.router.get('/private/question/', (req, res) => res.render('question/private-index'))
    this.router.get('/private/question/:questionId([0-9]+)/', (req, res) => res.render('question/private-view'))
    this.router.get('/private/question/:questionId([0-9]+)/print/', (req, res) => res.render('question/private-print'))
    this.router.get('/private/question/:questionId([0-9]+)/delete/', (req, res) => res.render('question/private-delete'))
    this.router.get('/private/question/delete/finish/', (req, res) => res.render('question/private-delete-finish'))

    this.router.get('/private/estimate/', (req, res) => res.render('estimate/private-index'))
    this.router.get('/private/estimate/:estimateId([0-9]+)/', (req, res) => res.render('estimate/private-view'))
    this.router.get('/private/estimate/:estimateId([0-9]+)/print/', (req, res) => res.render('estimate/private-print'))
    this.router.get('/private/estimate/:estimateId([0-9]+)/delete/', (req, res) => res.render('estimate/private-delete'))
    this.router.get('/private/estimate/delete/finish/', (req, res) => res.render('estimate/private-delete-finish'))

    this.router.get('/private/iam/signout/', (req, res) => res.render('iam/private-signout'))

    this.router.use('/api/v1/', nocache())
    this.router.use('/api/v1/', express.json())

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

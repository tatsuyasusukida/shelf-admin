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
const {Finder} = require('./lib/Finder')
const {Converter} = require('./lib/Converter')
const {Paginator} = require('./lib/Paginator')
const {Validator} = require('./lib/Validator')
const {Initializer} = require('./lib/Initializer')
const {SummaryMaker} = require('./lib/SummaryMaker')

class App {
  constructor () {
    this.finder = new Finder()
    this.converter = new Converter()
    this.paginator = new Paginator()
    this.validator = new Validator()
    this.initializer = new Initializer()
    this.summaryMaker = new SummaryMaker()

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
        socketPath: process.env.STORE_SOCKET,
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

    this.router.use('/private/', this.session)
    this.router.use('/private/', this.onRequestAuthenticate.bind(this))
    this.router.get('/private/', (req, res) => res.render('static-page/private-home'))
    this.router.get('/private/layout/', (req, res) => res.render('static-page/private-layout'))

    this.router.get('/private/order/', this.onRequestPrivateOrderIndex.bind(this))
    this.router.get('/private/order/', (req, res) => res.render('order/private-index'))
    this.router.use('/private/order/:orderId([0-9]+)/', this.onRequestFindOrder.bind(this))
    this.router.get('/private/order/:orderId([0-9]+)/', this.onRequestPrivateOrderView.bind(this))
    this.router.get('/private/order/:orderId([0-9]+)/', (req, res) => res.render('order/private-view'))
    this.router.get('/private/order/:orderId([0-9]+)/print/', (req, res) => res.render('order/private-print'))
    this.router.get('/private/order/:orderId([0-9]+)/delete/', (req, res) => res.render('order/private-delete'))
    this.router.get('/private/order/delete/finish/', (req, res) => res.render('order/private-delete-finish'))

    this.router.get('/private/question/', this.onRequestPrivateQuestionIndex.bind(this))
    this.router.get('/private/question/', (req, res) => res.render('question/private-index'))
    this.router.use('/private/question/:questionId([0-9]+)/', this.onRequestFindQuestion.bind(this))
    this.router.get('/private/question/:questionId([0-9]+)/', this.onRequestPrivateQuestionView.bind(this))
    this.router.get('/private/question/:questionId([0-9]+)/', (req, res) => res.render('question/private-view'))
    this.router.get('/private/question/:questionId([0-9]+)/print/', (req, res) => res.render('question/private-print'))
    this.router.get('/private/question/:questionId([0-9]+)/delete/', (req, res) => res.render('question/private-delete'))
    this.router.get('/private/question/delete/finish/', (req, res) => res.render('question/private-delete-finish'))

    this.router.get('/private/estimate/', this.onRequestPrivateEstimateIndex.bind(this))
    this.router.get('/private/estimate/', (req, res) => res.render('estimate/private-index'))
    this.router.use('/private/estimate/:estimateId([0-9]+)/', this.onRequestFindEstimate.bind(this))
    this.router.get('/private/estimate/:estimateId([0-9]+)/', this.onRequestPrivateEstimateView.bind(this))
    this.router.get('/private/estimate/:estimateId([0-9]+)/', (req, res) => res.render('estimate/private-view'))
    this.router.get('/private/estimate/:estimateId([0-9]+)/print/', (req, res) => res.render('estimate/private-print'))
    this.router.get('/private/estimate/:estimateId([0-9]+)/delete/', (req, res) => res.render('estimate/private-delete'))
    this.router.get('/private/estimate/delete/finish/', (req, res) => res.render('estimate/private-delete-finish'))

    this.router.get('/private/iam/signout/', (req, res) => res.render('iam/private-signout'))

    this.router.use('/api/v1/', nocache())
    this.router.use('/api/v1/', express.json())
    this.router.get('/api/v1/public/iam/signin/initialize', this.onRequestApiV1PublicIamSigninInitialize.bind(this))
    this.router.put('/api/v1/public/iam/signin/validate', this.onRequestApiV1PublicIamSigninValidate.bind(this))
    this.router.put('/api/v1/public/iam/signin/submit', this.session, this.onRequestApiV1PublicIamSigninSubmit.bind(this))
    this.router.use('/api/v1/private/', this.session)
    this.router.use('/api/v1/private/', this.onRequestAuthenticateApi.bind(this))
    this.router.delete('/api/v1/private/iam/signout/submit', this.onRequestApiV1PrivateIamSignoutSubmit.bind(this))

    this.router.use('/api/v1/private/order/:orderId([0-9]+)/', this.onRequestFindOrder.bind(this))
    this.router.get('/api/v1/private/order/:orderId([0-9]+)/print/initialize', this.onRequestApiV1PrivateOrderPrintInitialize.bind(this))
    this.router.delete('/api/v1/private/order/:orderId([0-9]+)/delete/submit', this.onRequestApiV1PrivateOrderDeleteSubmit.bind(this))

    this.router.use('/api/v1/private/question/:questionId([0-9]+)/', this.onRequestFindQuestion.bind(this))
    this.router.get('/api/v1/private/question/:questionId([0-9]+)/print/initialize', this.onRequestApiV1PrivateQuestionPrintInitialize.bind(this))
    this.router.delete('/api/v1/private/question/:questionId([0-9]+)/delete/submit', this.onRequestApiV1PrivateQuestionDeleteSubmit.bind(this))

    this.router.use('/api/v1/private/estimate/:estimateId([0-9]+)/', this.onRequestFindEstimate.bind(this))
    this.router.get('/api/v1/private/estimate/:estimateId([0-9]+)/print/initialize', this.onRequestApiV1PrivateEstimatePrintInitialize.bind(this))
    this.router.delete('/api/v1/private/estimate/:estimateId([0-9]+)/delete/submit', this.onRequestApiV1PrivateEstimateDeleteSubmit.bind(this))

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
    req.locals = {}
    res.locals.env = process.env
    res.locals.req = req
    res.locals.url = new URL(req.originalUrl, process.env.BASE_URL)

    next()
  }

  async onRequestAuthenticate (req, res, next) {
    try {
      const admin = await this.authenticate(req)

      if (admin) {
        req.locals.admin = admin
        next()
      } else {
        res.redirect('/public/iam/signin/')
      }
    } catch (err) {
      next(err)
    }
  }

  async onRequestAuthenticateApi (req, res, next) {
    try {
      const admin = await this.authenticate(req)

      if (admin) {
        req.locals.admin = admin
        next()
      } else {
        res.status(401).end()
      }
    } catch (err) {
      next(err)
    }
  }

  async authenticate (req) {
    if (process.env.DEMO_IS_ENABLED === '1') {
      return {}
    }

    const {adminId} = req.session

    if (adminId) {
      return await this.finder.findAdmin(adminId)
    }

    return null
  }

  async onRequestFindOrder (req, res, next) {
    try {
      const order = await this.finder.findOrder(req.params.orderId)

      if (!order) {
        res.status(404).end()
        return
      }

      req.locals.order = order
      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestFindQuestion (req, res, next) {
    try {
      const question = await this.finder.findQuestion(req.params.questionId)

      if (!question) {
        res.status(404).end()
        return
      }

      req.locals.question = question
      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestFindEstimate (req, res, next) {
    try {
      const estimate = await this.finder.findEstimate(req.params.estimateId)

      if (!estimate) {
        res.status(404).end()
        return
      }

      req.locals.estimate = estimate
      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestPrivateOrderIndex (req, res, next) {
    try {
      const current = parseInt(req.query.page || '1', 10)
      const limit = 20
      const {query} = req
      const orders = (await this.finder.findOrders(current, limit, query))
        .map(order => {
          return this.converter.convertOrder(order)
        })

      const count = await this.finder.countOrders(query)
      const page = this.paginator.makePage(count, limit, current)
      const pagination = this.paginator.makePagination(req.query, page)

      res.locals.orders = orders
      res.locals.page = page
      res.locals.pagination = pagination
      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestPrivateOrderView (req, res, next) {
    try {
      const order = this.converter.convertOrder(req.locals.order)
      const products = (await this.finder.findOrderProducts(order.id))
        .map(({product}, i) => {
          return this.converter.convertProduct(product, i + 1)
        })

      const args = [order, products]
      const summary = await this.summaryMaker.makeSummaryOrder(...args)

      res.locals.order = order
      res.locals.products = products
      res.locals.summary = summary

      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestPrivateQuestionIndex (req, res, next) {
    try {
      const current = parseInt(req.query.page || '1', 10)
      const limit = 20
      const {query} = req
      const questions = (await this.finder.findQuestions(current, limit, query))
        .map(question => {
          return this.converter.convertQuestion(question)
        })

      const count = await this.finder.countQuestions(query)
      const page = this.paginator.makePage(count, limit, current)
      const pagination = this.paginator.makePagination(req.query, page)

      res.locals.questions = questions
      res.locals.page = page
      res.locals.pagination = pagination
      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestPrivateQuestionView (req, res, next) {
    try {
      const question = this.converter.convertQuestion(req.locals.question)
      const products = (await this.finder.findQuestionProducts(question.id))
        .map(({product}, i) => {
          return this.converter.convertProduct(product, i + 1)
        })

      const args = [question, products]
      const summary = await this.summaryMaker.makeSummaryQuestion(...args)

      res.locals.question = question
      res.locals.products = products
      res.locals.summary = summary

      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestPrivateEstimateIndex (req, res, next) {
    try {
      const current = parseInt(req.query.page || '1', 10)
      const limit = 20
      const {query} = req
      const estimates = (await this.finder.findEstimates(current, limit, query))
        .map(estimate => {
          return this.converter.convertEstimate(estimate)
        })

      const count = await this.finder.countEstimates(query)
      const page = this.paginator.makePage(count, limit, current)
      const pagination = this.paginator.makePagination(req.query, page)

      res.locals.estimates = estimates
      res.locals.page = page
      res.locals.pagination = pagination
      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestPrivateEstimateView (req, res, next) {
    try {
      const estimate = this.converter.convertEstimate(req.locals.estimate)
      const products = (await this.finder.findEstimateProducts(estimate.id))
        .map(({product}, i) => {
          return this.converter.convertProduct(product, i + 1)
        })

      const args = [estimate, products]
      const summary = await this.summaryMaker.makeSummaryEstimate(...args)

      res.locals.estimate = estimate
      res.locals.products = products
      res.locals.summary = summary

      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PublicIamSigninInitialize (req, res, next) {
    try {
      const form = this.initializer.makeFormIamSignin()
      const validation = this.validator.makeValidationIamSignin()

      res.send({form, validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PublicIamSigninValidate (req, res, next) {
    try {
      const validation = await this.validator.validateIamSignin(req)

      res.send({validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PublicIamSigninSubmit (req, res, next) {
    try {
      const validation = await this.validator.validateIamSignin(req)

      if (!validation.ok) {
        res.status(400).end()
        return
      }

      const {username} = req.body.form
      const admin = await this.finder.findAdminByUsername(username)

      const ok = true
      const redirect = '../../../private/'

      req.session.adminId = admin.id
      res.send({ok, redirect})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateIamSignoutSubmit (req, res, next) {
    try {
      req.session.destroy()

      const ok = true
      const redirect = '../../../public/iam/signout/finish/'

      res.send({ok, redirect})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateOrderPrintInitialize (req, res, next) {
    try {
      const order = this.converter.convertOrder(req.locals.order)
      const products = (await this.finder.findOrderProducts(order.id))
        .map(({product}, i) => {
          return this.converter.convertProduct(product, i + 1)
        })

      res.send({order, products})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateOrderDeleteSubmit (req, res, next) {
    try {
      await req.locals.order.destroy()

      const ok = true
      const redirect = '../../delete/finish/'

      res.send({ok, redirect})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateQuestionPrintInitialize (req, res, next) {
    try {
      const question = this.converter.convertQuestion(req.locals.question)
      const products = (await this.finder.findQuestionProducts(question.id))
        .map(({product}, i) => {
          return this.converter.convertProduct(product, i + 1)
        })

      res.send({question, products})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateQuestionDeleteSubmit (req, res, next) {
    try {
      await req.locals.question.destroy()

      const ok = true
      const redirect = '../../delete/finish/'

      res.send({ok, redirect})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateEstimatePrintInitialize (req, res, next) {
    try {
      const estimate = this.converter.convertEstimate(req.locals.estimate)
      const products = (await this.finder.findEstimateProducts(estimate.id))
        .map(({product}, i) => {
          return this.converter.convertProduct(product, i + 1)
        })

      const args = [estimate, products]
      const summary = await this.summaryMaker.makeSummaryEstimate(...args)

      res.send({estimate, products, summary})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateEstimateDeleteSubmit (req, res, next) {
    try {
      await req.locals.estimate.destroy()

      const ok = true
      const redirect = '../../delete/finish/'

      res.send({ok, redirect})
    } catch (err) {
      next(err)
    }
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

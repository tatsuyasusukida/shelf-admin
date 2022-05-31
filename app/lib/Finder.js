const model = require('../model')
const {Op} = require('sequelize')

class Finder {
  async findAdmin (id, transaction) {
    return await model.admin.findOne({
      where: {
        id: {[Op.eq]: id},
      },
      transaction,
    })
  }

  async findAdminByUsername (username, transaction) {
    return await model.admin.findOne({
      where: {
        username: {[Op.eq]: username},
      },
      transaction,
    })
  }

  async findOrder (id, transaction) {
    return await model.order.findOne({
      where: {
        id: {[Op.eq]: id},
      },
      transaction,
    })
  }

  async findQuestion (id, transaction) {
    return await model.question.findOne({
      where: {
        id: {[Op.eq]: id},
      },
      transaction,
    })
  }

  async findEstimate (id, transaction) {
    return await model.estimate.findOne({
      where: {
        id: {[Op.eq]: id},
      },
      transaction,
    })
  }

  async findOrders (current, limit, query, transaction) {
    const where = this.makeWhereOrder(query)
    const offset = limit * (current - 1)

    return await model.order.findAll({
      where,
      order: [['date', 'desc']],
      limit,
      offset,
      transaction,
    })
  }

  async countOrders (query, transaction) {
    return await model.order.count({where: this.makeWhereOrder(query)})
  }

  makeWhereOrder (query) {
    if (query.keyword) {
      return {
        [Op.or]: {
          number: {[Op.like]: `%${query.keyword}%`},
          name: {[Op.like]: `%${query.keyword}%`},
          kana: {[Op.like]: `%${query.keyword}%`},
          company: {[Op.like]: `%${query.keyword}%`},
        },
      }
    }

    return {}
  }

  async findOrderProducts (orderId, transaction) {
    return (await model.orderProduct.findAll({
        where: {
          orderId: {[Op.eq]: orderId},
        },
        order: [['sort', 'asc']],
        include: [{model: model.product, as: 'product'}],
        transaction,
      }))
      .filter(({product}) => product !== null)
  }

  async findQuestions (current, limit, query, transaction) {
    const where = this.makeWhereQuestion(query)
    const offset = limit * (current - 1)

    return await model.question.findAll({
      where,
      order: [['date', 'desc']],
      limit,
      offset,
      transaction,
    })
  }

  async countQuestions (query, transaction) {
    return await model.question.count({where: this.makeWhereQuestion(query)})
  }

  makeWhereQuestion (query) {
    if (query.keyword) {
      return {
        [Op.or]: {
          number: {[Op.like]: `%${query.keyword}%`},
          name: {[Op.like]: `%${query.keyword}%`},
          kana: {[Op.like]: `%${query.keyword}%`},
          company: {[Op.like]: `%${query.keyword}%`},
        },
      }
    }

    return {}
  }

  async findQuestionProducts (questionId, transaction) {
     return (await model.questionProduct.findAll({
         where: {
           questionId: {[Op.eq]: questionId},
         },
         order: [['sort', 'asc']],
         include: [{model: model.product, as: 'product'}],
         transaction,
       }))
      .filter(({product}) => product !== null)
  }

  async findEstimates (current, limit, query, transaction) {
    const where = this.makeWhereEstimate(query)
    const offset = limit * (current - 1)

    return await model.estimate.findAll({
      where,
      order: [['date', 'desc']],
      limit,
      offset,
      transaction,
    })
  }

  async countEstimates (query, transaction) {
    return await model.estimate.count({where: this.makeWhereEstimate(query)})
  }

  makeWhereEstimate (query) {
    if (query.keyword) {
      return {
        [Op.or]: {
          number: {[Op.like]: `%${query.keyword}%`},
          name: {[Op.like]: `%${query.keyword}%`},
        },
      }
    }

    return {}
  }

  async findEstimateProducts (estimateId, transaction) {
    return (await model.estimateProduct.findAll({
        where: {
          estimateId: {[Op.eq]: estimateId},
        },
        order: [['sort', 'asc']],
        include: [{model: model.product, as: 'product'}],
        transaction,
      }))
      .filter(({product}) => product !== null)
  }
}

module.exports.Finder = Finder

const model = require('../model')
const {Op} = require('sequelize')

class Finder {
  async findAdminByUsername (username, transaction) {
    return await model.admin.findOne({
      where: {
        username: {[Op.eq]: req.body.form.username},
      },
      transaction
    })
  }
}

module.exports.Finder = Finder

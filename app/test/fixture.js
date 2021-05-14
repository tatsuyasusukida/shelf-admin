const model = require('../model')
const bcrypt = require('bcryptjs')

module.exports = async function () {
  await model.admin.create({
    id: 1,
    username: 'admin',
    password: await bcrypt.hash('password', 10),
    email: 'shelf@loremipsum.co.jp',
  })
}

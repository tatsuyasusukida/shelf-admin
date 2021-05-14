const model = require('../model')
const bcrypt = require('bcryptjs')

module.exports = async function () {
  await model.admin.create({
    id: 1,
    username: 'admin',
    password: await bcrypt.hash('password', 10),
    email: 'shelf@loremipsum.co.jp',
  })

  await model.order.create({
    id: 1,
    date: new Date(),
    number: '1111-2222-3333',
    name: 'ここにお名前が入ります',
    kana: 'ここにフリガナが入ります',
    company: '株式会社ロレムイプサム',
    zip: '9402039',
    address: '新潟県長岡市関原南4-3934',
    tel: '0258945233',
    email: 'shelf@loremipsum.co.jp',
    memo: [
      'ここにテキストが入ります。',
      'ここにテキストが入ります。',
      'ここにテキストが入ります。',
    ].join('\n'),
    payment: 'クレジットカード',
    price: 22000,
  })
}

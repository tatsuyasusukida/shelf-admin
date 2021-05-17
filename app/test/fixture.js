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

  await model.question.create({
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
    content: [
      'ここにテキストが入ります。',
      'ここにテキストが入ります。',
      'ここにテキストが入ります。',
    ].join('\n'),
    price: 22000,
  })

  await model.estimate.create({
    id: 1,
    date: new Date(),
    number: '20210517-001',
    name: '株式会社ロレムイプサム',
    title: '御中',
    subscribe: '受け取る',
    email: 'shelf@loremipsum.co.jp',
    price: 22000,
  })

  await model.product.create({
    id: 1,
    width: 15,
    height: 49,
    depth: 19,
    row: 1,
    thickness: 17,
    fix: 'ビス（固定）',
    back: 'なし',
    color: 'ナチュラル',
    amount: 1,
  })

  await model.orderProduct.create({
    sort: 1,
    orderId: 1,
    productId: 1,
  })

  await model.questionProduct.create({
    sort: 1,
    questionId: 1,
    productId: 1,
  })

  await model.estimateProduct.create({
    sort: 1,
    estimateId: 1,
    productId: 1,
  })
}

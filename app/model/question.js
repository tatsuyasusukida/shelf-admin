module.exports = function (sequelize, DataTypes) {
  const question = sequelize.define('question', {
    date: {type: DataTypes.DATE, allowNull: false},
    number: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    kana: {type: DataTypes.STRING, allowNull: false},
    company: {type: DataTypes.STRING, allowNull: false},
    zip: {type: DataTypes.STRING, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    tel: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    content: {type: DataTypes.TEXT, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
  })

  return question
}

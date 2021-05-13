module.exports = function (sequelize, DataTypes) {
  const orderProduct = sequelize.define('orderProduct', {
    sort: {type: DataTypes.INTEGER, allowNull: false},
  })

  orderProduct.associate = function (model) {
    orderProduct.belongsTo(model.order, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
    orderProduct.belongsTo(model.product, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
  }

  return orderProduct
}

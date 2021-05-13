module.exports = function (sequelize, DataTypes) {
  const cartProduct = sequelize.define('cartProduct', {
    date: {type: DataTypes.DATE, allowNull: false},
  })

  cartProduct.associate = function (model) {
    cartProduct.belongsTo(model.cart, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
    cartProduct.belongsTo(model.product, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
  }

  return cartProduct
}

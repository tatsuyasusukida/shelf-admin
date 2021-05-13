module.exports = function (sequelize, DataTypes) {
  const cartEstimate = sequelize.define('cartEstimate', {})

  cartEstimate.associate = function (model) {
    cartEstimate.belongsTo(model.cart, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
    cartEstimate.belongsTo(model.estimate, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
  }

  return cartEstimate
}

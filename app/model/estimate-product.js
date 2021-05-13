module.exports = function (sequelize, DataTypes) {
  const estimateProduct = sequelize.define('estimateProduct', {
    sort: {type: DataTypes.INTEGER, allowNull: false},
  })

  estimateProduct.associate = function (model) {
    estimateProduct.belongsTo(model.estimate, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
    estimateProduct.belongsTo(model.product, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
  }

  return estimateProduct
}

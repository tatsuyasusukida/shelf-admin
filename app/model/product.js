module.exports = function (sequelize, DataTypes) {
  const product = sequelize.define('product', {
    width: {type: DataTypes.INTEGER, allowNull: false},
    height: {type: DataTypes.INTEGER, allowNull: false},
    depth: {type: DataTypes.INTEGER, allowNull: false},
    row: {type: DataTypes.INTEGER, allowNull: false},
    thickness: {type: DataTypes.INTEGER, allowNull: false},
    fix: {type: DataTypes.STRING, allowNull: false},
    back: {type: DataTypes.STRING, allowNull: false},
    color: {type: DataTypes.STRING, allowNull: false},
    amount: {type: DataTypes.INTEGER, allowNull: false},
  })

  return product
}

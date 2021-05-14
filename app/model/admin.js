module.exports = function (sequelize, DataTypes) {
  const admin = sequelize.define('admin', {
    username: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
  })

  return admin
}

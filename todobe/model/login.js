const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Login = sequelize.define('login', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    min:6
  },
  role: {
    type: DataTypes.ENUM('admin', 'assigner', 'user'), // Restricts values to these roles
    allowNull: false,
    defaultValue: 'assigner',
  },
});

module.exports = Login;
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Todo = sequelize.define('todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assignedTo: {
    type: DataTypes.INTEGER, // Assuming `User` IDs are integers
    allowNull: true,
  },
  assigner: {
    type: DataTypes.INTEGER, // User ID of the assigner
    allowNull: true,
  },
});

module.exports = Todo;
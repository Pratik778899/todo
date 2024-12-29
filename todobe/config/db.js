const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    database: 'todo',
    username: 'root',
    password: '7809',
    host: 'localhost',
    port: '3306',
    logging: false // Disable logging
});

module.exports = sequelize;
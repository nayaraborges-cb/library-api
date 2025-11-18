const { sequelize } = require('./db');
const { Sequelize } = require('sequelize');

module.exports = {
  development: {
    username: sequelize.config.username,
    password: sequelize.config.password,
    database: sequelize.config.database,
    host: sequelize.config.host,
    dialect: 'postgres',
  }
};

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false, // Set to true if you want to see SQL queries in the console
});

module.exports = sequelize;
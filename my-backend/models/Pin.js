const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pin = sequelize.define('Pin', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  category: DataTypes.STRING,
  link: DataTypes.STRING,
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Pin;
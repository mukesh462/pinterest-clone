const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Board = sequelize.define('Board', {
  name: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  coverImage: DataTypes.STRING,
});

module.exports = Board;
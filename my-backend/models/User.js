const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, unique: true },
  bio: DataTypes.TEXT,
  avatar: DataTypes.STRING,
  website: DataTypes.STRING,
  location: DataTypes.STRING,
});

module.exports = User;
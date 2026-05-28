const sequelize = require('../config/database');
const User = require('./User');
const Pin = require('./Pin');
const Board = require('./Board');
const { DataTypes } = require('sequelize');

const Like = sequelize.define('Like', {
  userId: DataTypes.INTEGER,
  pinId: DataTypes.INTEGER,
});

const Comment = sequelize.define('Comment', {
  text: { type: DataTypes.TEXT, allowNull: false },
  userId: DataTypes.INTEGER,
  pinId: DataTypes.INTEGER,
});

const BoardPin = sequelize.define('BoardPin', {
  boardId: DataTypes.INTEGER,
  pinId: DataTypes.INTEGER,
});

const Follower = sequelize.define('Follower', {
  followerId: DataTypes.INTEGER,
  followingId: DataTypes.INTEGER,
});

User.hasMany(Pin, { foreignKey: 'userId' });
Pin.belongsTo(User, { foreignKey: 'userId', as: 'author' });

User.hasMany(Board, { foreignKey: 'userId' });
Board.belongsTo(User, { foreignKey: 'userId' });

Pin.hasMany(Like, { foreignKey: 'pinId' });
Like.belongsTo(Pin, { foreignKey: 'pinId' });
Like.belongsTo(User, { foreignKey: 'userId' });

Pin.hasMany(Comment, { foreignKey: 'pinId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Board.belongsToMany(Pin, { through: BoardPin, foreignKey: 'boardId' });
Pin.belongsToMany(Board, { through: BoardPin, foreignKey: 'pinId' });

User.belongsToMany(User, { through: Follower, as: 'followers', foreignKey: 'followingId', otherKey: 'followerId' });
User.belongsToMany(User, { through: Follower, as: 'following', foreignKey: 'followerId', otherKey: 'followingId' });

module.exports = { sequelize, User, Pin, Board, Like, Comment, BoardPin, Follower };
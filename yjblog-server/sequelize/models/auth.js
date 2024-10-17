'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    static associate(models) {
      // 定义关联
    }
  }
  Auth.init({
    uid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'superadmin'),
      defaultValue: 'user',
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'auth',
    tableName: 'auth',
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        unique: true,
        fields: ['username'],
      },
    ],
  });
  return Auth;
};
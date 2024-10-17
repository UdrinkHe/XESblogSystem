'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('auth', {
      uid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastLoginAt: {
        type: Sequelize.DATE,
      },
      role: {
        type: Sequelize.ENUM('user', 'admin', 'superadmin'),
        defaultValue: 'user',
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 创建索引
    await queryInterface.addIndex('auth', ['email'], {
      unique: true,
    });
    await queryInterface.addIndex('auth', ['username'], {
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('auth');
  }
};
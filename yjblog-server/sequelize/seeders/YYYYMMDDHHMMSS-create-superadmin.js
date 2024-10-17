'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('22256695zxc', 10);
    
    await queryInterface.bulkInsert('auth', [{
      uid: 1,
      username: 'hyj',
      email: '13825427942@163.com',
      password: hashedPassword,
      lastLoginAt: new Date(),
      status: 'active',
      role: 'superadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('auth', { username: 'hyj' }, {});
  }
};
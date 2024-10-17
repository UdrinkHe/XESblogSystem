'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('todo_lists', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });

    await queryInterface.addColumn('scheduleInfos', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('todo_lists', 'userId');
    await queryInterface.removeColumn('scheduleInfos', 'userId');
  }
};
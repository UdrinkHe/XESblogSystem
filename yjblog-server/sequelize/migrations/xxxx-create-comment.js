'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Comments', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            postId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            appraise: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            parentId: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,//1:正常，-1:删除
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Comments');
    }
};

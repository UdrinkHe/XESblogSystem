'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Posts', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            appraise: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            viewCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },  
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            tag: {
                type: Sequelize.STRING,//array进行 JSON.stringify()
                allowNull: false,
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,//0:草稿，-1:删除,1:发布
            },
            collection: {//收藏数
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Posts');
    }
};

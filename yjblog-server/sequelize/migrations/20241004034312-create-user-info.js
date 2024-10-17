'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('userInfo', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, // 使用 UUID 生成器
                primaryKey: true,
                allowNull: false,
            },
            authId: {
                type: DataTypes.INTEGER, // 将 authId 改为 INTEGER 类型
                allowNull: false,
                unique: true, // 确保 authId 唯一
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sex: {
                type: DataTypes.ENUM('男', '女', '其他'), // 限制值为男、女或其他
                allowNull: false,
            },
            selfIntroduction: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            region: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            birthDay: {
                type: DataTypes.DATEONLY, // 只存储日期
                allowNull: true,
            },
            profileUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(),
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(),
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('userInfo');
    }
};

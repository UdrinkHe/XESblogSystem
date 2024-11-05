'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class collectionFolder extends Model {
        static associate(models) {
            // 定义关联关系（如果需要）
        }
    }
    collectionFolder.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '默认',
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fatherId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        authId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'collection_folder',
        tableName:'collection_folder'
    });
    return collectionFolder;
};

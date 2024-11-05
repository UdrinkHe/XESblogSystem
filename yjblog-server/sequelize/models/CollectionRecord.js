'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CollectionRecord extends Model {
        static associate(models) {
            // 现有的关联
            CollectionRecord.belongsTo(models.Post, {
                foreignKey: 'postId', // CollectionRecord 中的 postId
                targetKey: 'id', // Post 中的 id
                as: 'Post' // 关联别名
            });
        }
    }
    CollectionRecord.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        folderId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
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
        modelName: 'CollectionRecord',
        tableName: 'collection_record',
    });
    return CollectionRecord;
};

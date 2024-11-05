'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            // 现有的关联
            Post.hasMany(models.CollectionRecord, {
                foreignKey: 'postId', // CollectionRecord 中的 postId
                sourceKey: 'id', // Post 中的 id
                as: 'CollectionRecords' // 关联别名
            });
        }
    }
    Post.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        appraise: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        viewCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,//0:草稿，-1:删除,1:发布
        },
        collection: {//收藏数
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
    });
    return Post;
};

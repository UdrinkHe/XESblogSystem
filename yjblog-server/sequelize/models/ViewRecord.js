'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ViewRecord extends Model {
        static associate(models) {
            // 定义关联关系（如果需要）
        }
    }
    ViewRecord.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
        modelName: 'view_record',
    });
    return ViewRecord;
};

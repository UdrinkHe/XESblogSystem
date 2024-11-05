'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserInfo = sequelize.define('UserInfo', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // 使用 UUID 生成器
            primaryKey: true,
            allowNull: false,
        },
        authId: {
            type: DataTypes.INTEGER, // authId 字段类型为 INTEGER
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
    }, {
        tableName: 'userinfo', // 指定表名
        timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
    });

    return UserInfo;
};

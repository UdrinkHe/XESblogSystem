module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        appraise: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,//1:正常，-1:删除
        },
    },
    {
        tableName: 'comments',
    }
);

    return Comment;
};

module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
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
    },
    {
        tableName: 'posts',
    }
);

    return Post;
};

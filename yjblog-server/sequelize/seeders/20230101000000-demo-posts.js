'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const nums = 1000; // 生成的文章数量
        const posts = [];

        for (let n = 1; n <= nums; n++) {
            posts.push({
                id : uuidv4(),
                title: `第${n}个文章`,
                content: `这是第${n}个文章的内容。`, // 随便取值
                tag: JSON.stringify(['示例标签']), // 随便取值
                userId: 1,
                status: 1,
                createdAt: new Date(new Date().setDate(new Date().getDate() + n)), // 按照顺序区分
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert('Posts', posts, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Posts', null, {});
    }
};

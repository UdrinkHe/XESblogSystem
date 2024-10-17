'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const todoItems = [];
    const tasks = [
      { name: '扫地', description: '用吸尘器清洁客厅和卧室的地板', labels: ['家务', '清洁'] },
      { name: '做饭', description: '准备晚餐，包括炒青菜和煮米饭', labels: ['烹饪', '日常'] },
      { name: '学习JavaScript', description: '阅读《你不知道的JavaScript》第三章并做笔记', labels: ['编程', '自我提升'] },
      { name: '健身', description: '去健身房进行30分钟有氧运动和30分钟力量训练', labels: ['运动', '健康'] },
      { name: '写周报', description: '总结本周工作进展，列出下周计划', labels: ['工作', '总结'] },
      { name: '修理自行车', description: '更换自行车的刹车片和调整变速器', labels: ['维修', '兴趣'] },
      { name: '学习英语', description: '背诵50个新单词，并用它们造句', labels: ['语言', '学习'] },
      { name: '整理衣柜', description: '清理不再穿的衣服，整理剩下的衣物', labels: ['整理', '家务'] },
      { name: '给植物浇水', description: '给阳台和室内的所有植物浇水和施肥', labels: ['园艺', '日常'] },
      { name: '准备演讲', description: '为下周的公司会议准备5分钟的项目进展演讲', labels: ['工作', '演讲'] }
    ];

    for (let i = 0; i < 100; i++) {
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      const startDate = new Date(2023, 8, 1); // 2023年9月1日
      const endDate = new Date(2024, 10, 30); // 2024年11月30日
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      
      todoItems.push({
        uid: uuidv4(),
        name: randomTask.name,
        description: randomTask.description,
        dateEnd: randomDate.toISOString().slice(0, 19).replace('T', ' '),
        isFin: Math.random() < 0.5,
        label: JSON.stringify(randomTask.labels),
        userId: 1, // 添加 userId，这里设置为 1
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('todo_lists', todoItems, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('todo_lists', null, {});
  }
};
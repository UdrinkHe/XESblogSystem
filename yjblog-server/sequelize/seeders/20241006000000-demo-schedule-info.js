'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const scheduleInfos = [];
    const startDate = new Date('2024-01-02');
    const endDate = new Date('2024-10-07');

    const scheduleTemplates = [
      {
        name: "项目开发日程",
        tasks: [
          { start: '09:00', end: '10:30', name: "晨会与任务分配", description: "讨论昨日进度，分配今日任务" },
          { start: '11:00', end: '12:30', name: "编码时间", description: "专注于核心功能开发" },
          { start: '14:00', end: '15:30', name: "代码审查", description: "团队成员互相审查代码" },
          { start: '16:00', end: '17:30', name: "测试与调试", description: "进行单元测试和bug修复" }
        ]
      },
      {
        name: "产品设计日程",
        tasks: [
          { start: '09:30', end: '11:00', name: "用户需求分析", description: "整理和分析用户反馈" },
          { start: '11:30', end: '13:00', name: "原型设计", description: "创建低保真原型" },
          { start: '14:30', end: '16:00', name: "设计评审", description: "与团队讨论设计方案" },
          { start: '16:30', end: '18:00', name: "用户界面设计", description: "细化高保真界面设计" }
        ]
      },
      {
        name: "市场营销日程",
        tasks: [
          { start: '08:30', end: '10:00', name: "市场趋势分析", description: "研究最新市场动态" },
          { start: '10:30', end: '12:00', name: "营销策略制定", description: "根据分析结果制定策略" },
          { start: '13:30', end: '15:00', name: "内容创作", description: "编写营销文案和设计宣传材料" },
          { start: '15:30', end: '17:00', name: "社交媒体管理", description: "更新各平台内容并与用户互动" }
        ]
      },
      {
        name: "客户服务日程",
        tasks: [
          { start: '08:00', end: '09:30', name: "客服团队晨会", description: "回顾昨日问题，分配今日工作" },
          { start: '10:00', end: '12:00', name: "处理客户反馈", description: "回应客户邮件和电话" },
          { start: '13:30', end: '15:00', name: "客户满意度调查", description: "进行电话回访和数据分析" },
          { start: '15:30', end: '17:00', name: "客服培训", description: "提升团队服务技能" }
        ]
      },
      {
        name: "财务规划日程",
        tasks: [
          { start: '09:00', end: '10:30', name: "财务报表审核", description: "检查月度财务报表" },
          { start: '11:00', end: '12:30', name: "预算会议", description: "与各部门讨论预算分配" },
          { start: '14:00', end: '15:30', name: "成本分析", description: "分析并优化公司成本结构" },
          { start: '16:00', end: '17:30', name: "投资策略规划", description: "评估潜在投资机会" }
        ]
      },
      {
        name: "人力资源日程",
        tasks: [
          { start: '09:30', end: '11:00', name: "招聘面试", description: "进行候选人面试" },
          { start: '11:30', end: '13:00', name: "员工培训", description: "组织新员工入职培训" },
          { start: '14:30', end: '16:00', name: "绩效评估", description: "进行季度绩效回顾" },
          { start: '16:30', end: '18:00', name: "团队建设活动", description: "策划公司团建活动" }
        ]
      },
      {
        name: "研发创新日程",
        tasks: [
          { start: '08:30', end: '10:00', name: "创新头脑风暴", description: "讨论新产品和技术创意" },
          { start: '10:30', end: '12:00', name: "技术可行性分析", description: "评估新技术的实施可能性" },
          { start: '13:30', end: '15:30', name: "原型开发", description: "构建创新概念的初步原型" },
          { start: '16:00', end: '17:30', name: "专利申请准备", description: "整理创新成果，准备专利文件" }
        ]
      },
      {
        name: "质量控制日程",
        tasks: [
          { start: '08:00', end: '09:30', name: "质量指标审查", description: "回顾上周质量数据" },
          { start: '10:00', end: '11:30', name: "产品抽检", description: "随机抽样检查产品质量" },
          { start: '13:00', end: '14:30', name: "流程优化讨论", description: "分析并改进生产流程" },
          { start: '15:00', end: '16:30', name: "质量培训", description: "对生产人员进行质量意识培训" }
        ]
      },
      {
        name: "供应链管理日程",
        tasks: [
          { start: '09:00', end: '10:30', name: "供应商评估", description: "审核主要供应商的表现" },
          { start: '11:00', end: '12:30', name: "库存管理", description: "优化库存水平和周转率" },
          { start: '14:00', end: '15:30', name: "物流规划", description: "制定高效的物流配送策略" },
          { start: '16:00', end: '17:30', name: "成本控制会议", description: "讨论降低供应链成本的方案" }
        ]
      },
      {
        name: "法务合规日程",
        tasks: [
          { start: '09:30', end: '11:00', name: "合同审核", description: "审查和修订商业合同" },
          { start: '11:30', end: '13:00', name: "法律风险评估", description: "分析公司运营中的法律风险" },
          { start: '14:30', end: '16:00', name: "知识产权保护", description: "制定知识产权保护策略" },
          { start: '16:30', end: '18:00', name: "合规培训", description: "对员工进行法律合规培训" }
        ]
      },
      {
        name: "企业战略规划日程",
        tasks: [
          { start: '08:30', end: '10:00', name: "市场分析", description: "分析行业趋势和竞争格局" },
          { start: '10:30', end: '12:00', name: "战略目标制定", description: "设定公司长期发展目标" },
          { start: '13:30', end: '15:00', name: "资源配置规划", description: "优化公司资源分配" },
          { start: '15:30', end: '17:00', name: "战略沟通会", description: "向管理层传达战略计划" }
        ]
      },
      {
        name: "数据分析日程",
        tasks: [
          { start: '09:00', end: '10:30', name: "数据收集与清理", description: "整理和预处理分析数据" },
          { start: '11:00', end: '12:30', name: "统计分析", description: "进行深度数据挖掘和分析" },
          { start: '14:00', end: '15:30', name: "可视化报告制作", description: "创建数据可视化图表和报告" },
          { start: '16:00', end: '17:30', name: "分析结果展示", description: "向相关部门汇报分析洞见" }
        ]
      },
      {
        name: "客户关系管理日程",
        tasks: [
          { start: '09:30', end: '11:00', name: "客户数据分析", description: "分析客户行为和需求趋势" },
          { start: '11:30', end: '13:00', name: "客户沟通策略制定", description: "设计个性化客户沟通方案" },
          { start: '14:30', end: '16:00', name: "客户忠诚度项目", description: "规划和实施客户忠诚度计划" },
          { start: '16:30', end: '18:00', name: "客户反馈处理", description: "解决客户投诉和建议" }
        ]
      }
    ];

    for (let i = 0; i < 100; i++) {
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const dateStr = randomDate.toISOString().split('T')[0];

      const template = scheduleTemplates[Math.floor(Math.random() * scheduleTemplates.length)];
      const hourlyTasks = template.tasks.map(task => ({
        ...task,
        uid: uuidv4(),
        hourlyTaskDescription: task.description
      }));

      scheduleInfos.push({
        name: `${template.name} - ${dateStr}`,
        uid: uuidv4(),
        dateStr: dateStr,
        hourlyTask: JSON.stringify(hourlyTasks),
        userId: 1, // 添加 userId，这里设置为 1
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('scheduleInfos', scheduleInfos, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('scheduleInfos', null, {});
  }
};
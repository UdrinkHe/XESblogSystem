'use strict';

// 导入必要的模块
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
// 获取当前环境,默认为'development'
const env = process.env.NODE_ENV || 'development';
// 根据环境加载对应的数据库配置
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
// 根据配置创建Sequelize实例
if (config.use_env_variable) {
  // 如果配置中指定了环境变量,则使用环境变量中的数据库连接字符串
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // 否则使用配置文件中的数据库连接信息
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 读取models目录下的所有模型文件
fs
  .readdirSync(__dirname)
  .filter(file => {
    // 过滤出.js文件,排除index.js和测试文件
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    // 导入每个模型文件
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // 将模型添加到db对象中
    db[model.name] = model;
  });

// 设置模型之间的关联关系
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 将sequelize实例和Sequelize类添加到db对象中
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 导出db对象
module.exports = db;

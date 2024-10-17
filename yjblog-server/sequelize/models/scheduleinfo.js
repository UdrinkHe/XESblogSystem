'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class scheduleInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  scheduleInfo.init({
    name: DataTypes.STRING,
    uid: DataTypes.STRING,
    dateStr: DataTypes.STRING,
    hourlyTask: DataTypes.TEXT('long'),
    userId: DataTypes.INTEGER // 添加 userId 字段
  }, {
    sequelize,
    modelName: 'scheduleInfos',
  });
  return scheduleInfo;
};
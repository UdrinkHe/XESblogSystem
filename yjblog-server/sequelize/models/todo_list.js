'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class todo_list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  todo_list.init({
    name: DataTypes.STRING,
    dateEnd: DataTypes.STRING,
    label: DataTypes.STRING,
    isFin: DataTypes.BOOLEAN,
    uid: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER // 添加 userId 字段
  }, {
    sequelize,
    modelName: 'todo_list',
  });
  return todo_list;
};
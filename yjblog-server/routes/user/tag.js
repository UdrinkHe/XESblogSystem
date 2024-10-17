var express = require('express');
var router = express.Router();
const {Tag} = require('../../sequelize/models')
const { v4: uuidv4 } = require('uuid');

//判断是否存在tag标签，不存在则创建
async function hasTag (name){
    if(!(await Tag.findOne({where:{name}}))){
        const date = new Date();
        await Tag.create({name,id:uuidv4(),createTime:date,updateTime:date});
    }
}  

module.exports = {router,hasTag};

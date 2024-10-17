const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { todo_list } = require('../../sequelize/models');
const { v4: uuidv4 } = require('uuid');
const dataResult =require('../utils/dataResult')


// 创建待办事项
router.post('/create', async (req, res) => {
  try {
    req.body.uid = uuidv4()
    req.body.label = JSON.stringify(req.body.label)
    req.body.dateEnd  = dataResult.dateToStr(req.body.dateEnd)
    const todoItem = await todo_list.create(req.body);
    res.status(201).json(todoItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message)
  }
});

// 读取待办事项(支持多条件查询)
router.post('/read', async (req, res) => {
  try {
    const where = {};
    const { uid, name, isFin, dateSelected, label ,userId} = req.body;
    if (uid) where.uid = uid;
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (isFin !== null && isFin !== undefined) where.isFin = isFin;
    //if (dateEnd) where.dateEnd = { [Op.lte]: new Date(dateEnd) };
    if (label) where.label = { [Op.like]: `%${label}%` };
    if (userId) where.userId = userId;
    if (dateSelected) where.dateEnd = {[Op.like]: `%${dateSelected}%`};
    const todoItems = await todo_list.findAll({ where , order:[['dateEnd','DESC']]});
    for(let i = 0;i<todoItems.length;i++){
      todoItems[i].label = JSON.parse(todoItems[i].label)
    }
    res.send(todoItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 更新待办事项
router.post('/update', async (req, res) => {
  try {
    req.body.dateEnd = dataResult.dateToStr(req.body.dateEnd)
    req.body.label = JSON.stringify(req.body.label)
    const [updated] = await todo_list.update(req.body, {
      where: { uid: req.body.uid }
    });
    if (updated) {
      const updatedTodoItem = await todo_list.findOne({ where: { uid: req.body.uid } });
      res.json(updatedTodoItem);
    } else {
      res.status(404).json({ error: '待办事项未找到' });
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message });
  }
});

// 删除待办事项
router.post('/delete', async (req, res) => {
  try {
    const deleted = await todo_list.destroy({
      where: { uid: req.body.uid }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: '待办事项未找到' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
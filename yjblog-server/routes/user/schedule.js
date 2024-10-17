var express = require('express');
var router = express.Router();
const { scheduleInfos } = require('../../sequelize/models')
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

/* GET users listing. */
router.post('/create', async function(req, res) {//插入数据
  try{
    let valueToAdd = req.body
    valueToAdd.uid = uuidv4()
    valueToAdd.hourlyTask.forEach(item=>{
      item.uid = uuidv4()
    })
    valueToAdd.hourlyTask = JSON.stringify(valueToAdd.hourlyTask)
    let nowDate = new Date()
    valueToAdd.createdAt = nowDate
    valueToAdd.updatedAt = nowDate
    await scheduleInfos.create(valueToAdd)
    res.status(201).json(valueToAdd)
  }
  catch(err){
    console.log(err)
  }
});

router.post('/read', async function(req, res) {
  try {
    const {  sortBy = 'dateStr', sortOrder = 'DESC' ,userId,whichDate} = req.body;
    
    const whereClause = {};
    if(userId){
      whereClause.userId = userId
    } 
    if(whichDate){
      whereClause.dateStr = {[Op.like]: `%${whichDate}%`}
    }
    const schedules = await scheduleInfos.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
    });
    schedules.forEach(item => {
      item.hourlyTask = JSON.parse(item.hourlyTask)
    })
    res.status(200).json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '查询数据时发生错误' });
  }
});

router.post('/update', async function(req, res) {
  try {
    const { uid, ...updateData } = req.body;
    
    if (updateData.hourlyTask) {
      updateData.hourlyTask.forEach(item=>{
        if(item.uid === null){
          item.uid = uuidv4()
        }
      }) 
      updateData.hourlyTask = JSON.stringify(updateData.hourlyTask);
    }
    updateData.updatedAt = new Date();

    const [updatedRowsCount, updatedSchedules] = await scheduleInfos.update(updateData, {
      where: { uid: uid },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: '未找到要更新的日程' });
    }

    res.status(200).json(updatedSchedules[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '更新数据时发生错误' });
  }
});

router.post('/delete', async function(req, res) {
  try {
    const { uid , userId } = req.body;
    
    const deletedRowsCount = await scheduleInfos.destroy({
      where: { uid: uid , userId: userId}
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: '未找到要删除的日程' });
    }

    res.status(200).json({ message: '日程已成功删除' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '删除数据时发生错误' });
  }
});

module.exports = router;

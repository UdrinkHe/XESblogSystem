var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer'); // 引入 multer
const {hasTag} = require('./tag')
const {Post} = require('../../sequelize/models');
const { Op } = require('sequelize');

// 设置 multer 存储配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images/postImg')); // 保存路径
    },
    filename: (req, file, cb) => {
        const randomName = uuidv4();
        cb(null, `${randomName}.jpg`); // 文件名
    }
});

const upload = multer({ storage }); // 创建 multer 实例

// 处理 post 逻辑

// 处理用户上传的图片，返回图片的 url
router.post('/uploadImage', upload.single('img'), (req, res) => {
    const url = `http://111.229.128.182:30001/public/images/postImg/${req.file.filename}`; // 获取文件名
    res.status(200).json({ url }); // 返回文件的 URL
});
//删除图片
router.post('/deleteImage', (req, res) => {
    const { fileName } = req.body;
    const filePath = path.join(__dirname, `../../public/images/postImg/${fileName}`);
    fs.unlinkSync(filePath);
    res.status(200).json({ message: '图片删除成功' });
});

/**文章操作 */
//增添
router.post('/create',async (req,res)=>{
    let {title,content,tag,userId,status} = req.body;//status 0 草稿 1 发布
    //tag 是字符串数组，检查tag中是否存在同名标签，不存在则添加
    for(let tagName of tag){
        await hasTag(tagName);
    }
    tag = JSON.stringify(tag);
    const date = new Date();
    const id = uuidv4();
    await Post.create({title,content,tag,userId,id,createAt:date,updateAt:date,status});
    res.status(200).json({message:'创建成功',id});
})
//读取
router.post('/read',async (req,res)=>{
    if(req.body.option == 'getOne'){
        const {id} = req.body;
        const post = await Post.findOne({where:{id}});
        post.tag = JSON.parse(post.tag);
        res.status(200).json({message:'读取成功',post : post});
    }
    else if(req.body.option == 'getList'){
        const { title, date, userId ,status,pageSize} = req.body;
        let { page } = req.body;
        // 构建查询条件
        const whereConditions = {
            userId: userId, // 根据 userId 过滤
            status,
        }
        // 如果传入了 title，则添加到查询条件
        if (title) {
            whereConditions.title = {
                [Op.like]: `%${title}%`, // 使用模糊匹配
            };
        }
        // 如果传入了 date，则添加到查询条件
        if (date) {
            const startDate = new Date(date + '-01'); // 获取该月的第一天
            const endDate = new Date(date + '-01'); 
            endDate.setMonth(endDate.getMonth() + 1); // 获取下个月的第一天
            whereConditions.createdAt = {
                [Op.gte]: startDate, // 大于等于该月的第一天
                [Op.lt]: endDate, // 小于下个月的第一天
            };
        }
        // 计算总数
        const totalNum = await Post.count({where:whereConditions});
        // 计算最大页数
        const maxPage = Math.ceil(totalNum / pageSize);
        if(page > maxPage && maxPage > 0){
            page = maxPage;
        }
        // 查询 posts 表
        const post = await Post.findAll({
            where: whereConditions,
            order: [['createdAt', 'DESC']], // 按创建时间降序排序
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });

        res.status(200).json({ message: '读取成功', post,pageInfo:{page,pageSize,totalNum,maxPage} });
    }
})
//修改
router.post('/update',async (req,res)=>{
    const {id,title,content,status} = req.body;//status 0 草稿 1 发布
    console.log(req.body.status);
    let { tag } = req.body;
    const date = new Date();
    let changeValue = {};
    if(title) changeValue.title = title;
    if(content) changeValue.content = content;
    if(tag){
        for(let tagName of tag){
            await hasTag(tagName);
        }
        tag = JSON.stringify(tag);
        changeValue.tag = tag;
    }
    if(status !== null && status !== undefined && typeof status === 'number'){
        changeValue.status = status;
        console.log('status:'+status);
    }
    changeValue.updateAt = date;
    console.log(changeValue)
    console.log(id)
    await Post.update(changeValue,{where:{id}});
    res.status(200).json({message:'修改成功'});
})  

//删除
router.post('/delete',async (req,res)=>{
    const {id} = req.body;
    await Post.update({status:-1},{where:{id}});
    res.status(200).json({message:'删除成功'});
})
//点赞和观看数

module.exports = router;

var express = require('express');
var router = express.Router();
const { CollectionRecord:collectionRecord,collection_folder:collectionFolder,Post} = require('../../sequelize/models')
const { v4: uuidv4 } = require('uuid')
const { Op } = require('sequelize');
//文章的收藏夹和收藏部分逻辑
//新建用户的时候创建一个默认收藏夹
const createDefaultFolder = async function (authId){
    await collectionFolder.create({id:uuidv4(),authId,name:'默认',description:'默认收藏夹',fatherId:null,createdAt:new Date(),updatedAt:new Date()})
}
//文件夹查询、创建、删除、修改
router.post('/read',async(req,res)=>{
    const {folderId} = req.body
    if(folderId) //指定查询一个
    {
        try{
            const data = await collectionFolder.findOne({where:{id:folderId}})
            res.status(200).json(data)
            return
        }catch(err){
            res.status(500).json({message:err.message})
            return
        }
    }
    async function getSonFolder(authId,fatherResult){
        let result = []
        for(let i=0;i<fatherResult.length;i++){
            let sonResult = await collectionFolder.findAll({where:{authId,fatherId:fatherResult[i].id},order:[['createdAt','ASC']]})
            if(sonResult.length>0){
                fatherResult[i].dataValues.sonFolder = await getSonFolder(authId,sonResult)
                result.push(fatherResult[i].dataValues)
            }
            else{
                result.push(fatherResult[i].dataValues)
            }
        }
        return result
    }
    try{
        //根据父文件夹id遍历查询
        const { authId } = req.body
        let result = []
        //按时间顺序升序
        const data = await collectionFolder.findAll({where:{authId,fatherId:null},order:[['createdAt','ASC']]})
        //从第一层父开始遍历查询
        result = await getSonFolder(authId,data)
        console.log(result)
        res.status(200).json(result)
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
router.post('/create',async(req,res)=>{
    try{
        const {authId,name,description,fatherId} = req.body
        if(fatherId === null || fatherId){ //判断faherId所在的文件夹是否存在同名文件
            const data = await collectionFolder.findAll({where:{authId,name,fatherId}})
            if(data.length>0){
                res.status(201).json({message:'存在同名文件夹'})
            }
            else{
                let data = await collectionFolder.create({id:uuidv4(),authId,name,description,fatherId})
                res.status(200).json(data.dataValues)
            }
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
router.post('/delete',async(req,res)=>{
    try{
        const {authId,id} = req.body
        //删除文件夹下的所有子文件夹和文章
        //查找所有以该文件夹为父文件夹的文件夹
        const sonFolder = await collectionFolder.findAll({where:{authId,fatherId:id}})
        if(sonFolder.length>0){
            for(let i=0;i<sonFolder.length;i++){
                await deletePostInFolder(sonFolder[i].dataValues.id)
            }
        }
        await deletePostInFolder(id)
        res.status(200).json({message:'删除成功'})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
router.post('/update',async(req,res)=>{
    try{
        const {id,name,description,fatherId} = req.body //fatherId默认和文件夹原来的fatherId相同，但是文件迁移时不同
        //先检目标父级文件夹下是否存在同名文件夹
        const data = await collectionFolder.findOne({where:{fatherId,name}})
        if(data){
            res.status(201).json({message:'存在同名文件夹'})
        }
        else{
            await collectionFolder.update({name,description,fatherId},{where:{id}})
            res.status(200).json({message:'修改成功'})
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
//文件夹中收藏、删除
//收藏文章
const collectionAPost = async function (folderId,postId,authId){
    const data = await collectionRecord.create({id:uuidv4(),folderId,postId,authId})
    return data.dataValues
}
router.post('/post/create',async(req,res)=>{
    try{
        const {folderNameStr,postId,authId} = req.body
        //folderNameStr 形式为 "folder1/folder2/folder3"
        const folderNameArr = folderNameStr.split('/')
        let folderId = null
        let data = null
        let fatherId = null
        for(let i=0;i<folderNameArr.length;i++){
            data = await collectionFolder.findOne({where:{authId,name:folderNameArr[i],fatherId}})
            if(data){
                fatherId = data.dataValues.id
                folderId = data.dataValues.id
            }
            else{
                res.status(201).json({message:'文件夹不存在'})
                return
            }
        }
        const resultMain = await collectionAPost(folderId,postId,authId)
        res.status(200).json({message:'收藏成功',resultId:resultMain.id})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
//删除一个文件夹中的所有收藏记录和文件夹本身
const deletePostInFolder = async function (folderId){
    await collectionRecord.destroy({where:{folderId}})
    await collectionFolder.destroy({where:{id:folderId}})
}

router.post('/post/read',async(req,res)=>{ //查询一个文件夹中的所有收藏记录
    try{
        const {folderId,pageSize,searchValue} = req.body
        let {nowPage} = req.body
        let sonWhere = null
        if(searchValue){
            sonWhere = {
                title: {
                    [Op.like]: `%${searchValue}%`, // 使用模糊匹配
                }
            }
        }
        where = {
            where:{folderId},
            order: [['createdAt', 'DESC']],
             limit: pageSize,
             offset: (nowPage - 1) * pageSize,
            include: [{
                model:Post,
                as:'Post',
                attributes: ['id', 'title'],
                required: true,
                where: sonWhere
            }]
        }
        const count = await collectionRecord.count(where);
        console.log(count)
        if(nowPage*pageSize>count && count>0){
            nowPage = Math.ceil(count/pageSize)
            where.offset = (nowPage - 1) * pageSize
        }
        const data = await collectionRecord.findAll(where)
        // 处理结果
        let result = data.map(record => ({
            id: record.id,
            postId: record.Post.id,
            title: record.Post.title
        }));
        res.status(200).json({result,nowPage,count})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
router.post('/post/readOneForAuth',async(req,res)=>{ //查询用户是否收藏了这个文章
    try{
        const {postId,authId} = req.body
        const data = await collectionRecord.findOne({where:{postId,authId}})
        if(data){
            res.status(200).json(data.dataValues)
        }
        else{
            res.status(201).json(false)
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

router.post('/post/delete',async(req,res)=>{ //删除一个文件夹中的一个收藏记录
    try{
        const {id} = req.body
        await collectionRecord.destroy({where:{id}})
        res.status(200).json({message:'删除成功'})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})


module.exports = {
    createDefaultFolder,
    router
}
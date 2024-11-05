const express = require('express');
const router = express.Router();
const { UserInfo } = require('../../sequelize/models');
const {v4: uuidv4} = require('uuid')
const multer = require('multer')
const path = require('path')

// 创建用户信息
const createUserWhenRegister= async function (username,authId) {
    try {
        const id = uuidv4()
        const userInfoData = await UserInfo.create({name:username,authId,id,sex:'其他',profileUrl:'http://111.229.128.182:30001/public/images/userProfile/noProfile.jpg'});
    } catch (error) {
        console.log(error)
    }
}

const getUserInfo = async function (authId){
    try {
        console.log('authId为:'+authId)
        const userInfoData = await UserInfo.findOne({where:{authId}})
        return userInfoData
    } catch (error) {
        console.log(error)
    }
}
// 设置 multer 存储配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images/userProfile')); // 保存路径
    },
    filename: (req, file, cb) => {
        const randomName = uuidv4();
        cb(null, `${randomName}.jpg`); // 文件名
    }
});

const upload = multer({ storage }); // 创建 multer 实例

router.post('/updateUserProfile',upload.single('avatar'),async function (req,res){
    try {
        const authId = req.body.authId
        const url = `http://111.229.128.182:30001/public/images/userProfile/${req.file.filename}`; // 获取文件名
        await UserInfo.update({profileUrl:url},{where:{authId}})
        res.status(200).json({profileUrl:url})
    } catch (error) {
        console.log(error)
    }
})

router.post('/read',async function(req,res){
    try {
        if(req.body.option === 'getOne'){
            const authId = req.body.authId
            const userInfo = await getUserInfo(authId)
            res.status(200).json({userInfo})
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = {
    createUserWhenRegister : createUserWhenRegister,
    getUserInfo : getUserInfo,
    router
}
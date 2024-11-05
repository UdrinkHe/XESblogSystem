const JWT_SECRET = process.env.JWT_SECRET;

var express = require('express');
var router = express.Router();
var { auth } = require('../../sequelize/models')
var {createUserWhenRegister,getUserInfo} = require('./userInfo')
var {createDefaultFolder} = require('./postCollection')


const crypto = require('crypto');
const nodemailer = require('nodemailer');
const NodeCache = require('node-cache');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

/**
 * 用于用户登录、注册、邮箱验证发送、token验证
 */
// 创建一个新的缓存实例,设置验证码10分钟后过期
const codeCache = new NodeCache({ stdTTL: 600 });

// 配置邮件传输器
const transporter = nodemailer.createTransport({
  host: 'smtp.163.com', // 替换为您的SMTP服务器
  port: 25,
  secure: false, // 如果使用SSL/TLS,设为true
  auth: {
    user: '13825427942@163.com', // 替换为您的邮箱
    pass: 'DSenqEpaYqkxpzsw' // 替换为您的密码或应用专用密码
  }
});
//用户请求邮箱验证码
router.post('/send-verification-code',async function (req, res) {  
    try{
        const { email } = req.body;
        
        // 生成6位数字验证码
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        // 将验证码存储在缓存中,以用户邮箱为键
        if(!codeCache.get(email)||codeCache.getTtl(email)<=0){//如果缓存中没有该邮箱的验证码，或者验证码已过期，则重新生成并存储
            codeCache.set(email, verificationCode);
            await sendVerificationEmail(email, verificationCode);  
            res.status(200).json({message:'验证码已发送到您的邮箱'})
        }
        else{
            res.status(201).json({message:'验证码已发送，请稍后再试'})
        }
    }
    catch(error){
        res.status(500).json({message:'发送验证码失败，请稍后重试'})
    }
})

// 发送验证邮件的函数
async function sendVerificationEmail(email, code) {
  try {
    const mailOptions = {
      from: '“博客系统" 13825427942@163.com>',
      to: email,
      subject: '邮箱验证',
      text: `您的验证码是: ${code},有效期为10分钟，请尽快完成注册`,
      html: `<b>您的验证码是: ${code}</b>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('邮件发送成功:', info.messageId);
  } catch (error) {
    console.error('邮件发送失败:', error);
  }
}

// 处理验证码并完成注册
router.post('/register', async function (req, res) {
    try{
        const {username,email, code } = req.body;
        password = await bcrypt.hash(req.body.password,10)
        if(verifyEmail(email, code)){
             const newAuth = await auth.create({
                username,
                password,
                email,
                lastLoginAt:new Date(),
                role:'user',
                status:'active',
                createdAt:new Date(),
                updatedAt:new Date()
            })
            await createUserWhenRegister(username,newAuth.uid)//创建新的用户信息
            await createDefaultFolder(newAuth.uid)//创建默认收藏夹
            res.status(200).json({message:'注册成功'})
        }
        else{
            res.status(400).json({message:'验证失败，请稍后重试'})
        }
    }
    catch(error){
        res.status(500)
        console.log(error)
    }
})

// 验证邮箱的函数
function verifyEmail(email,code) {
  
  // 从缓存中获取存储的验证码
  const storedCode = codeCache.get(email);
  
  if (!storedCode || storedCode !== code) {
    return false;
  }
  codeCache.del(email);//删除缓存中的验证码
  // 验证成功,更新用户状态
  return true
}



// 修改登录路由
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 从auth表中查找用户
    const user = await auth.findOne({ where: { username } });

    console.log(user)

    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 使用bcrypt.compare验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 密码验证成功，更新最后登录时间
    await user.update({ lastLoginAt: new Date() });

    // 生成JWT令牌
    const token = jwt.sign(
      { username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' } // 令牌2小时后过期
    );

    res.json({ 
      message: '登录成功', 
      user: { 
        uid: user.uid, 
        username: user.username,
        role: user.role,
        email: user.email
      },
      token: token // 将生成的令牌添加到响应中
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加验证 token 的中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401).json({message:'未登录'});
  console.log(token)
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err){
      console.log('token错误111')
      return res.sendStatus(401).json({message:'token错误'});
    } 
    req.user = user;
    next();
  });
};

// 添加一个受保护的路由示例
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: '这是受保护的路由', user: req.user });
});

//通过token获取用户信息
router.post('/getUserInfo',authenticateToken,async (req,res)=>{
  //先用jwt解析token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  let user = jwt.verify(token,JWT_SECRET)
  //再用用户名查找用户信息
  const userInfo = await auth.findOne({where:{username:user.username}})
  const {uid,username,email,role,status,lastLoginAt} = userInfo
  const userBaseInfo = await getUserInfo(uid)
  res.status(200).json({message:'获取用户信息成功',userInfo:{uid,username,email,role,status,lastLoginAt},userBaseInfo})
})
// 修改导出部分
module.exports = {
  router: router,
  authenticateToken: authenticateToken
};
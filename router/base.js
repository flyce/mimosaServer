const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config');
const redisClient = require('../database/redis');

const router = express.Router();

const User = require('../models/User');

router.post('/login', function (req, res, next) {
    // 用户名和密码不能为空
    if (!(req.body.username && req.body.password)) {
        res.send({info: "用户名和密码是必要参数"});
    }

    /***
     * 1. 数据库获取已经保存的密码
     * 2. 验证密码是否正确
     * 3. 签发TOKEN
     */

    const username = req.body.username.toLowerCase();
    User.findOne({username, active: true}).then(
        (userInfo) => {
            if (userInfo) {
                bcrypt.compare(req.body.password, userInfo.password).then(
                    (result) => {
                        if (result) {
                            const token = jwt.sign(
                            {
                                userId: userInfo._id,
                                admin: userInfo.admin,
                                username: userInfo.username
                            },
                            config.secretKey,
                            {
                                expiresIn: config.expiresIn
                            }
                            );

                            redisClient.set(userInfo._id.toString(), token, "EX", config.expiresIn);
                            const { name, _id } = userInfo;
                            User.update({username}, {$set: {lastLogin: Date.now()}}).then((doc, err) => {
                            });
                            res.json({
                                success: true,
                                _id,
                                name,
                                token
                            });  
                        } else {
                            res.send({
                                success: false,
                                info: "用户名或密码错误"
                            });
                        }
                    }
                );
            } else {
                res.send({
                    success: false,
                    info: "用户不存在或未激活"
                });
            }
        }
    );
});

/**
 * 注册
 * 不管提交多少数据，只保存 models/User Scheme 里包含 required 规则的字段
 * 需要加入邮箱判断用户是否存在，邮箱不可重复
 */
router.post('/register', function (req, res, next) {
    console.log(req.body);
    User.findOne({username: req.body.username}).then(
        (doc, err) => {
            if(!err) {
                if(doc) {
                    res.json({
                        success: false,
                        info: '用户已存在，请跟换用户名后尝试'
                    });
                } else {
                    console.log("!");
                    bcrypt.hash(req.body.password, config.saltRounds).then(
                        (hashPassword) => {
                            req.body.password = hashPassword;
                            req.body.username = req.body.username.toLowerCase();
                            User.create(req.body).then(
                                (userInfo) => {
                                    console.log(userInfo);
                                    res.json({
                                        success: true,
                                        info: '注册成功，等待管理员审核之后即可登录，请注意查收邮件'
                                    });
                                }
                            )
                        }
                    );
                }
            } else {
                res.json({
                    success: false,
                    info: '内部错误 请联系管理员'
                });
            } 
        }
    )
});

module.exports = router;

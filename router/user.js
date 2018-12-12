const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const config = require('../config');
const User = require('../models/User');
const redisClient = require('../database/redis');

// db curd
const Update = require('../utils/curd').Update;

// feedback
const Note = require('../utils/feedback');

/**
 * 更新用户密码
 * 要求 _id token 需要更新的 key: value => name: "Wang"
 */
router.post('/update/password', (req, res, next) => {
    if(req.body.password) {
        bcrypt.hash(req.body.password, config.saltRounds).then(
            (hashPassword) => {
                Update(User, {key: {_id: req.headers["_id"]}, content: {password: hashPassword}})
                .then((result, err) => {
                    if(!err) {
                        Note(res, true, "修改成功");
                    } else {
                        Note(res, false, "内部错误，请联系管理员！");
                    }
                }); 
            }
        );
    } else {
        res.json({
            success: false,
            info: "无效的请求"
        });
    }
});

/**
 * 注销登录 要求 _id token
 * 判断合法则清除 redis 数据库里的 key: value => _id: token
 */
router.get('/logout', (req, res, next) => {
    redisClient.get(req.headers["_id"], (err, token) => {
        if(!err) {
            if (req.headers["auth"] === token) {
                redisClient.del(req.headers["_id"]);
                Note(res, true, "注销成功")
            } else {
                Note(res, false, "无效的token");
            }
        } else {
            Note(res, false, '内部错误，请联系管理员！');
        }
    });
});

module.exports = router;
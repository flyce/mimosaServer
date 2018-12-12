const redisClient = require('../database/redis');
const config = require('../config');
const jwt = require('jsonwebtoken');

/***
 * 验证 TOKEN 合法性
 * 1. 判断HEADER是否携带 TOKEN
 * 2. 验证 TOKEN 合法性
 *   2.1 合法， 与保存在redis的进行对比，对比通过，身份认证合法
 *   2.2 不合法，判断错误原因是否为过期，如果是 验证TOKEN与redis保存的是否一致，一致则通过认证
 * @param req
 * @param res
 * @param next
 */
function verifyToken(req, res, next) {
    const auth = req.headers['auth'];
    const _id = req.headers['_id']; 
    if (!auth) {
        res.json({
            success: false,
            info: "Authorization is required!"
        });
    } else {
        jwt.verify(auth, config.secretKey, function (err, decoded) {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    let time = new Date(err.expiredAt).getTime() - new Date().getTime();
                    time = Math.abs(Math.round(time / 1000));
                    if (time < config.refreshTime) {
                        redisClient.get(decoded.userId, function (err, data) {
                            if (err) {
                                res.json(err);
                            } else {
                                if (auth === data) {
                                    // 签发新的 TOKEN
                                    const token = jwt.sign(
                                        {
                                            userId: decoded.userId,
                                            admin: decoded.admin
                                        },
                                        config.secretKey,
                                        {
                                            expiresIn: config.expiresIn
                                        }
                                    );
                                    redisClient.set(decoded.userId, token);
                                    req.token = token;
                                    next();
                                } else {
                                    res.json({
                                        success: false,
                                        info: '无效Token 请注销后重新登录'
                                    });
                                }
                            }
                        });
                    } else {
                        res.json({
                            success: false,
                            info: 'Token过期 请注销后重新登录'
                        });
                    }
                } else {
                    res.json({
                        success: false,
                        info: '无效Token 请注销后重新登录'
                    });
                }
            } else {
                // 验证用户提交的是否与数据库保存的一致
                redisClient.get(decoded.userId, function (err, data) {
                    if (err) {
                        res.json(err);
                    } else {
                        if (auth === data) {
                            req.headers["_id"] = decoded.userId;
                            req.headers["admin"] = decoded.admin;
                            req.headers["username"] = decoded.username;
                            next();
                        } else {
                            res.json({
                                info: '登录过期 请注销后重新登录'
                            });
                        }
                    }
                });
            }
        });

    }
}

module.exports = verifyToken;
function verifyAdmin(req, res, next) {
    if(req.headers["admin"]) {
        next();
    } else {
        res.json({
            success: false,
            info: "没有权限"
        });
    }
}

module.exports = verifyAdmin;
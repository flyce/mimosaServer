const Note = (res, flag, infoOrData) => {
    if (flag) {
        res.json({
            success: true,
            data: infoOrData
        })
    } else {
        res.json({
            success: false,
            info: infoOrData
        })
    }
}

module.exports = Note;
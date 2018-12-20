// feedback
const note = require('../utils/feedback');

const Create = (Model, res, payload) => {
    Model.create(payload).then(
        (data, err) => {
            if(!err) {
                note(res, true, data);
            } else {
                note(res, false, '内部错误，请联系管理员');
            }
        }
    );
};

const Remove = (Model, res, payload) => {
    Model.deleteOne(payload).then(
        (data, err) => {
            if(!err) {
                note(res, true, data);
            } else {
                note(res, false, '内部错误，请联系管理员');
            }
        }
    );
};

/***
 * Query database
 * date format
 * {
 *   key: {_id: id},
 *   skip: '0',
 *   limit: '10',
 *   sort: {license: 1}
 * }
 */
const Find = (Model, res, payload) => {
    Model.find({...payload.key})
    .skip(parseInt(payload.skip) * 10 || 0)
    .limit(parseInt(payload.limit) || 10)
    .sort({...payload.sort}).then(
        (data, err) => {
            if(!err) {
                note(res, true, data);
            } else {
                note(res, false, '内部错误，请联系管理员');
            }
        }
    );
};

const Update = (Model, res, payload) => {
    Model.updateOne({...payload.key}, {$set: {...payload.content}}).then(
        (data, err) => {
            if(!err) {
                note(res, true, data);
            } else {
                note(res, false, '内部错误，请联系管理员');
            }
        }
    );
};

module.exports = {
    Create, Remove, Find, Update
};
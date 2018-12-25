const express = require('express');
const router = express.Router();

const XLSX = require('xlsx');

const multer  = require('multer');
const  storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, req.headers['username'] + '-' + new Date().toLocaleDateString().replace(/\//g, '-') + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// db curd
const Update = require('../utils/curd').Update;
const Create = require('../utils/curd').Create;
const Find = require('../utils/curd').Find;
const Remove = require('../utils/curd').Remove;

// feedback
const note = require('../utils/feedback');

// Model
const Flight = require('../models/Flight');

router.get('/', (req, res, next) => {
    const date = req.query.date || new Date().getFullYear() + '-' + Number(new Date().getMonth() + 1) + '-' + new Date().getDate();
    Find(Flight, res, {key: {userId: req.headers["_id"], date }});
});

// const createDemoDate = {
//     "flightNo": "DR6573",
//     "date": "2018-12-11",
//     "models": "B737",
//     "tail": "B6109",
//     "start": "沈阳",
//     "end": "兰州",
//     "plannedDeparture": "07:20",
//     "plannedArrived": "10:25",
//     "estimatedArrived": "10:34",
//     "status": "起飞",
//     "delayTime": "3"
// };
router.post('/', (req, res, next) => {
    Create(Flight, res, {
        userId: req.headers["_id"],
        ...req.body,
    });
});

router.post('/update', (req, res, next) => {
    const { _id } = req.body;
    delete req.body._id;
    Update(Flight, res, {key: {_id}, content: req.body});
});

router.post('/delete', (req, res, next) => {
    Remove(Flight, res, {_id: req.body._id});
});

router.post('/upload', upload.single('flight'), (req, res, err) => {
    if (req.file) {
        const fileType = req.file.originalname.split('.').pop().toLowerCase();
        if(fileType === "xlsx" || fileType === "xls") {
            const sheetData = XLSX.readFile(req.file.path).Sheets["航班列表"];
            if ("X" !== sheetData['!ref'].split(":")[1].match(/[A-Z]+/)[0]) {
                note(res, false, "请按照上传模版，除了添加数据外，不要修改表格格式");
            } else {
                const tableLength = sheetData['!ref'].split(":")[1].match(/\d+/)[0];
                let flights = [];
                for (let index = 2; index < tableLength; index++) {
                    flights.push({
                        flightNo: sheetData['C' + index].w,
                        airlines: sheetData['D' + index].w,
                        status: sheetData['E' + index].w,
                        tail: sheetData['G' + index].w,
                        position: sheetData['H' + index].w,
                        models: sheetData['I' + index].w,
                        plannedDeparture: sheetData['K' + index].w,
                        estimatedDeparture: sheetData['L' + index].w,
                        actualDeparture: sheetData['M' + index].w,
                        plannedArrived: sheetData['N' + index].w,
                        estimatedArrived: sheetData['O' + index].w,
                        actualArrived: sheetData['P' + index].w,
                        date: sheetData['X' + index].w,
                        userId: req.headers["_id"]
                    });
                }
                Create(Flight, res, flights);
                // note(res, true, flights);
            }
        } else {
            note(res, false,  "请不要上传非EXCEL文件");
        }

    } else {
        note(res, false, "未接收到文件，请重试");
    }
});

router.get('/peopleDemoDate', (req, res, next) => {
   res.json({
       success: true,
       data: [{
           category: "放行人员",
           grade: 'release',
           userList: [
               {id: 'release1', name: '何纯'},
               {id: 'release2', name: '葛慧斌'},
               {id: 'release3', name: '高建峰'},
               {id: 'release4', name: '郭嘉良'},
               {id: 'release5', name: '邹国丞'},
               {id: 'release6', name: '彭森虎'},
               {id: 'release7', name: '柯建江'},
               {id: 'release8', name: '杨小涛'},
               {id: 'release9', name: '程龙'},
               {id: 'release10', name: '孔祥杰'}
           ]
       },  {
           category: "技术员",
           grade: 'technician',
           userList: [
               {id: 'technician1', name: '徐飞'},
               {id: 'technician2', name: '周旋'},
               {id: 'technician3', name: '邹懿春'},
               {id: 'technician4', name: '沈方方'},
               {id: 'technician5', name: '杨天星'},
               {id: 'technician6', name: '黄艺勇'},
               {id: 'technician7', name: '康国伟'}
           ]
       }, {
           category: "机械员",
           grade: 'mechanic',
           userList: [
               {id: 'mechanic1', name: '李相聪'},
               {id: 'mechanic2', name: '舒建'},
               {id: 'mechanic3', name: '向益'},
               {id: 'mechanic4', name: '何文敏'},
               {id: 'mechanic5', name: '蔡宇恒'},
               {id: 'mechanic6', name: '杨成键'},
               {id: 'mechanic7', name: '李珺'},
               {id: 'mechanic8', name: '刘阳'}
           ]
       }, {
           category: "勤务员",
           grade: 'attendant',
           userList: [
               {id: 'attendant1', name: '孟凡智'},
               {id: 'attendant2', name: '赵朋山'},
               {id: 'attendant3', name: '梁紫丰'},
               {id: 'attendant4', name: '孙赛'},
               {id: 'attendant5', name: '朱毅初'},
               {id: 'attendant6', name: '杨钦'},
               {id: 'attendant7', name: '王全峰'},
               {id: 'attendant8', name: '张家恒'},
               {id: 'attendant9', name: '薛树勇'},
               {id: 'attendant10', name: '刘震'},
               {id: 'attendant11', name: '韦永朝'},
               {id: 'attendant12', name: '陈新云'},
               {id: 'attendant13', name: '廖树成'},
               {id: 'attendant14', name: '李泽昀'}
           ]
       }, {
           category: "学员",
           grade: 'trainees',
           userList: [
               {id: 'trainees1', name: '学员1'}
           ]
       }]
   });
});

module.exports = router;
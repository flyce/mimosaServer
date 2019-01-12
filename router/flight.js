const express = require('express');
const router = express.Router();
const path = require('path');
const iconv = require('iconv-lite');

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

function getPeopleName(peopleArray) {
    let names = '';
    const length = peopleArray.length;
    peopleArray.map((people, index) => {
        names = names + people.name + '、';
    });
    return names.substr(0, names.lastIndexOf('、'));
}

// db curd
const Update = require('../utils/curd').Update;
const Create = require('../utils/curd').Create;
const Find = require('../utils/curd').Find;
const Remove = require('../utils/curd').Remove;

// feedback
const note = require('../utils/feedback');

// Model
const Flight = require('../models/Flight');

const isEmpty = content => content ? content.v : null;

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
        if(fileType === 'csv') {
            const sheetData = XLSX.readFile(req.file.path).Sheets.Sheet1;
            if ("AF" !== sheetData['!ref'].split(":")[1].match(/[A-Z]+/)[0]) {
                note(res, false, "请按照上传模版，除了添加数据外，不要修改表格格式");
            } else {
                const tableLength = sheetData['!ref'].split(":")[1].match(/\d+/)[0];
                let flights = [];
                for (let index = 2; index < tableLength; index++) {
                    if(sheetData['B' + index]) {
                        if(sheetData['B' + index].v.match(/DR/) || sheetData['B' + index].v.match(/QD/)) {
                            flights.push({
                                flightNo: sheetData['B' + index].v,
                                airlines: iconv.decode(sheetData['D' + index].v, 'gbk'),
                                status: sheetData['E' + index] ?  iconv.decode(sheetData['E' + index].v, 'gbk') : null,
                                tail: sheetData['G' + index].v,
                                position: isEmpty(sheetData['H' + index]),
                                models: sheetData['I' + index].v,
                                plannedArrived: sheetData['N' + index].v,
                                estimatedArrived: isEmpty(sheetData['O' + index]),
                                actualArrived: isEmpty(sheetData['P' + index]),
                                plannedDeparture: isEmpty(sheetData['AA' + index]),
                                estimatedDeparture: isEmpty(sheetData['AB' + index]),
                                actualDeparture: isEmpty(sheetData['AC' + index]),
                                date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
                                userId: req.headers["_id"]
                            });
                        }
                    }
                }
                Create(Flight, res, flights);
            }
        } else {
            note(res, false,  "请不要上传非EXCEL文件");
        }

    } else {
        note(res, false, "未接收到文件，请重试");
    }
});

router.get('/export', (req, res, next) => {
    const date = req.query.date || new Date().getFullYear() + '-' + Number(new Date().getMonth() + 1) + '-' + new Date().getDate();
    Flight.find({userId: req.headers["_id"], date }).then((flights, err) => {
        if(!err) {
            const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };

            let dataArray = [{}, {
                key: '序号',
                flightNo: '航班号',
                category: '类别',
                airlines: '航线',
                tail: '飞机号',
                position: '停机位',
                plannedArrived: '进港时间',
                plannedDeparture: '离港时间',
                people: '人员安排',
                note: '备注'
            }];
            flights.map((flight, key) => {
                const { flightNo, category, airlines, tail,
                    position, plannedArrived, plannedDeparture, note
                } = flight;
                dataArray.push({
                    key: key + 1,
                    flightNo,
                    category,
                    airlines,
                    tail,
                    position,
                    plannedArrived,
                    plannedDeparture,
                    people: getPeopleName(flight.people),
                    note
                });
            });
            const data = XLSX.utils.json_to_sheet(dataArray, {
                header: ["key","flightNo","category",
                    "airlines","tail","position","plannedArrived",
                    "plannedDeparture", "people", "note"],
                skipHeader:true
            });
            data["A1"] = { t: "s", v: "航线车间生产保障预排班表" };
            data["A1"].s = {
                font: { sz: 14, bold: true, color: { rgb: "FFFFAA00" } },
                alignment: {vertical: "center", horizontal: "center"}
            };
            data["!merges"] = [{//合并第一行数据[B1,C1,D1,E1]
                s: {//s为开始
                    c: 0,//开始列
                    r: 0//开始取值范围
                },
                e: {//e结束
                    c: 9,//结束列
                    r: 0//结束范围
                }
            }];
            wb.Sheets['Sheet1'] = data;
            const filePath = path.join(__dirname, '../outputs/', 'flightInfo' + '.xlsx');
            XLSX.writeFileSync(wb, filePath);

            res.download(filePath);
        }
    })
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
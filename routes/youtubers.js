const express = require("express");
const router = express.Router();
const dbFunc = require('../func/dbfunc');
const dbdata = require('../data/data');
const { param, body, validationResult } = require('express-validator');
const users = require('../data/memberModel');
router.use(express.json());

function validate(req, res, next) {
    const validatorErr = validationResult(req);
    if (!validatorErr.isEmpty()) {
        console.log(validatorErr.array());
        res.status(400).json({ "messsage": validatorErr.array() });
        return;
    }
    next();
}

router
    .route('/')
    .post([     // 유튜버 등록
        body('email').notEmpty().withMessage('email 정보가 필요합니다'),
        body('pwd').notEmpty().withMessage('pwd 정보가 필요합니다'),
        body('name').notEmpty().withMessage('name 정보가 필요합니다'),
        validate],
        async (req, res) => {
            const newYoutuber = req.body;
            console.log(newYoutuber);
            const exist = await users.isExistByEmail(newYoutuber);
            if (!exist) {
                try {
                    await users.addUser(newYoutuber);
                    res.status(201).json({ "message": `${newYoutuber.name}님, 새로운 유투버로 등록이 완료됬습니다.` });
                }
                catch (err) {
                    console.log(err);
                    res.status(404).json({ "message": `사용자 추가중 오류가 발생했습니다` });
                }
            }
            else (
                res.status(404).json({ "message": "이미 있는 유튜버입니다." })
            )
        })
    .get(async (req, res) => {//유튜버 전체 조회
        const values = await users.getAllUsers();
        console.log(typeof (values));
        if (values.length !== 0) {
            res.status(200).json({ "message": "전체 유튜버 정보입니다.", "youtubers": values });
        }
        else {
            res.status(404).json({ "message": "유튜버가 한명도 없습니다" });
        }
    })
    .delete([       // 유튜버 삭제제
        body('email').notEmpty().withMessage('email 정보가 필요합니다'),
        validate],
        async (req, res) => {
            const { email } = req.body;
            const exist = await users.isExistByEmail({ "email": email });
            if (exist) {
                try {
                    await users.delUser({ "email": email });
                    res.status(200).json({ "message": `${email}님을 제거했습니다` });
                }
                catch (err) {
                    console.log(err);
                    res.status(404).json({ "message": `문제가 발생해 제거할 수 없습니다` });
                }

            } else {
                res.status(404).json({ "message": "대상 유저가 없습니다" })
            }
        })
router.post('/login',   // 로그인 
    [body('email').notEmpty().withMessage('이메일 정보가 없습니다'),
    body('pwd').notEmpty().withMessage('이메일 정보가 없습니다'),
        validate
    ]
    , async (req, res) => {
        const { email, pwd } = req.body;
        let isIdMatched = false;
        let isPwdMatched = false;
        let youtubeUser;

        const isMatched = await users.checkPwd({ "email": email, "pwd": pwd });
        if (isMatched) {
            res.status(200).json({ "message": "로그인 성공" });
        } else {
            res.status(404).json({ "message": "아이디 또는 비밀번호가 올바르지 않습니다" });
        }

    })

module.exports = router;
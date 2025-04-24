const express = require("express");
const router = express.Router();
const dbFunc = require('../func/dbfunc');
const dbdata = require('../data/data');
router.use(express.json());


router
    .route('/')
    .post((req, res) => {// 유튜버 등록록
        const newYoutuber = req.body;
        console.log(newYoutuber);
        if (newYoutuber.nickname != undefined) {
            if (!dbdata.db.has(newYoutuber.nickname)) {
                let newId = 0;
                dbdata.db.forEach((value, key) => {
                    if (value.id > newId) {
                        newId = value.id;
                    }
                });
                dbdata.db.set(newYoutuber.nickname, {
                    id: newId + 1,
                    userId: newYoutuber.userId,
                    pwd: newYoutuber.pwd,
                    nickname: newYoutuber.nickname,
                    channelTitle: newYoutuber.channelTitle,
                    desc: newYoutuber.desc,
                    subscribers: 0
                });
                res.status(201).json({ "message": `${newYoutuber.nickname}님, 새로운 유투버로 등록이 완료됬습니다.` });
            }
            else (
                res.status(404).json({ "message": "이미 있는 유튜버입니다." })
            )
        }
        else {
            res.status(400).json({ "message": "추가하려는 유튜버 정보를 다시 확인해주세요." })
        }
    })
    .get((req, res) => {//유튜버 전체 조회
        if (dbdata.db.size !== 0) {
            let videos = Object.fromEntries(dbdata.videoDB);
            let youtubers = Object.fromEntries(dbdata.db);
            res.status(200).json({ "message": "전체 유튜버 및 영상 조회입니다.", "youtubers": youtubers, "videos": videos });

        }
        else {

            res.status(404).json({ "message": "유튜버가 한명도 없습니다" });
        }
    })
    .delete((req, res) => {
        if (dbdata.db.size > 0) {
            dbdata.db.clear();
            res.status(200).json({ "message": "모든 유튜버를 제거했습니다" })
        } else {
            res.status(404).json({ "message": "이미 비어 있습니다" });
        }
    })



router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (dbdata.db.has(id)) {
        let data = dbdata.db.get(id);
        db.delete(id);
        res.status(200).json({ "message": `${data.nickname}님을 제거했습니다` });
    } else {
        res.status(404).json({ "message": "대상 유저가 없습니다" })
    }
})
router.post('/login', (req, res) => {
    const { userId, pwd } = req.body;
    let isIdMatched = false;
    let isPwdMatched = false;
    let youtubeUser;

    // 유튜버 체크. Id, Pwd가 매치됬는지 확인하고, 매치되었다면 유튜버 정보 저장
    for (let youtuber of dbdata.db.values()) {
        if (youtuber.userId === userId) {
            console.log("id was matched");
            isIdMatched = true;
            if (youtuber.pwd === pwd) {
                isPwdMatched = true;
                youtubeUser = youtuber;
                console.log("pwd was matched");
            }
            break;
        }
    }
    if (isIdMatched) {
        if (isPwdMatched) {
            res.status(200).json({ "message": "로그인 성공" });
        }
        else {
            res.status(404).json({ "message": "비밀번호가 올바르지 않습니다다" });
        }
    }
    else {
        res.status(404).json({ "message": "없는 회원입니다" });
    }
})

module.exports = router;
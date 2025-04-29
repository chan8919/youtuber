const express = require("express");
const router = express.Router();
const dbFunc = require('../func/dbfunc');
const dbdata = require('../data/data');
router.use(express.json());

router
    .route('/')
    .get((req, res) => {
        // 특정 유튜버의 채널 전체 조회
        //const {youtuberId} = req.body;
        if (dbdata.channelDB.size !== 0) {
            let channels = Object.fromEntries(dbdata.channelDB);
            console.log(typeof (channels));
            res.status(200).json({ "message": "전체 채널 목록입니다.", "channels": channels });
        }
        else {
            // res.status(404).json({ "message": "채널이 하나도 없어요!" });
            dbFunc.notFoundChennelMsg(res);
        }
    })
    .post((req, res) => {
        //채널 생성
        const { channelTitle, channelDesc, youtuber_userId } = req.body;
        //예외처리는 앞에? if-else 짝으로 모든 예외처리를 하면 스코프가 잘 보이지 않는듯 하다.
        // 그래서 하나 하나 오류를 확인해서 바로 쳐내는 방식으로 구현한다.
        if (!dbFunc.existYoutuberByUserId(youtuber_userId)) {  // 해당 유튜버를 id값으로 조회/ 없을경우 오류처리리
            res.status(404).json({ "message": "유튜버를 찾을 수 없습니다" });
            return;
        }
        if (dbFunc.isOverChannelLimmitByUserId(youtuber_userId)) {
            res.status(404).json({ "message": "유튜버의 채널 생성 제한을 초과했습니다" });
            return;
        }
        if (dbFunc.existChannelByChannelTitle(channelTitle)) {
            res.status(404).json({ "message": "이미 있는 채널과 타이틀이 중복되었습니다" });
            return;
        }
        let newChannel = {
            id: dbFunc.getNewIdbyDB(dbdata.channelDB),
            youtuber_userId: youtuber_userId,
            channelTitle: channelTitle,
            channelDesc: channelDesc,
            subscribers: 0
        }
        dbdata.channelDB.set(newChannel.id, newChannel);
        res.status(201).json({ "message": " 채널 생성을 완료했습니다. " })

    })

router
    .route('/:id')
    .get((req, res) => {
        //개별 조회
        const ChannelId = parseInt(req.params.id);
        if (!dbFunc.existChannelById(ChannelId)) {
            //res.status(404).json({ "message": "채널널정보를 찾을 수 없습니다" });
            dbFunc.notFoundChennelMsg(res);
            return;
        }
        res.status(200).json(dbdata.channelDB.get(ChannelId));
    })
    .put((req, res) => {
        //채널 수정 
        const channelId = parseInt(req.params.id);
        const { channelTitle, channelDesc, youtuber_userId } = req.body;
        let channel = dbdata.channelDB.get(channelId);
        if (!dbFunc.existYoutuberByUserId(youtuber_userId)) {  // 해당 유튜버를 id값으로 조회/ 없을경우 오류처리리
            res.status(404).json({ "message": "사용자를 찾을 수 없습니다" });
            return;
        }
        if (dbFunc.isOverChannelLimmitByUserId(youtuber_userId)) {
            res.status(404).json({ "message": "사용자의 채널 생성 제한을 초과했습니다" });
            return;
        }
        if (channel.channelTitle !== channelTitle) {
            if (dbFunc.existChannelByChannelTitle(channelTitle)) {
                res.status(404).json({ "message": "이미 있는 채널과 타이틀이 중복되었습니다" });
                return;
            }
        }
        channel["channelTitle"] = channelTitle;
        channel["channelDesc"] = channelDesc;
        channel["youtuber_userId"] = youtuber_userId;

        dbdata.channelDB.set(channel);
        res.status(200).json({ "message": "채널 수정에 성공했습니다" });

    })
    .delete((req, res) => {
        // 채널 개별 삭제
        const channelId = parseInt(req.params.id);
        console.log(channelId);
        if (!dbFunc.existChannelById(channelId)) {
            // res.status(404).json({ "message": "존재하지 않는 채널입니다. 삭제할 수 없습니다" });
            dbFunc.notFoundChennelMsg(res);
            return;
        }
        dbdata.channelDB.delete(channelId);
        res.status(200).json({ "message": "채널 삭제에 성공했습니다" })
    })


    module.exports = router;
const express = require("express");
const router = express.Router();
const dbFunc = require('../func/dbfunc');
const dbdata = require('../data/data');
const channels = require('../data/channelModel');
const users = require('../data/memberModel');
const { findByEmail } = require("../data/memberModel");
router.use(express.json());

router
    .route('/')
    .get(async (req, res) => {
        // 특정 유튜버의 채널 전체 조회
        const channelList = await channels.getAllChannels();
        if (channelList.length > 0) {
            res.status(200).json({ "message": "전체 채널 목록입니다.", "channels": channelList });
        }
        else {
            dbFunc.notFoundChennelMsg(res);
        }
    })
    .post(async (req, res) => {
        //채널 생성
        const { name, description, email } = req.body;
        //예외처리는 앞에? if-else 짝으로 모든 예외처리를 하면 스코프가 잘 보이지 않는듯 하다.
        // 그래서 하나 하나 오류를 확인해서 바로 쳐내는 방식으로 구현한다.
        // 이메일 체크는 필요 없을지도
        // const userExist = await users.isExistByEmail({"email":email})
        // if (!userExist) {  // 해당 유튜버를 email로 확인
        //     res.status(404).json({ "message": "유튜버를 찾을 수 없습니다" });
        //     return;
        // }
        const isOverLimit = await channels.isOverChannelLimit({"email":email});
        if (isOverLimit) {
            res.status(404).json({ "message": "유튜버의 채널 생성 제한을 초과했습니다" });
            return;
        }
        const isExist = await channels.isExistByName({"name":name});
        if (isExist) {
            res.status(404).json({ "message": "이미 있는 채널과 타이틀이 중복되었습니다" });
            return;
        }
        try{
            await channels.addChannel({name:name,description:description,email:email});
            res.status(201).json({ "message": " 채널 생성을 완료했습니다. " });
        }
        catch(err){
            console.log(err);
            res.status(404).json({ "message": " 오류가 발생해 채널 생성에 실패했습니다. " });
        } 

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

router
    .route('/user')
    .post(async (req, res) => {
        const { email } = req.body;
        try {
            const channelList = await channels.findByUserEmail({ "email": email });
            if (channelList.length > 0) {
                res.status(200).json({ "message": `${email} 님의 채널 목록입니다.`, "channels": channelList });
            }
            else {
                res.status(200).json({ "message": `${email} 님의 채널 목록을 찾을 수 없습니다.`, "channels": channelList });
            }
        }
        catch(err) {
            console.log(err);
            res.status(404).json({ "message": "채널을 찾는 중 오류가 발생했습니다" });
        }

    })


module.exports = router;
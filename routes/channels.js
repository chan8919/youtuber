const express = require("express");
const router = express.Router();
const dbFunc = require('../func/dbfunc');
const channels = require('../data/channelModel');
const { param, body, validationResult } = require('express-validator');
const users = require('../data/memberModel');
const { findByEmail } = require("../data/memberModel");
router.use(express.json());

// 인풋데이터 오류처리
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
    .get(async (req, res) => {
        // 채널 전체 조회
        const channelList = await channels.getAllChannels();
        if (channelList.length > 0) {
            res.status(200).json({ "message": "전체 채널 목록입니다.", "channels": channelList });
        }
        else {
            dbFunc.notFoundChennelMsg(res);
        }
    })
    .post(
        [body('email').notEmpty().withMessage('이메일은 필수입니다'),
        body('name').notEmpty().isString().withMessage('채널 이름의 문자 입력 필요'),
            validate]
        , async (req, res) => {
            //채널 생성
            const { name, description, email } = req.body;

            const isOverLimit = await channels.isOverChannelLimit({ "email": email });
            if (isOverLimit) {
                res.status(404).json({ "message": "유튜버의 채널 생성 제한을 초과했습니다" });
                return;
            }
            const isExist = await channels.isExistByName({ "name": name });
            if (isExist) {
                res.status(404).json({ "message": "이미 있는 채널과 이름이 중복되었습니다" });
                return;
            }

            try {
                await channels.addChannel({ name: name, description: description, email: email });
                res.status(201).json({ "message": " 채널 생성을 완료했습니다. " });
            }
            catch (err) {
                console.log(err);
                res.status(404).json({ "message": " 오류가 발생해 채널 생성에 실패했습니다. " });
            }

        })

router
    .route('/:id')
    .get([param('id').notEmpty().withMessage('채널 id가 잘못 들어왔습니다'), validate],
        async (req, res) => {
            //개별 조회
            const ChannelId = parseInt(req.params.id);
            try {
                const channel = await channels.getById({ "id": ChannelId });
                res.status(200).json({ "message": "채널 정보입니다", "channel": channel });
                return;
            } catch {
                dbFunc.notFoundChennelMsg(res);
                return;
            }

        })
    .put([param('id').notEmpty().withMessage('id가필요합니다'), validate],
        async (req, res) => {
            //채널 수정 

            const channelId = parseInt(req.params.id);
            const { name, description } = req.body;

            // 채널 가져오기
            let channel = await channels.getById({ "id": channelId });
            if (channel == undefined) {
                res.status(400).json({ "messsage": "수정하고자 하는 채널을 찾을 수 없습니다" });
                return;
            }
            //수정하려는 값 유효성 확인

            const isExist = await channels.isExistByName({ "name": name });
            if ((channel.name != name) && isExist) {
                res.status(404).json({ "message": "이미 있는 채널과 이름이 중복되었습니다" });
                return;
            }

            // 수정할 값 name과 description이 항상 있을까? // 수정하지 않으려면 기존 값을 넣어주나? 아니면 수정할 값만 넘기나나
            if (name != undefined) {
                channel["name"] = name;
            }
            if (description != undefined) {
                channel["description"] = description;
            }
            try {
                await channels.updateChannel({ target: channel });
                res.status(200).json({ "message": "채널 수정에 성공했습니다" });
                return;
            } catch (err) {
                console.log(err);
                res.status(404).json({ "message": "채널 수정에 실패했습니다다" });
                return;
            }

        })
    .delete([param('id').notEmpty().withMessage('삭제할 채널의 id가 필요합니다'), validate],
        async (req, res) => {
            // 채널 개별 삭제
            const channelId = parseInt(req.params.id);

            const exist = await channels.isExistById({ id: channelId });
            if (!exist) {
                res.status(404).json({ "message": "채널 삭제에 실패했습니다. 삭제하려는 채널이 없습니다." });
                return;
            }
            try {
                await channels.delChannelById({ id: channelId });
                res.status(200).json({ "message": "채널 삭제에 성공했습니다" });
                return;
            } catch (err) {
                console.log(err);
                res.status(404).json({ "message": "채널 삭제에 실패했습니다" });
                return;
            }
        })

router
    .route('/user')
    .post([
        body('email').notEmpty().withMessage('이메일이 누락되었습니다'),
        validate],
        async (req, res) => {

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
            catch (err) {
                console.log(err);
                res.status(404).json({ "message": "채널을 찾는 중 오류가 발생했습니다" });
            }

        })


module.exports = router;
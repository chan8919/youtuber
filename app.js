const express = require('express');
const app = express();
const path = require('path');
const youtuberRouter = require('./routes/youtubers');
const channelRouter = require('./routes/channels');
const data = require('./data/data');

app.listen(8888);
app.use(express.json());
app.use("/youtubers",youtuberRouter);
app.use("/channels",channelRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
})
//유튜버 닉네임 조회

//현재는 viewers만만 수정
app.patch('/videos/:vid', (req, res) => {
    console.log(req.body);
    let { viewers } = req.body;
    let videoId = parseInt(req.params.vid);
    if (data.videoDB.has(videoId)) {
        const video = videoDB.get(videoId);
        console.log(viewers + "테스트");
        video.viewers = viewers;
        data.videoDB.set(videoId, video);
        return res.json({ "message": "성공적으로 뷰어 수정" });
    }
    else {
        res.json({ "message": "해당 비디오를 찾을 수 없습니다." });
    }
});



//채널 개별 조회

//채널 전체 조회
//채널 생성

//채널 수정

//채널 개별 삭제

/// 함수
// 이름짓기가 참 까다롭다. 그래도 최대한 규칙에 맞게.. 이름 길어지더라도 설정하자

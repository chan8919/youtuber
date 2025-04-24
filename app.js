const express = require('express');
const app = express();
const path = require('path');
const youtuberRouter = require('./routes/youtubers');
const channelRouter = require('./routes/channels');

app.listen(8888);
app.use(express.json());
app.use("/youtubers",youtuberRouter);
app.use("/channels",channelRouter);

//미리 들어가 있을 데이터
let db = new Map();
let videoDB = new Map();
let channelDB = new Map();

// 유튜버 초기값
const youtuber1 = {
    id: 1,
    nickname: "@sorinamul",
    userId: "sorinamul",
    pwd: "11111",
    channelTitle: "나물을 삶을 때 소리가 나는 현상 연구회",
    desc: "나물에 미쳐있는 사람들이 나물을 연구하는 영상을 올립니다. 지금 나물로 뛰어드세요",
    subscribers: 50000
}
const youtuber2 = {
    id: 2,
    nickname: "@sorinamu",
    userId: "sorinamu",
    pwd: "22222",
    channelTitle: "나무 심기 협회",
    desc: "내 손에 모종이 있는한, 모든 날은 식목일이다.",
    subscribers: 200
}
const youtuber3 = {
    id: 3,
    nickname: "@sorisori",
    userId: "sori",
    pwd: "33333",
    channelTitle: "소리소리",
    desc: "이게 무슨소리지? 음? 나도 진짜 몰라 이 소리",
    subscribers: 1042000
}

db.set(youtuber1.nickname, youtuber1);
db.set(youtuber2.nickname, youtuber2);
db.set(youtuber3.nickname, youtuber3);

//비디오 초기값
const video1 = {
    id: 1,
    youtuberNickname: "@sorinamul",
    videoDesc: "나물 심어보기",
    viewers: 200

}
const video2 = {
    id: 2,
    youtuberNickname: "@sorinamul",
    videoDesc: "나물 캐기",
    viewers: 320

}

const video3 = {
    id: 3,
    youtuberNickname: "@sorinamu",
    videoDesc: "모종! 어떻게 키워야 하는가",
    viewers: 10

}
videoDB.set(video1.id, video1);
videoDB.set(video2.id, video2);
videoDB.set(video3.id, video3);

// 채널 정보
const channel1 = {
    id: 1,
    youtuber_userId: "sorinamu",
    channelTitle: "나무심는채널",
    channelDesc: "하루 한번 나무심기 프로젝트 기록용 채널입니다",
    subscribers: 1042000
}

channelDB.set(channel1.id, channel1);



app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
})

//유튜버 닉네임 조회


//현재는 viewers만만 수정
app.patch('/videos/:vid', (req, res) => {
    console.log(req.body);
    let { viewers } = req.body;
    let videoId = parseInt(req.params.vid);

    if (videoDB.has(videoId)) {
        const video = videoDB.get(videoId);
        console.log(viewers + "테스트");
        video.viewers = viewers;
        videoDB.set(videoId, video);

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

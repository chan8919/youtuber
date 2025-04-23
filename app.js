let express = require('express');
let app = express();
const path = require('path');

app.listen(8888);

app.use(express.json());

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
app.get('/youtubers/:n', (req, res) => {
    reqYoutuberNickname = req.params.n;

    if (db.has(reqYoutuberNickname)) {
        let videos = JSON.stringify(getVideostoNickname(reqYoutuberNickname));
        res.status(200).json({ "youtubers": db.get(reqYoutuberNickname), "videos": videos });
    }
    else {
        res.status(404).json({ "message": "해당하는 유튜버가 없습니다다" })
    }



})

//유튜버 전체 조회
app.get('/youtubers', (req, res) => {
    if (db.size !== 0) {
        let videos = Object.fromEntries(videoDB);
        let youtubers = Object.fromEntries(db);
        res.status(200).json({ "message": "전체 유튜버 및 영상 조회입니다.", "youtubers": youtubers, "videos": videos });

    }
    else {

        res.status(404).json({ "message": "유튜버가 한명도 없습니다" });
    }
})
// 유튜버 등록록
app.post('/youtubers', (req, res) => {

    const newYoutuber = req.body;
    console.log(newYoutuber);
    if (newYoutuber.nickname != undefined) {
        // console.log(db); // test
        // console.log(db.has(newYoutuber.nickname));
        if (!db.has(newYoutuber.nickname)) {
            let newId = 0;
            db.forEach((value, key) => {
                if (value.id > newId) {
                    newId = value.id;
                }
            });
            db.set(newYoutuber.nickname, {
                id: newId + 1,
                userId: newYoutuber.userId,
                pwd: newYoutuber.pwd,
                nickname: newYoutuber.nickname,
                channelTitle: newYoutuber.channelTitle,
                desc: newYoutuber.desc,
                subscribers: 0
            });
            // console.log(db); //test
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

app.delete('/youtubers', (req, res) => {
    if (db.size > 0) {
        db.clear();
        res.status(200).json({ "message": "모든 유튜버를 제거했습니다" })
    } else {
        res.status(404).json({ "message": "이미 비어 있습니다" });
    }

})
app.delete('/youtubers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (db.has(id)) {
        let data = db.get(id);
        db.delete(id);
        res.status(200).json({ "message": `${data.nickname}님을 제거했습니다` });
    } else {
        res.status(404).json({ "message": "대상 유저가 없습니다" })
    }
})

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

app.post('/login', (req, res) => {
    const { userId, pwd } = req.body;
    let isIdMatched = false;
    let isPwdMatched = false;
    let youtubeUser;

    // 유튜버 체크. Id, Pwd가 매치됬는지 확인하고, 매치되었다면 유튜버 정보 저장
    for (let youtuber of db.values()) {
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

// app.post('/login',(req,res)=>{
//     const {userId,pwd} = req.body;
//     let youtubeUser;

//     // 유튜버 체크. Id, Pwd가 매치됬는지 확인하고, 매치되었다면 유튜버 정보 저장
//     for(let youtuber of db.values()){
//         if(youtuber.userId === userId){
//             youtubeUser = youtuber;
//             break;
//         }
//     }
//     if(Object.keys(youtubeUser).length>0){
//         if(youtubeUser.pwd === pwd){
//             res.status(200).json({"message":"로그인 성공"});
//         }
//         else{
//             res.status(404).json({"message":"비밀번호가 올바르지 않습니다다"});
//         }
//     }
//     else{
//         res.status(404).json({"message":"없는 회원입니다"});
//     }

// })

app
    .route('/channels')
    .get((req, res) => {
        // 전체 조회회
    })
    .post((req, res) => {
        //채널 생성
        const { channelTitle, channelDesc, youtuber_userId } = req.body;

        //예외처리는 앞에? if-else 짝으로 모든 예외처리를 하면 스코프가 잘 보이지 않는듯 하다.
        // 그래서 하나 하나 오류를 확인해서 바로 쳐내는 방식으로 구현한다.
        if (!existYoutuberByUserId(youtuber_userId)) {  // 해당 유튜버를 id값으로 조회/ 없을경우 오류처리리
            res.status(404).json({ "message": "사용자를 찾을 수 없습니다" });
            return;
        }
        if (isOverChannelLimmitByUserId(youtuber_userId)) {
            res.status(404).json({ "message": "사용자의 채널 생성 제한을 초과했습니다" });
            return;
        }
        if (existChannelByChannelTitle(channelTitle)) {
            res.status(404).json({ "message": "이미 있는 채널과 타이틀이 중복되었습니다" });
            return;
        }

        let newChannel = {
            id: getNewIdbyDB(channelDB),
            youtuber_userId: youtuber_userId,
            channelTitle: channelTitle,
            channelDesc: channelDesc,
            subscribers: 0
        }
        channelDB.set(newChannel.id, newChannel);
        res.status(201).json({ "message": " 채널 생성을 완료했습니다. " })

    })

app
    .route('/channels/:id')
    .get((req, res) => {
        //개별 조회회
        const ChannelId = parseInt(req.params.id);
        if(!existChannelById(ChannelId)){
            res.status(404).json({"message":"채널널정보를 찾을 수 없습니다"});
            return;
        }
        res.status(200).json(channelDB.get(ChannelId));

    })
    .put((req, res) => {
        //채널 수정 
        const channelId = parseInt(req.params.id);
        const { channelTitle, channelDesc, youtuber_userId } = req.body;
        let channel = channelDB.get(channelId);
        if (!existYoutuberByUserId(youtuber_userId)) {  // 해당 유튜버를 id값으로 조회/ 없을경우 오류처리리
            res.status(404).json({ "message": "사용자를 찾을 수 없습니다" });
            return;
        }
        if (isOverChannelLimmitByUserId(youtuber_userId)) {
            res.status(404).json({ "message": "사용자의 채널 생성 제한을 초과했습니다" });
            return;
        }
        if (channel.channelTitle !== channelTitle) {
            if (existChannelByChannelTitle(channelTitle)) {
                res.status(404).json({ "message": "이미 있는 채널과 타이틀이 중복되었습니다" });
                return;
            }
        }

        channel["channelTitle"] = channelTitle;
        channel["channelDesc"] = channelDesc;
        channel["youtuber_userId"] = youtuber_userId;

        channelDB.set(channel);
        res.status(200).json({ "message": "채널 수정에 성공했습니다" });

    })
    .delete((req,res)=>{
        // 채널 개별 삭제
        const channelId = parseInt(req.params.id);
        console.log(channelId);
        if(!existChannelById(channelId)){
            res.status(404).json({"message": "존재하지 않는 채널입니다. 삭제할 수 없습니다"});
            return;
        }
        channelDB.delete(channelId);
        res.status(200).json({"message":"채널 삭제에 성공했습니다"})
    })

//채널 개별 조회

//채널 전체 조회
//채널 생성

//채널 수정

//채널 개별 삭제

/// 함수
// 이름짓기가 참 까다롭다. 그래도 최대한 규칙에 맞게.. 이름 길어지더라도 설정하자
// 사용자 가져오기기
function findYoutuberByUserId(userId) {
    let searchData = null;
    if (typeof (userId) === "string") {
        // db에서 userId가 일치하는 유튜버 탐색 -> 성공시 searchData에 저장장
        for (let youtuber of db) {
            if (youtuber.userId === userId) {
                searchData = youtuber;
                break;
            }
        }
    }
    return searchData;  // searchData가 있으면 데이터를 넘기고 , 없으면 null값 반환
}
// 사용자가 있는지 확인인
function existYoutuberByUserId(userId) {
    let isExist = false;
    if (typeof (userId) === "string") {
        // db에서 userId가 일치하는 유튜버 탐색 -> 성공시 searchData에 저장장
        for (let youtuber of db.values()) {
            if (youtuber.userId === userId) {
                isExist = true;
                break;
            }
        }
    }
    return isExist;  // isExist 있으면 false를 반환, 있으면 true값 반환
}
// 채널이 있는지 확인
function existChannelByChannelTitle(channelTitle) {
    let isExist = false;
    if (typeof (channelTitle) === "string") {
        for (let channel of channelDB.values()) {
            if (channel.channelTitle === channelTitle) {
                isExist = true;
                break;
            }
        }
    }
    return isExist;
}
function existChannelById(channelId) {
    let isExist = false;
    
    if (typeof (channelId) === "number") {
        for (let channel of channelDB.values()) {
            if (channel.id == channelId) {
                isExist = true;
                break;
            }
        }
    }
    return isExist;
}
function isOverChannelLimmitByUserId(userId) {
    let counter = 0;
    if (typeof (userId) === "string") {
        channelDB.forEach(channel => {
            if (channel.userId === userId) {
                counter++;
            }
        })
    }
    if (counter >= 100) {
        return true;
    }
    else {
        return false;
    }

}
function getNewIdbyDB(database) {
    let lastId = 0;
    database.forEach((value) => {
        if (value.id > lastId) {
            lastId = value.id;
        }
    });
    lastId = parseInt(lastId);
    return lastId + 1;
}







function getVideostoNickname(youtuberNickname) {
    let videos = [];
    console.log(youtuberNickname);
    videoDB.forEach((value, key) => {
        if (value.youtuberNickname == youtuberNickname) {
            videos.push(value)
            console.log("push video :" + value)
        }
    })

    return videos;
}
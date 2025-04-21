let express = require('express');
let app = express();
const path = require('path');

app.listen(8888);

app.use(express.json());

//미리 들어가 있을 데이터
let db = new Map();
let videoDB = new Map();

// 유튜버 초기값
const youtuber1 ={
    id:1,
    nickname:"@sorinamul",
    channelTitle:"나물을 삶을 때 소리가 나는 현상 연구회",
    desc:"나물에 미쳐있는 사람들이 나물을 연구하는 영상을 올립니다. 지금 나물로 뛰어드세요",
    subscribers:50000
}
const youtuber2 ={
    id:2,
    nickname:"@sorinamu",
    channelTitle:"나무 심기 협회",
    desc:"내 손에 모종이 있는한, 모든 날은 식목일이다.",
    subscribers:200
}
const youtuber3 ={
    id:3,
    nickname:"@sorisori",
    channelTitle:"소리소리",
    desc:"이게 무슨소리지? 음? 나도 진짜 몰라 이 소리",
    subscribers:1042000
}

db.set(youtuber1.nickname,youtuber1);
db.set(youtuber2.nickname,youtuber2);
db.set(youtuber3.nickname,youtuber3);

//비디오 초기값
const video1 = {
    id:1,
    youtuberNickname:"@sorinamul",
    videoDesc:"나물 심어보기",
    viewers:200

}
const video2 = {
    id:2,
    youtuberNickname:"@sorinamul",
    videoDesc:"나물 캐기",
    viewers:320

}

const video3 = {
    id:3,
    youtuberNickname:"@sorinamu",
    videoDesc:"모종! 어떻게 키워야 하는가",
    viewers:10

}
videoDB.set(video1.id,video1);
videoDB.set(video2.id,video2);
videoDB.set(video3.id,video3);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','main.html'));
})

//유튜버 닉네임 조회
app.get('/youtubers/:n',(req,res)=>{
    reqYoutuberNickname = req.params.n;
    
    let videos = JSON.stringify(getVideostoNickname(reqYoutuberNickname));
    res.json({"youtubers" : db.get(reqYoutuberNickname) ,"videos": videos});

})

//유튜버 전체 조회
app.get('/youtubers',(req,res)=>{
    
    let videos =   Object.fromEntries(videoDB);
    let youtubers = Object.fromEntries(db);
    res.json({"message":"전체 유튜버 및 영상 조회입니다.","youtubers": youtubers ,"videos": videos});

})

app.post('/youtubers',(req,res)=>{
     
    const newYoutuber = req.body;
    console.log(newYoutuber);
    if(newYoutuber.nickname!=undefined){
        console.log(db); // test
        console.log(db.has(newYoutuber.nickname));
        if(!db.has(newYoutuber.nickname)){
            let newId = 0 ;
            db.forEach((value,key)=>{
                if(value.id > newId){
                    newId = value.id;
                }
            });
            db.set(newYoutuber.nickname,{
            id:newId+1,
            nickname:newYoutuber.nickname,
            channelTitle:newYoutuber.channelTitle,
            desc:newYoutuber.desc,
            subscribers:0
            });
            console.log(db); //test
            res.json({"message":`${newYoutuber.nickname}님, 새로운 유투버로 등록이 완료됬습니다.`});
        }
        else(
            res.json({"message":"이미 있는 유튜버입니다."})
        )
    }
    else{
        res.json({"message":"추가하려는 유튜버 정보를 다시 확인해주세요."})
    }
})
app.delete('/youtubers',(req,res)=>{
    if(db.size==0){
        res.json({"message":"이미 비어 있습니다"});
    }else{
        db.clear();
        res.json({"message":"모든 유튜버를 제거했습니다"})
    }

})
app.delete('/youtubers/:id',(req,res)=>{
    const id = parseInt(req.params.id);

    if(db.has(id)){
        let data = db.get(id);
        db.delete(id);
        res.json({"message":`${data.nickname}님을 제거했습니다`});
    }else{
        res.json({"message":"대상 유저가 없습니다"})
    }

})

//현재는 viewers만만 수정
app.patch('/videos/:vid',(req,res)=>{
    console.log(req.body);
    let {viewers} = req.body;
    let videoId = parseInt(req.params.vid);

    if(videoDB.has(videoId)){
        const video = videoDB.get(videoId);
        console.log(viewers + "테스트");
        video.viewers = viewers;
        videoDB.set(videoId, video);

        return res.json({"message": "성공적으로 뷰어 수정"});

    }
    else{
        res.json({"message":"해당 비디오를 찾을 수 없습니다."});
    }


});

function getVideostoNickname(youtuberNickname){
    let videos = [];
    console.log(youtuberNickname);
    videoDB.forEach((value,key)=>{
        if(value.youtuberNickname == youtuberNickname){
            videos.push(value)
            console.log("push video :" + value)
        }
    })
    
    return videos;
}
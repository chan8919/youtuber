const dbdata = require('../data/data');

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
        for (let youtuber of dbdata.db.values()) {
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
        for (let channel of dbdata.channelDB.values()) {
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
        for (let channel of dbdata.channelDB.values()) {
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
        dbdata.channelDB.forEach(channel => {
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

module.exports = {
    findYoutuberByUserId,
    existYoutuberByUserId,
    existChannelByChannelTitle,
    existChannelById,
    isOverChannelLimmitByUserId,
    getNewIdbyDB,
    getVideostoNickname
}
const conn = require('./mariadb');
const users = require('./memberModel');

// 이메일에 해당하는 채널 목록 조회회
function findByUserEmail({ email }) {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT c.*,m.email FROM channels AS c JOIN members AS m ON c.member_id = m.id where m.email = ?';
        conn.query(sql, email, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })

}
// 모든 채널 조회회
function getAllChannels() {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM channels';
        conn.query(sql, function (err, results, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        })
    })

}
//채널 추가
async function addChannel({ name, description, email }) {
    try {
        const user = await users.findByEmail({ "email": email });
        console.log(typeof(parseInt(user[0].id)));
        console.log(description);
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO channels (name, member_id ,description) VALUES (?,?,?)';
            conn.query(sql, [name, user[0].id, description],
                function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                }
            )
        })
    }
    catch (err) {
        return err;
    }

}
// 갯수 제한 확인인
function isOverChannelLimit({email}) {
    const channelLimit = 100;
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS count FROM channels AS c JOIN members AS u ON c.member_id=u.id WHERE u.email = ? ';
        conn.query(sql, email, (err, results) => {
            if (err) {
                reject(err);
            } else {
                if(results[0].count>=100){
                    resolve(true)
                }
                else{
                    resolve(false)
                }
            }
        })
    })

}

// 채널 중복 이름 확인
function isExistByName({name}){
    const sql = 'SELECT EXISTS (SELECT * FROM channels WHERE name = ?) AS exist';
    return new Promise((resolve, reject) => {
        conn.query(sql, name, // 테이블 명은 바인딩으로 사용할 수 없다.
            function (err, results, fields) {
                if (err) {
                    reject(err);
                }
                else {
                    const exists = results[0].exist;
                    resolve(exists);
                }
            });

    })


}

module.exports = {
    findByUserEmail,
    getAllChannels,
    isExistByName,
    isOverChannelLimit,
    addChannel
};
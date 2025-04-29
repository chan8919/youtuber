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
async function addChannel({ name, desc, email }) {
    try {
        const user = await users.findByEmail({ "email": email });
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO members (name,member_id,desc) VALUES (?,?,?)';
            conn.query(sql, [name, user.id, desc],
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
// 제한 확인인
function checkLimitChannelNum({email}) {
    const channelLimit = 100;
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS count FROM channels AS c JOIN members AS u ON c.member_id=u.id WHERE u.email = ? ';
        conn.query(sql, email, (err, results) => {
            if (err) {
                reject(err);
            } else {
                console.log(results[0].count);
                resolve(results[0].count);
            }
        })
    })

}

module.exports = {
    findByUserEmail,
    getAllChannels,
    addChannel
};
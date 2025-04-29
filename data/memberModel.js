const conn = require('./mariadb');

// 이메일로 멤버가 있는지 확인인
function isExistByEmail({ email }) {
    const sql = 'SELECT EXISTS (SELECT * FROM members WHERE email = ?) AS exist';
    console.log(email);
    return new Promise((resolve, reject) => {
        conn.query(sql, [email], // 테이블 명은 바인딩으로 사용할 수 없다.
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

// 이메일로 멤버 정보 가져오기
function findByEmail({ email }) {
    const sql = 'SELECT * FROM members WHERE email = ?';
    return new Promise((resolve, reject) => {
        conn.query(sql, email,
            function (err, results, fields) {
                if(err){
                    reject(err)
                }else{
                    resolve(results);
                }
            }
        )
    })
}
function getAllUsers() {
    const sql = 'SELECT * FROM members';
    return new Promise((resolve,reject)=>{
        conn.query(sql, function (err, results, fields) {
            if(err){
                reject(err);
            }
            else{
                resolve(results);
            }
        })
    })
   
}

// 멤버 추가 
function addUser({ email, pwd, name }) {
    const sql = 'INSERT INTO members (email,pwd,name) VALUES (?,?,?)';
    return new Promise((resolve,reject)=>{
        conn.query(sql, [email, pwd, name],
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

function delUser({email}){
    const sql = 'DELETE FROM members WHERE email = ?';
    return new Promise((resolve,reject)=>{
        conn.query(sql,email,(err,results)=>{
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                console.log(results);
                resolve(true);
            }
        })

    })
}

function checkPwd({email,pwd}){ // 이메일과 PWD가 일치하는 값이 있으면 1 없으면 0 반환
    const sql = "SELECT EXISTS (SELECT 1 FROM members WHERE email = ? AND pwd =?) AS exist";
    return new Promise((resolve,reject)=>{
        conn.query(sql,[email,pwd],(err,results)=>{
            if(err){
                reject(err);
            }else{
                resolve(results[0].exist);
            }

        })
    })
}

//testarea



module.exports = {
    isExistByEmail,
    findByEmail,
    addUser,
    delUser,
    checkPwd,
    getAllUsers
}

// function isMemberExist({name, email, created_at}){

// }
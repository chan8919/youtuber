const conn = require('./mariadb');

function findByUserEmail({email}){
    const sql = 'SELECT c.*,m.email FROM channels AS c JOIN members AS m ON c.member_id = m.id where m.email = ?';
    return new Promise((resolve,reject)=>{
        conn.query(sql,email,(err,results)=>{
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        })
    })

}
function getAllChannels() {
    const sql = 'SELECT * FROM channels';
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

module.exports = {
    findByUserEmail,
    getAllChannels
};
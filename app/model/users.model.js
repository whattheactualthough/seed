const db = require("../../db/connection")

const selectUsers = () => {
    return db.query(`SELECT username, name, avatar_url FROM users`)
    .then(({rows}) => {
        return rows
    })
}

const selectUserByUsername = (username) => {
    if(typeof username !== "string" || !username.trim()){
        return Promise.reject({
            status:400, 
            msg: "Invalid username"})
    }
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then (({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, 
                msg: "User not found"
            })
        }
        return rows[0]
    })
}
 
module.exports = {
    selectUsers,
    selectUserByUsername
}
const db = require("../../db/connection")

const selectUsers = () => {
    return db.query(`SELECT username, name, avatar_url FROM users`)
    .then(({rows}) => {
        console.log(rows[0].avatar_url)
        return rows
    })
}

module.exports = {
    selectUsers
}
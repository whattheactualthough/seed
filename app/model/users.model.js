const db = require("../../db/connection")

const selectUsers = () => {
    return db.query(`SELECT username, name, avatar_url FROM users`)
    .then(({rows}) => {
        return rows
    })
}

module.exports = {
    selectUsers
}
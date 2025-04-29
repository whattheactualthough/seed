const db = require("../../db/connection")

const selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows;
    })
    .catch((err)=> {
        console.log(err)
    });
};

module.exports = selectTopics;
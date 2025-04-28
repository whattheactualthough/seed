const db = require("../../db/connection")

const selectTopics = () => {
    console.log("hi from model")
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        console.log(rows)
        return rows;
    })
    .catch((err)=> {
        console.log(err)
    });
};

module.exports = selectTopics;
const db = require("../../db/connection")
const checkArticleExists = require("./comments.model")

const selectArticleById = (article_id) => {
   return db
   .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({
                status: 404, 
                msg: "Not Found"
            })
        } else {
        return result.rows[0]
     };
    });
};

const updateArticleVotes = (article_id, inc_votes) => {
    const article_id_num = Number(article_id)
    if(isNaN(article_id_num)){
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    if (inc_votes === undefined) {
        return Promise.reject({ status: 400, msg: "Missing required fields" });
      }

    if(typeof inc_votes !== "number"){
        return Promise.reject({status:400, msg: "Bad request"})
    }
   return checkArticleExists(article_id_num)
    .then(() => {
    return db.query(`UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`, [inc_votes, article_id_num])
        .then(({rows}) => {
             return rows[0];
            })
              
         });
    };
const selectArticles = () => {
    return db
    .query(`SELECT articles.title, articles.article_id, articles.topic, articles.author, articles.created_at, articles.votes, 
    COUNT(comments.article_id)::INT
    AS comment_count
    FROM articles 
    LEFT JOIN comments 
     ON articles.article_id = comments.article_id GROUP BY articles.article_id 
    ORDER BY articles.created_at;`)
    .then((result) => {
        return result.rows
    })
 }

 


module.exports = {
    selectArticleById, 
    selectArticles, 
    updateArticleVotes
}
const db = require("../../db/connection")

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
        return result.rows
     };
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

 





module.exports = {selectArticleById, selectArticles}
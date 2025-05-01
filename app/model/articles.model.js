const db = require("../../db/connection")
const checkArticleExists = require("./comments.model")
const checkColumnExists = require("./utils")

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

const selectArticles = (sort_by, order) => {

    const orderGreenList = [
        'ASC', 
        'DESC'];

    const sortByGreenList = [
        'article_id', 
        'title', 
        'topic', 
        'author', 
        'created_at', 
        'votes'];
    
    if(sort_by && !sortByGreenList.includes(sort_by)){
        return Promise.reject({status: 400, msg: "Invalid sort by value"})
    };

    if(order && !orderGreenList.includes(order.toUpperCase())){
        return Promise.reject({status:400, msg: "Invalid order value"});
    };

    let queryStr = `SELECT articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.author, 
    articles.created_at, articles.votes,
    COUNT(comments.article_id)::INT 
    AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id ORDER BY`

    
    if (!sort_by) {
        queryStr += ` articles.created_at`;

      } else {
        queryStr += ` ${sort_by}`;
      };
  
      if (!order) {
        queryStr += ` DESC;`;

      } else {
        queryStr += ` ${order.toUpperCase()};`;
      };

    return db.query(queryStr)
    .then(({rows}) => {
        return rows;
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

 


module.exports = {
    selectArticleById, 
    selectArticles, 
    updateArticleVotes
}
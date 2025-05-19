const db = require("../../db/connection")
const {checkArticleExists, checkUserExists} = require("./utils")

const selectArticleById = (article_id) => {
   return db
   .query(`SELECT 
    articles.article_id,
    articles.title, 
    articles.topic, 
    articles.author, 
    articles.body,
    articles.created_at,
    articles.votes,
    COUNT(comments.article_id)::INT 
        AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY 
    articles.article_id;`, [article_id])
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

const selectArticles = (sort_by, order, topic) => {

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
    
    const topicGreenList = [
        'mitch',
        'cats',
        'paper'
    ]

    if(topic && !topicGreenList.includes(topic)){
        return Promise.reject({
            status: 400, 
            msg: "Invalid topic"
        })
    }
    
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
    articles.created_at, 
    articles.votes,
    COUNT(comments.article_id)::INT 
    AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id`

    const queryArgs = [];

    if(topic){
        queryStr += ` WHERE articles.topic = $${queryArgs.length +1}` 
        queryArgs.push(topic)
    }

    queryStr += ` GROUP BY articles.article_id`
   
    if (sort_by) {
        queryStr += ` ORDER BY articles.${sort_by} ${order || 'DESC'}`;
    } else {
        queryStr += ` ORDER BY articles.created_at DESC`;
    }

    return db.query(queryStr, queryArgs)
    .then(({rows}) => {
 
        if (rows.length === 0){
            return Promise.reject({
                status: 404, 
                msg: "Article not found"})
        }
    
        return rows;
    })
};

 

const updateArticleVotes = (article_id, inc_votes) => {

    const article_id_num = parseInt(article_id)

    if(isNaN(article_id)){
        return Promise.reject({status: 400, msg: "Invalid article id"})
    }

    if (inc_votes === undefined) {
        return Promise.reject({ status: 400, msg: "Missing required fields" });
      };

    if(typeof inc_votes !== "number"){
        return Promise.reject({status:400, msg: "Bad request"})
    };
   return checkArticleExists(article_id_num)
    .then(() => {
    return db.query(`UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`, [inc_votes, article_id_num])
        .then(({rows}) => {
             return rows[0];
            });
              
         });
    };

    const selectCommentsByArticleId = (article_id) => {
        return db.query(`SELECT * FROM comments 
             WHERE article_id = 
             $1 ORDER BY created_at DESC;`, [article_id])
             .then((comments) => {
                 if(comments.rows.length === 0){
                     return Promise.reject({
                         status: 404, 
                         msg: "Not Found"
                     })
                 } else {
                 return comments.rows
                 };
             });
     };

     const insertCommentByArticleId = (commentBody, userName, article_id) => {
        if(!commentBody || !userName || !article_id){
            return Promise.reject({status:400, msg:"Missing required fields"})
        }
    
       return Promise.all([checkArticleExists(article_id), checkUserExists(userName)])
        .then(() => {
            return db.query(`INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *`, [userName, commentBody, article_id])
            .then((result) => {
                return result.rows[0]
        }) 
        }) 
    }

    const insertArticle = (title, topic, author, body, article_img_url) => {
        
        if(author === undefined || title === undefined || body === undefined || topic === undefined){
            return Promise.reject({
                status: 400,
                msg: "Missing required fields"
            })
        }

        if(typeof title !== "string"||
            typeof body !== "string"||
            typeof author !== "string"
        ){
            return Promise.reject({
                status: 400,
                msg: "Invalid input"
            })
        }
        const topicGreenList = [
        "mitch",
        "cats",
        "paper"
        ]
        
        if(topic && !topicGreenList.includes(topic)){
            return Promise.reject({
                status: 400,
                msg: "Invalid topic"
            })
        }

        const authorGreenList = ["lurker", "butter_bridge", "icedlluskars", "rogersop"]

        if(author && !authorGreenList.includes(author)){
            return Promise.reject({
                status: 400,
                msg: "Invalid author"
            })
        }

        return db.query(`
            INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [title, topic, author, body, article_img_url])

        .then(({rows}) => {
            return rows[0]
        })
    }
     

 


module.exports = {
    selectArticleById, 
    selectArticles, 
    updateArticleVotes, 
    selectCommentsByArticleId, 
    insertCommentByArticleId,
    insertArticle
}
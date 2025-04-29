const db = require("../../db/connection");

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

module.exports = {selectCommentsByArticleId}
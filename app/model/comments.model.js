const db = require("../../db/connection");
const {checkCommentExists, checkUserExists, checkArticleExists} = require("./utils")

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

const deleteComment = (comment_id) => {
  const comment_id_num = Number(comment_id)
  if(isNaN(comment_id_num)){
      return Promise.reject({status: 400, msg: "Bad request"})
  }
  return checkCommentExists(comment_id_num)
  .then(() => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    })
  }



   
    
  

module.exports = {
  selectCommentsByArticleId,
  insertCommentByArticleId, 
  checkArticleExists, 
  deleteComment}
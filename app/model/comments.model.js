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

const checkUserExists = async (user) => {
    const dbOutput = await db.query(
      `SELECT * FROM users WHERE users.username = $1;`,
      [user]
    );
    if (dbOutput.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "User not found" });
    } else {
        return true
    }
  };

  const checkArticleExists = async (article_id) => {
    const dbOutput = await db.query(
        `SELECT * FROM articles WHERE articles.article_id = $1;`,
        [article_id]
      );
      if (dbOutput.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
          return true
      }
    };

    const checkCommentExists = async (comment_id) => {
      const dbOutput = await db.query(
          `SELECT * FROM comments WHERE comments.comment_id = $1;`,
          [comment_id]
        );
        if (dbOutput.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Comment not found" });
        } else {
            return true
        }
      };
    
  

module.exports = {selectCommentsByArticleId,insertCommentByArticleId, checkArticleExists, 
deleteComment}
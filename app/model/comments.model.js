const db = require("../../db/connection");
const {checkCommentExists} = require("./utils")



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
  deleteComment
}
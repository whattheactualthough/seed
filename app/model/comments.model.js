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

  const updateCommentVotes = (comment_id, inc_votes) => {
    const comment_id_num = parseInt(comment_id)

    if(isNaN(comment_id_num)){
      return Promise.reject({
        status: 400, 
        msg: "Invalid comment id"})
    }

    if(inc_votes === undefined){
        return Promise.reject({ 
          status: 400, 
          msg: "Missing required fields" });
      };

      if(typeof inc_votes !== "number"){
              return Promise.reject({
                status: 400, 
                msg: "Bad request"})
          };
        
          return checkCommentExists(comment_id_num)
          .then(() => {
            return db.query(`
            UPDATE comments
            SET votes = votes + $1
            WHERE comment_id = $2
            RETURNING *;`, [inc_votes, comment_id_num])
          .then(({rows}) => {
              if(rows.length === 0){
                return Promise.reject({
                  status: 404,
                  msg: "Comment not found"})
              }
              return rows[0];
      });
    })
  }

module.exports = {
  deleteComment,
  updateCommentVotes
}
const {insertCommentById, insertCommentByArticleId, deleteComment} = require("../model/comments.model")



const deleteCommentByCommentId = (req, res, next) => {
    const {comment_id} = req.params;
    deleteComment(comment_id)
    .then((response) => {
        res.status(204)
        .send({})
    })
    .catch((err) => {
        next(err)
    })

}

module.exports = { 
    deleteCommentByCommentId
}
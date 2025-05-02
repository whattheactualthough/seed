const {deleteComment, updateCommentVotes} = require("../model/comments.model")



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

const patchCommentByCommentId = (req, res, next) => {
    const {comment_id} = req.params;
    const {inc_votes} = req.body;
    console.log(inc_votes)
    updateCommentVotes(comment_id, inc_votes)
    .then((comment) => {
        res.status(200)
        .send({comment})
    })
    .catch((err) => {
        next(err)
    })
}



module.exports = { 
    deleteCommentByCommentId,
    patchCommentByCommentId
}
const {selectCommentsByArticleId, insertCommentById, insertCommentByArticleId} = require("../model/comments.model")

const getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200)
        .send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

const postCommentByArticleId = (req, res, next)=> {
    const {article_id} = req.params
    const userName = req.body.username
    const commentBody = req.body.body
    insertCommentByArticleId(commentBody, userName, article_id)
    .then((comment) => {
        res.status(201)
        .send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getCommentsByArticleId, postCommentByArticleId}
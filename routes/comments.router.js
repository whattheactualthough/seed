const commentsRouter = require("express").Router();
const {deleteCommentByCommentId} = require("../app/controller/comments.controller")


commentsRouter.delete("/:comment_id", deleteCommentByCommentId)

module.exports = commentsRouter
const commentsRouter = require("express").Router();
const {deleteCommentByCommentId,
    patchCommentByCommentId
} = require("../app/controller/comments.controller")


commentsRouter.delete("/:comment_id", deleteCommentByCommentId)

commentsRouter.patch("/:comment_id", patchCommentByCommentId)

module.exports = commentsRouter
const articlesRouter = require("express").Router();
const {
    getArticleById, 
    getArticles, 
    patchArticleByArticleId, 
    getCommentsByArticleId, 
    postCommentByArticleId, 
    postArticle
    } = require("../app/controller/articles.controller")

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/", getArticles)

articlesRouter.patch("/:article_id", patchArticleByArticleId)

articlesRouter.get("/:article_id/comments", getCommentsByArticleId)

articlesRouter.post("/:article_id/comments", postCommentByArticleId)

articlesRouter.post("/", postArticle)

module.exports = articlesRouter
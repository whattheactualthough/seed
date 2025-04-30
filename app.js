const express = require("express");
const app = express();
const {getApi} = require("./app/controller/api.controller")
const {getTopics} = require("./app/controller/topics.controller")
const {getArticleById, getArticles, patchArticleByArticleId} = require("./app/controller/articles.controller")
const {getCommentsByArticleId, postCommentByArticleId} = require("./app/controller/comments.controller")


app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleByArticleId)


app.use((err, req, res, next)=> {
    if(err.code === "22P02"){
        res.status(400)
        .send({msg: "Bad Request"})
    } else if(err.status && err.msg){
        res.status(err.status)
        .send({msg: err.msg})
    }
    else {
        console.log(err)
        res.status(500)
    .send({msg: "Internal Server Error"})
    }
    });


module.exports = app;
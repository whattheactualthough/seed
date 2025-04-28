const express = require("express");
const app = express();
const {getApi} = require("./app/controller/api.controller")
const {getTopics} = require("./app/controller/topics.controller")

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.use((err, req, res, next)=> {
    res.status(500).send({msg: "Internal Server Error"})
})

module.exports = app;
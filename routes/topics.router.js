const topicsRouter = require("express").Router();
const {getTopics} = require("../app/controller/topics.controller");
const apiRouter = require("./api.router");

topicsRouter.get("/", getTopics)

module.exports = topicsRouter
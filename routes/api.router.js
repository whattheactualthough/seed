const express = require('express');
const apiRouter = express.Router();
const {getApi} = require("../app/controller/api.controller")


apiRouter.get("/", getApi);


module.exports = apiRouter
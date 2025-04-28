const express = require("express");
const app = express();
const {getApi} = require("./app/connection/api.connection")

app.get("/api", getApi)

module.exports = app
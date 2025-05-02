const usersRouter = require("express").Router();
const {getUsers} = require("../app/controller/users.controller")


usersRouter.get("/", getUsers)

module.exports = usersRouter
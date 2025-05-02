const usersRouter = require("express").Router();
const {getUsers, getUserByUsername} = require("../app/controller/users.controller")


usersRouter.get("/", getUsers)

usersRouter.get("/:username", getUserByUsername)

module.exports = usersRouter
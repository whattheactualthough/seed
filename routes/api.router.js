const express = require('express');
const apiRouter = express.Router();
const {getApi} = require("../app/controller/api.controller")


apiRouter.get("/", getApi);
// apiRouter.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
//   });


module.exports = apiRouter
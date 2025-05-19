const express = require("express");
const app = express();
const apiRouter = require("./routes/api.router");
const usersRouter = require("./routes/users.router");
const topicsRouter = require("./routes/topics.router");
const articlesRouter = require("./routes/articles.router");
const commentsRouter = require("./routes/comments.router");
app.use(express.json());
const errorHandler = require("./errors/errorHandling")
const cors = require('cors');

app.use(cors());
app.use("/api", apiRouter); //is this app?
apiRouter.use('/users', usersRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter)

app.use(errorHandler)


module.exports = app;
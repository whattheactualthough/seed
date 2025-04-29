const selectTopics = require("../model/topics.model")

const getTopics = (req, res) => {
    selectTopics()
    .then((topics) => {
        res.status(200)
        .send({topics})
    })
    .catch((err) => {
        next(err)
    });
};
module.exports = {getTopics}
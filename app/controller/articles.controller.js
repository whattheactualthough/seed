const {selectArticleById, selectArticles, updateArticleVotes} = require("../model/articles.model")

const getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    });
};

const getArticles = (req, res, next) => {
    const {sort_by} = req.query;
    const {order} = req.query;
    selectArticles(sort_by, order)
    .then((articles) => {
        res.status(200)
        .send({articles})
    })
    .catch((err) => {
        next(err);
    });
 };

 const patchArticleByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body
    console.log(article_id, inc_votes)
    updateArticleVotes(article_id, inc_votes)
    .then((article) =>{
        res.status(200)
        .send({article})
    })
    .catch((err) => {
        next(err)
    })
 }
 

module.exports = {
    getArticleById, 
    getArticles, 
    patchArticleByArticleId
}


const {sendApi } = require("../model/api.model.js")

const getApi = (req, res, next) => {
    sendApi()
    .then((endpoints)=>{
    console.log(endpoints)
    res.status(200).send({endpoints})

});
}

module.exports = {getApi}
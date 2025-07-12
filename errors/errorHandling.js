function errorHandler(err, req, res, next){
    if(err.code === "22P02"){
        res.status(400)
        .send({msg: "Bad Request"})
    } 
    if(err.code === "23505"){
        res.status(400)
        .send("Invalid input")
        }else if(err.status && err.msg){
        res.status(err.status)
        .send({msg: err.msg})
    }
    else {
        res.status(500)
    .send({msg: "Internal Server Error"})
    }
    };

module.exports = errorHandler

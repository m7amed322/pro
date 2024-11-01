module.exports = function(err,req,res,next){
    res.status(400).send(err.message);
}
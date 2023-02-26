const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticatorUser = (req,res,next) => {
    let token = req.headers.authorization;
    if(token){
        jwt.verify(token, process.env.secretkey , (err, decoded)=>{
           if(err){
                res.send({"msg":"Something went wrong","error":err});
           }else{
                req.body.userID = decoded.userID;
                req.body.admin = decoded.admin;
                next();
           }
        });
    }else{
        res.send({"msg":"Please Login First",token:false});
    }
}



module.exports = {authenticatorUser}
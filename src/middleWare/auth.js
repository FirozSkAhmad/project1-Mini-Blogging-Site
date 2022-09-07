const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const jwt = require("jsonwebtoken")

const Authentication  = async function(req,res,next) {
try {
    const getToken = req.headers["x-auth-token"]
    console.log(getToken);
    if(!token){
        return res.status(401).send({staus: false, msg : "require token "})
    }

    let decodePaylode = jwt.verify(getToken,"project-pltm")
    console.log(decodePaylode);
    if(!decodePaylode){
        return res.status(401).send({status: false , msg : "Invalid token"})
    }
     next()
    
} catch (error) {
    return res.status(500).send({staus: false,msg: error.message})
    
}
}

module.exports.Authentication=Authentication
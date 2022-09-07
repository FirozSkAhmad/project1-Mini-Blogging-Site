const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const jwt = require("jsonwebtoken");

const Authentication = async function (req, res, next) {
  try {
    const getToken = req.headers["x-auth-token"];
    if (!getToken) {
      return res.status(401).send({ staus: false, msg: "require token " });
    }
    jwt.verify(getToken, "project-pltm", (error,decoded) => {
      if (error) {
        return res.status(401).send({ status: false, msg: error.message });
      } else {
        req.decodedPayload = decoded;
        // {
        //     decodedPayload:{
        //         authorId : logined._id.toString(),
        //         batch : "Plutonium"
        //     }
        // }
        console.log(req.decodedPayload)
        next();
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ staus: false, msg: error.message });
  }
};

async function Authorisation(req,res,next){
    try{
        let authorId = req.decodedPayload.authorId
        let data = await blogModel.findById(req.params.blogId)
        console.log(data.authorId);
        let dataAuthorId = data.authorId.toString()
        if(dataAuthorId === authorId){
            next()
        }else{
            return res.status(403).send({status : false, msg : "User not authorised"})
        }
    }catch(error){
        res.status(500).send({status : false, msg : error.message})
    }
}

module.exports.Authentication = Authentication;
module.exports.Authorisation = Authorisation

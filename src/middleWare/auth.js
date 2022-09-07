const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const jwt = require("jsonwebtoken");

const Authentication = async function (req, res, next) {
  try {
    const getToken = req.headers["x-auth-token"];
    if (!getToken) {
      return res.status(401).send({ staus: false, msg: "require token" });
    }
    jwt.verify(getToken, "project-pltm", (error, decoded) => {
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
        // console.log(req.decodedPayload);
        next();
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ staus: false, msg: error.message });
  }
};

async function Authorisation1(req, res, next) {
  try {
    let authorId = req.decodedPayload.authorId;
    let data = await blogModel.findById(req.params.blogId);
    // console.log(data.authorId);
    let dataAuthorId = data.authorId.toString();
    if (dataAuthorId === authorId) {
      next();
    } else {
      return res
        .status(403)
        .send({ status: false, msg: "User not authorised" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
}

async function Authorisation2(req, res, next) {
  try {
    req.authorId = req.decodedPayload.authorId;
    let data = await blogModel.find(req.query).select({ authorId: 1, _id: 0 });
    // console.log(data);
    let Id = "";
    const authorIds = data.map((x) => x.authorId.toString());
    console.log(authorIds);
    for (let i = 0; i < authorIds.length; i++) {
      if (authorIds[i] === req.authorId) {
        // console.log(req.authorId);
        if (!Id) {
          Id += req.authorId;
        }
      }
    }
    // console.log(Id);
    if (!Id) {
      return res
        .status(403)
        .send({ status: false, msg: "User not authorised" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
}

module.exports.Authentication = Authentication;
module.exports.Authorisation1 = Authorisation1;
module.exports.Authorisation2 = Authorisation2;

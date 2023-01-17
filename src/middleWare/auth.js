const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//==============================Authentication========================================//

const Authentication = async function (req, res, next) {
  try {
    const getToken = req.headers["x-api-key"];
    if (!getToken) {
      return res.status(401).send({ staus: false, msg: "require token" });
    }
    jwt.verify(getToken, "project-pltm", (error, decoded) => {
      if (error) {
        return res.status(401).send({ status: false, msg: error.message });
      } else {
        req.decodedPayload = decoded;
        next();
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ staus: false, msg: error.message });
  }
};

//==============================Authorisation1========================================//

async function Authorisation1(req, res, next) {
  try {
    let authorId = req.decodedPayload.authorId;
    let dataAuthorId = req.dataAuthorId
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

//==============================Authorisation2========================================//

async function Authorisation2(req, res, next) {
  try {
    req.authorId = req.decodedPayload.authorId;
    const Data = req.query;
    if (Object.keys(Data).length < 1) {
      return res
        .status(400)
        .send({ status: false, msg: "required atleast one filter" });
    }
    if (Object.keys(Data).includes("category")) {
      if (!Data.category) {
        return res
          .status(400)
          .send({ status: false, msg: "required category" });
      }
    }
    if (Object.keys(Data).includes("authorId")) {
      if (!Data.authorId) {
        return res
          .status(400)
          .send({ status: false, msg: "required authorId" });
      }
    }
    if (Object.keys(Data).includes("tags")) {
      if (!Data.tags) {
        return res.status(400).send({ status: false, msg: "required tags" });
      }
    }
    if (Object.keys(Data).includes("subcategory")) {
      if (!Data.subcategory) {
        return res
          .status(400)
          .send({ status: false, msg: "required subcategory" });
      }
    }
    if (Object.keys(Data).includes("isPublished")) {
      if (!Data.isPublished) {
        return res
          .status(400)
          .send({ status: false, msg: "required isPublished" });
      }
      if (Data.isPublished === "true") {
        return res
          .status(400)
          .send({ status: false, msg: "isPublished should be false" });
      }
    }
    let data = await blogModel.find(Data).select({ authorId: 1, _id: 1 });
    if (data.length === 0) {
      return res.status(404).send({ status: false, msg: "Data not founded" });
    }
    req.Ids = [];
    const authorIds = data.map((x) => x.authorId.toString());
    const blogIds = data.map((x) => x._id.toString());
    for (let i = 0; i < authorIds.length; i++) {
      if (authorIds[i] === req.authorId) {
        req.Ids.push(blogIds[i]);
      }
    }
    if (req.Ids.length === 0) {
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

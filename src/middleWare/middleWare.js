const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//==============================checkAuthId========================================//

async function checkAuthId(req, res, next) {
  try {
    const Data = req.body;
    if (Object.keys(Data).length < 1) {
      return res.status(400).send({ status: false, msg: "required Data" });
    }
    if (!Data.authorId) {
      return res.status(400).send({ status: false, msg: "required authorId" });
    }
    let Id = Data.authorId.trim();
    if (!ObjectId.isValid(Id)) {
      return res
        .status(400)
        .send({ status: false, msg: `${Id} is not a valid authorId` });
    }
    const getData = await authorModel.findById(Id);
    if (!getData) {
      return res
        .status(400)
        .send({ status: false, msg: "author doesn't exists" });
    }
    let authorId = req.decodedPayload.authorId;
    let dataAuthorId = req.body.authorId;
    if (dataAuthorId === authorId) {
      next();
    } else {
      return res
        .status(403)
        .send({
          status: false,
          msg: "not authorized to use these authorId to create a blog",
        });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

//==============================checkBlogId========================================//

async function checkBlogId(req, res, next) {
  try {
    let Id = req.params.blogId;
    if (Id == ":blogId") {
      return res.status(400).send({ status: false, msg: "required blogId" });
    }
    if (!ObjectId.isValid(Id)) {
      return res
        .status(400)
        .send({ status: false, msg: `${Id} is not a valid blogId` });
    }
    const getData = await blogModel.findOne({ _id: Id });
    if (!getData) {
      return res.status(404).send({
        status: false,
        msg: "blog not founded",
      });
    }
    req.dataAuthorId = getData.authorId.toString()
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

module.exports.checkAuthId = checkAuthId;
module.exports.checkBlogId = checkBlogId;

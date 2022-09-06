const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");

async function checkAuthId(req, res, next) {
  try {
    const Data = req.body;
    if (!Data) {
      return res.status(400).send({ status: false, msg: "required Data" });
    }
    let Id = Data.authorId;
    const getData = await authorModel.findById(Id);
    if (!getData) {
      return res
        .status(400)
        .send({ status: false, msg: "required valid authorId" });
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

async function checkBlogId(req, res, next) {
  try {
    let Id = req.params.blogId;
    const getData = await blogModel.findOne({ _id: Id });
    if (!getData) {
      return res.status(404).send({
        status: false,
        msg: "required valid blogId",
      });
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

module.exports.checkAuthId = checkAuthId;
module.exports.checkBlogId = checkBlogId;

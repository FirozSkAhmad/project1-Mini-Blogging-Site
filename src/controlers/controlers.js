const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const moment = require("moment");

async function createAuthorData(req, res) {
  try {
    const Data = req.body;
    const saveData = await authorModel.create(Data);
    return res.status(201).send({ status: true, data: saveData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

async function createBlogData(req, res) {
  try {
    const Data = req.body;
    const saveData = await blogModel.create(Data);
    return res.status(201).send({ status: true, data: saveData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

async function getBlogs(req, res) {
  try {
    const Data = req.query;
    Data.isDeleted = false;
    Data.isPublished = true;
    const saveData = await blogModel.find(Data);
    return res.status(200).send({ status: true, data: saveData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

async function updateBlogs(req, res) {
  try {
    const Id = req.params.blogId;
    const Data = req.body;
    if (!Data) {
      return res.status(400).send({ status: false, msg: "Bad request" });
    }
    const getData = await blogModel.findByIdAndUpdate(
      { _id: Id },
      { $push: { tags: Data.tags, subcategory: Data.subcategory } },
    );
    if (getData.isPublished === false) {
      console.log(Data);
      delete Data["tags"];
      delete Data["subcategory"];
      console.log(Data);
      Data.isPublished = true;
      Data.publishedAt = moment().format("YYYY");

      const updatedData = await blogModel.findByIdAndUpdate(
        { _id: Id },
        { $set: Data },
        { new: true }
      );
      return res.status(200).send({ status: true, data: updatedData });
    } else {
      console.log(Data);
      delete Data["tags"];
      delete Data["subcategory"];
      const updatedData = await blogModel.findByIdAndUpdate(
        { _id: Id },
        { $set: Data },
        { new: true }
      );
      return res.status(200).send({ status: true, data: updatedData });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

module.exports.createAuthorData = createAuthorData;
module.exports.createBlogData = createBlogData;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;

const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");

async function createAuthorData(req, res) {
  try {
    const Data = req.body;
    const saveData = await authorModel.create(Data);
    return res.status(201).send(saveData);
  } catch (err) {
    return res.status(500).send({ msg: "error", error: err.message });
  }
}

async function createBlogData(req, res) {
  try {
    const Data = req.body;
    const saveData = await blogModel.create(Data);
    return res.status(201).send(saveData);
  } catch (err) {
    return res.status(500).send({ msg: "error", error: err.message });
  }
}

async function getBlogs(req, res) {
  try {
    const Data = req.query;
    Data.isDeleted = false;
    Data.isPublished = true;
    const saveData = await blogModel.find(Data);
    return res.status(201).send(saveData);
  } catch (err) {
    return res.status(500).send({ msg: "error", error: err.message });
  }
}

module.exports.createAuthorData = createAuthorData;
module.exports.createBlogData = createBlogData;
module.exports.getBlogs = getBlogs;
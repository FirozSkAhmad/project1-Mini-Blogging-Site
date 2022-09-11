const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const validator = require("validator");
function checkPassword(str) {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
  return re.test(str);
}

//==============================createAuthorData========================================//

async function createAuthorData(req, res) {
  try {
    const Data = req.body;
    if (Object.keys(Data).length < 1) {
      return res.status(400).send({ status: false, msg: "Bad request" });
    }
    if (!Data.fname) {
      return res.status(400).send({ status: false, msg: "required fname" });
    }
    if (!Data.lname) {
      return res.status(400).send({ status: false, msg: "required lname" });
    }
    if (!Data.title) {
      return res.status(400).send({ status: false, msg: "required title" });
    }
    if (!["Mr", "Mrs", "Miss"].includes(Data.title.trim())) {
      return res
        .status(400)
        .send({ status: false, msg: "required valid title" });
    }
    if (!validator.isEmail(Data.email.trim())) {
      return res
        .status(400)
        .send({ status: false, msg: "required valid email" });
    }
    const findAuthorId = await authorModel.find({ email: Data.email });
    if (findAuthorId.length > 0) {
      return res
        .status(400)
        .send({ status: false, msg: "email is already taken" });
    }
    if (!Data.password) {
      return res.status(400).send({ status: false, msg: "required password" });
    }
    if (!checkPassword(Data.password.trim())) {
      return res.status(400).send({
        status: false,
        msg: "password should contain at least 1 lowercase, uppercase ,numeric alphabetical character and at least one special character and also The string must be eight characters or longer",
      });
    }
    const savedData = await authorModel.create(Data);
    return res.status(201).send({ status: true, data: savedData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

//==============================login========================================//

async function login(req, res) {
  try {
    const data = req.body;
    if (Object.keys(data).length < 1) {
      return res
        .status(400)
        .send({ status: false, msg: "required email and password" });
    }
    if (!data.email) {
      return res.status(400).send({ status: false, msg: "email is required" });
    }
    if (!data.password) {
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });
    }

    const logined = await authorModel.findOne(data);
    if (!logined) {
      return res
        .status(401)
        .send({ status: false, msg: "email or password is wrong" });
    }
    const token = jwt.sign(
      {
        authorId: logined._id.toString(),
        batch: "Plutonium",
      },
      "project-pltm"
    );
    return res.status(201).send({ status: true, data: token });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

//==============================createBlogData========================================//

async function createBlogData(req, res) {
  try {
    const Data = req.body;
    if (!Data.title) {
      return res.status(400).send({ status: false, msg: "required title" });
    }
    if (!Data.body) {
      return res.status(400).send({ status: false, msg: "required body" });
    }
    if (!Data.category) {
      return res.status(400).send({ status: false, msg: "required category" });
    }
    const savedData = await blogModel.create(Data);
    return res.status(201).send({ status: true, data: savedData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

//==============================getBlogs========================================//

async function getBlogs(req, res) {
  try {
    const Data = req.query;
    if (Object.keys(Data).includes("authorId")) {
      if (!Data.authorId) {
        return res
          .status(400)
          .send({ status: false, msg: "required authorId" });
      }
    }
    if (Object.keys(Data).includes("category")) {
      if (!Data.category) {
        return res
          .status(400)
          .send({ status: false, msg: "required category" });
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
    Data.isDeleted = false;
    Data.isPublished = true;
    const savedData = await blogModel.find(Data);
    if (savedData.length === 0) {
      return res.status(404).send({ status: false, msg: "page not founded" });
    }
    return res.status(200).send({ status: true, data: savedData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

//==============================updateBlogs========================================//

async function updateBlogs(req, res) {
  try {
    const Id = req.params.blogId;
    const Data = req.body;
    if (Object.keys(Data).includes("title")) {
      if (!Data.title) {
        return res.status(400).send({ status: false, msg: "required title" });
      }
    }
    if (Object.keys(Data).includes("body")) {
      if (!Data.body) {
        return res.status(400).send({ status: false, msg: "required body" });
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
    const getData = await blogModel.findOneAndUpdate(
      { _id: Id, isDeleted: false },
      { $push: { tags: Data.tags, subcategory: Data.subcategory } }
    );
    if (!getData) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog already deleted" });
    }
    if (getData.isPublished === false) {
      // console.log(Data);
      delete Data["tags"];
      delete Data["subcategory"];
      // console.log(Data)//;
      Data.isPublished = true;
      Data.publishedAt = moment().format();

      const updatedData = await blogModel.findByIdAndUpdate(
        { _id: Id },
        { $set: Data },
        { new: true }
      );
      return res.status(200).send({ status: true, data: updatedData });
    } else {
      // console.log(Data);
      delete Data["tags"];
      delete Data["subcategory"];
      // console.log(Data);
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

//==============================deleteBlogById========================================//

let deleteBlogById = async function (req, res) {
  try {
    let Id = req.params.blogId;
    const deletedData = await blogModel.updateMany(
      { _id: Id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: moment().format(),
        },
      },
      { new: true }
    );
    if (deletedData.modifiedCount === 0) {
      return res.status(404).send({ status: false, msg: "Blog already deleted" });
    }
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//==============================deleteBlog========================================//

let deleteBlog = async function (req, res) {
  try {
    const deletedBlog = await blogModel.updateMany(
      { _id:{$in:req.Ids}, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: moment().format(),
        },
      },
      { new: true }
    );
    if (deletedBlog.modifiedCount === 0) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog already deleted" });
    }
    return res.status(200).send({ status: true, data: deletedBlog });
  } catch (err) {
    return res.status(500).send({ msg: "error", error: err.message });
  }
};

module.exports.createAuthorData = createAuthorData;
module.exports.login = login;
module.exports.createBlogData = createBlogData;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;
module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteBlog = deleteBlog;


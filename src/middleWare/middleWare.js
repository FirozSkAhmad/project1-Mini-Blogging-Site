const authorModel = require("../model/authorModel");

async function checkAuthId(req, res, next) {
  try {
    const Data = req.body;
    if (!Data) {
      return res.status(400).send("required Data");
    }
    let Id = Data.authorId;
    const getData = await authorModel.findById(Id);
    if (!getData) {
      return res.status(400).send("required valid authorId");
    }
    next();
  } catch (err) {
    return res.status(500).send({ msg: "error", error: err.message });
  }
}

module.exports.checkAuthId = checkAuthId;
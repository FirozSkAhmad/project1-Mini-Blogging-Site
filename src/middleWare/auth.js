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
        console.log(req.decodedPayload)
        next();
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ staus: false, msg: error.message });
  }
};

module.exports.Authentication = Authentication;

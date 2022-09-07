const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const jwt = require("jsonwebtoken")

const Authentication = async function (req, res, next) {
    try {
        const getToken = req.headers["x-auth-token"]
        console.log(getToken);
        if (!getToken) {
            return res.status(401).send({ staus: false, msg: "require token " })
        }

         req.decodePaylode = jwt.verify(getToken, "project-pltm")
        console.log(decodePaylode);
        if (!req.decodePaylode) {
            return res.status(401).send({ status: false, msg: "Invalid token" })
        }
        next()

    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ staus: false, msg: error.message })

    }
}

module.exports.Authentication = Authentication
const express = require("express");
const router = express.Router();
const controlers = require("../controlers/controlers");
const middleWare=require("../middleWare/middleWare")

router.get("/test-me", function (req, res) {
  res.send("Working fine");
});

router.post("/createAuthorData", controlers.createAuthorData);
router.post("/createBlogData",middleWare.checkAuthId,controlers.createBlogData);
router.get("/getBlogs",controlers.getBlogs);


module.exports = router;

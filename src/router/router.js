const express = require("express");
const router = express.Router();
const controlers = require("../controlers/controlers");
const middleWare=require("../middleWare/middleWare")

router.get("/test-me", function (req, res) {
  res.send("Working fine");
});

router.post("/authors", controlers.createAuthorData);
router.post("/blogs",middleWare.checkAuthId,controlers.createBlogData);
router.get("/blogs",controlers.getBlogs);


module.exports = router;

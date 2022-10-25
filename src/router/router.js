const express = require("express");
const router = express.Router();
const controlers = require("../controlers/controlers");
const middleWare = require("../middleWare/middleWare");
const authWare = require("../middleWare/auth");

router.get("/test-me", function (req, res) {
  res.send("Working fine");
});

router.post("/authors", controlers.createAuthorData);
router.post("/login", controlers.login);
router.post(
  "/blogs",
  authWare.Authentication,
  middleWare.checkAuthId,
  controlers.createBlogData
);
router.get("/blogs", authWare.Authentication, controlers.getBlogs);
router.put(
  "/blogs/:blogId",
  authWare.Authentication,
  middleWare.checkBlogId,
  authWare.Authorisation1,
  controlers.updateBlogs
);
router.delete(
  "/blogs/:blogId",
  authWare.Authentication,
  middleWare.checkBlogId,
  authWare.Authorisation1,
  controlers.deleteBlogById
);
router.delete(
  "/blogs",
  authWare.Authentication,
  authWare.Authorisation2,
  controlers.deleteBlog
);

module.exports = router;


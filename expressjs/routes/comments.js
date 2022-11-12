var express = require("express");
var router = express.Router();
var articleService = require("./../services/articleService");

router.post("/", (req, res, next) => {
  if (req.session.user) {
    const p = articleService.commentOnArticle(req, req.session.user);
    p.then((commentId) => {
      res.status(200).send({ id: commentId });
    }).catch((err) => {
      throw err;
      // res.status(500).send(err);
    });
  } else {
    res.status(401).send({ error: "UNAUTHORIZED" });
  }
});

module.exports = router;

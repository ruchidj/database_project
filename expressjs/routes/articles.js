var express = require("express");
var router = express.Router();
var articleService = require("./../services/articleService");

router.get("/", function (req, res, next) {
  console.log("Inside Articles");
  if (req.session.user) {
    if (req.query.categoryId) {
      const p = articleService.searchByCategory(
        req.query.categoryId,
        req.session.user
      );
      p.then((articles) => {
        res.status(200).send(articles);
      }).catch((err) => {
        res.status(400).send({ error: "INTERNALERROR" });
      });
    } else {
      let currentUser = req.session.user;
      const p = articleService.getUserArticles(currentUser);
      p.then((articles) => {
        res.status(200).send(articles);
      }).catch((err) => {
        res.status(400).send({ error: "INTERNALERROR" });
      });
    }
  } else {
    res.status(401).send({ error: "UNAUTHORIZED" });
  }
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  if (req.session.user) {
    let currentUser = req.session.user;
    const p = articleService.getArticle(id, currentUser);
    p.then((article) => {
      if (checkAgeRestriction(currentUser, article)) {
        res.status(200).send(article);
      } else {
        res.status(403).send({ error: "PERMISSIONDENIED" });
      }
    }).catch((err) => {
      res.status(500).send("Internal Server Error");
    });
  } else {
    res.status(401).send({ error: "UNAUTHORIZED" });
  }
});

router.post("/", (req, res, next) => {
  if (req.session.user) {
    const p = articleService.createArticle(req, req.session.user);
    p.then((articleId) => {
      res.status(200).send({ id: articleId });
    }).catch((err) => {
      throw err;
      // res.status(500).send(err);
    });
  } else {
    res.status(401).send({ error: "UNAUTHORIZED" });
  }
});

function checkAgeRestriction(user, article) {
  return user.age >= article.minimumAge;
}

module.exports = router;

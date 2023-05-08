const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

mongoose.connect("mongodb://127.0.0.1:27017/wikiDb");
const article = mongoose.model("article", {
  title: String,
  description: String,
});

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app
  .route("/articles")
  .delete(async function (req, res) {
    try {
      await article.deleteMany({});
      res.send("sucessfully deleted all the articles");
    } catch (err) {
      res.send(err);
    }
  })
  .get(async function (req, res) {
    try {
      const articles = await article.find({});
      res.send(articles);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving articles");
    }
  })
  .post(function (req, res) {
    let title = req.body.title;
    let description = req.body.description;
    var doc = new article({ title: title, description: description });
    try {
      doc.save();
      res.redirect("/articles");
    } catch (err) {
      res.send(err);
    }
  });
app.get("/form", function (req, res) {
  res.sendFile(__dirname + "/form.html");
});

app
  .route("/articles/:article")
  .get(async function (req, res) {
    var articleName = req.params.article;
    try {
      var result = await article.find({ title: articleName });
      res.send(result);
    } catch (err) {
      res.send(err);
    }
  })
  .put(async function (req, res) {
    try {
      await article.replaceOne(
        { title: req.params.article },
        { title: req.body.title, description: req.body.description },
        { overwrite: true }
      );
      res.send("sucessfully update the article");
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async function (req, res) {
    try {
      await article.deleteOne({ title: req.params.article });
      res.send("deleted the article sucessfully!!");
    } catch (err) {
      res.send(err);
    }
  });

app.listen(3000, function (err) {
  console.log("the server is running at port 3000");
});

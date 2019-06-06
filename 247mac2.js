var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.json());
var PORT = process.env.PORT || 8080;
var axios = require("axios");
var cheerio = require("cheerio");
var mongojs = require('mongojs')
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var db = mongojs("mongodb://rand:7$Whiskey@ds145573.mlab.com:45573/heroku_j432lq39", ["articles"])

axios.get('https://www.idownloadblog.com/').then(function (response) {
  var $ = cheerio.load(response.data);

  var bulk = db.articles.initializeUnorderedBulkOp();
  bulk.find({ Saved: 0 }).remove();
  bulk.execute();

  $("article.news-block").each(function (i, element) {
    let link = $(element).children().children().attr("href");
    let image = $(element).children().children().children().attr("data-src");
    let headline = $(element).children().closest('header').children().children().closest('a').text();
    headline = headline.substring(0, headline.length - 14);
    let excerpt = $(element).children().closest('header').children().closest('.excerpt').children().text();
    let author = $(element).children().closest('header').children().closest('p').children().closest('span').children().children().text();
    let date = $(element).children().closest('header').children().closest('p').children().closest('.article-date').children().text();
    let articleId = $(element).attr("id");
    db.articles.insert(
      {
        Headline: headline,
        Link: link,
        Image: image,
        Excerpt: excerpt,
        Author: author,
        Date: date,
        Saved: 0,
        Id: articleId
      }
    );
  });
});

app.get("/", function (req, res) {
  db.articles.find(function (err, docs) {
    res.render("index", { data: docs });
  });
});

app.post("/save/:id", function (req, res) {
  var saveId = req.params.id;
  db.articles.findAndModify({
    query: { Id: saveId },
    update: { $set: { Saved: 1 } },
    new: true
  }, function (err, doc, lastErrorObject) {
  })
});

app.get("/saved", function (req, res) {
  db.articles.find(function (err, docs) {
    res.render("saved", { data: docs });
  });
});

app.post("/unsave/:id", function (req, res) {
  var saveId = req.params.id;
  db.articles.findAndModify({
    query: { Id: saveId },
    update: { $set: { Saved: 0 } },
    new: true
  }, function (err, docs, lastErrorObject) {
    db.articles.find(function (err, docs) {
      res.render("saved", { data: docs });
    });
  })
});

app.get("/view/:id", function (req, res) {
  var saveId = req.params.id;
  db.articles.findOne({
    Id: saveId
  }, function (err, docs) {
    res.render("article", { data: docs })
  })
});

app.post("/comment/:id", function (req, res) {
  var commentId = req.params.id;
  var comment = req.body.comment;
  console.log(commentId);
  console.log(comment);
  db.articles.findAndModify({
    query: { Id: commentId },
    update: { $set: { Comment: comment } },
    new: true
  }, function (err, docs, lastErrorObject) {
    res.render("article", { data: docs })
  })
});

app.listen(process.env.PORT, function () {
  console.log("web server is running on port: " + PORT)
});

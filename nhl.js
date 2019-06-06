var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.json());
var PORT = 8080;
var axios = require("axios");
var cheerio = require("cheerio");
var mongojs = require('mongojs')
var db = mongojs("mongodb://rand:7$Whiskey@ds145573.mlab.com:45573/heroku_j432lq39", ["articles"])

axios.get('https://www.9to5mac.com/').then(function (response) {
  // console.log(response.data);
  var $ = cheerio.load(response.data);
  $("a.more-article").each(function (i, element) {
    let headline = $(element).text();
    var link = $(element).attr("href");
    console.log(link);
    console.log(headline);
    // db.nhlWeb.insert(
    //   {
    //     Headline: headline,
    //     Link: link
    //   }
    // );
  });
});

app.get("/", function (req, res) {
  db.articles.find(function (err, docs) {
    // console.log(docs);
    res.render("index", { data: docs });
  });
});

app.listen(PORT, function () {
  console.log("web server is running on port: " + PORT)
});
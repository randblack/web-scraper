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
  var $ = cheerio.load(response.data);
  $("article.post-content").each(function (i, element) {
    // let link = $(element).children().children().children().attr("href");
    // let image = $(element).children().children().children().children().children().children().attr("content");
    let image = $(element).children().children().children().children();
    // if(image == undefined) {
    //   image = $(element).children().attr("href");
    // }
    // var link = $(element).children().attr("href");
    console.log('image ' + image);
    // console.log('headline ' + headline);



    //   db.articles.insert(
    //     {
    //       Headline: headline,
    //       Link: link
    //     }
    //   );
  });
});

// app.get("/", function (req, res) {
//   db.articles.find(function (err, docs) {
//     // console.log(docs);
//     res.render("index", { data: docs });
//   });
// });

app.listen(PORT, function () {
  console.log("web server is running on port: " + PORT)
});
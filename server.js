var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.json());
var PORT = 8080;
var mongojs = require('mongojs')
var db = mongojs("mongodb://rand:7$Whiskey@ds145573.mlab.com:45573/heroku_j432lq39", ["randCollection"])



app.get("/", function (req, res) {
  db.randCollection.find(function (err, docs) {
    console.log(docs);
    res.render("index", { data: docs });
  });
});

app.post("/api/post-mongo", function (req, res) {
  db.randCollection.insert(
    req.body
  );
  res.json({
    "hello": "world"
  });
});

app.put("/api/put-mongo", function (req, res) {
  db.randCollection.update(
    req.body.where, {
      $set: req.body.set
    }
  );
  res.json({
    "hello": "world"
  })
});

app.delete("/api/delete-mongo", function (req, res) {
  db.randCollection.remove(
    req.body.where
  );
  res.json({
    "hello": "world5"
  });
});

app.listen(PORT, function () {
  console.log("web server is running on port: " + PORT)
});
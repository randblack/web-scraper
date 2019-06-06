var express = require('express');
var app = express();
var PORT = 8080;
app.use(express.json());

var Sequelize = require('sequelize');
var sequelize = new Sequelize("personal_journal_db", "webuser", "UCR", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

var Events = sequelize.define('events', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type_code: {
    type: Sequelize.STRING
  },
  journal_time: {
    type: Sequelize.DATE
  },
  begin_time: {
    type: Sequelize.DATE
  },
  end_time: {
    type: Sequelize.DATE
  },

}, {
    timestamps: false
  });

app.get("/api/get", function (req, res) {
  console.log("Hello World!");

  Events.findAll().then(function (recordsFound) {
    console.log("results: ", recordsFound);
    res.json(recordsFound);
  });
});

app.put("/api/put", function (req, res) {
  Events.update({
    type_code: req.body.type_code
  }, {
      where: {
        id: req.body.id
      }
    }).then(function (sequelizeResponse) {
      console.log("SEQUELIZE-RESPONSE", sequelizeResponse);
      res.json(sequelizeResponse);
    });
});

app.delete("/api/delete", function (req, res) {
  Events.destroy({
    where: {
      id: 2
    }
  }).then(function (rowsDeleted) {
    console.log("DESTORY: ", rowsDeleted);
    res.json(rowsDeleted);
  });
});

app.post("/api/post", function (req, res) {
  Events.create({
    type_code: 'READING',
    journal_time: '2019-05-11 12:00',
    begin_tme: '2019-05-11 13:00',
    end_time: '2019-05-12 14:00'
  }).then(function (rowsupdated) {
    console.log("update: ", rowsupdated);
    res.json(rowsupdated);
  })
});

app.listen(PORT, function () {
  console.log("Hello World!");
  console.log("PORT: ", PORT);
});
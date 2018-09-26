var axios = require("axios");
var cheerio = require("cheerio");
module.exports = function(app, db) {
  app.get("/", function(req, res) {
    db.Articles.find({}).sort("-published").then(function(data) {
      res.render("index", {
        data: data
      });
    }).catch(function(err) {
      res.json(err);
    });
  });

  app.get("/scrape", function(req, res) {
    axios.get("https://techcrunch.com/startups/").then(function(response) {
      console.log(response);
      var $ = cheerio.load(response.data);

      var result = {};

      $(".post-block").each(function(i, element) {
        result.title = $(this).find(".post-block__title__link").text().replace(/\n|\t/g, "");
        result.link = $(this).find(".post-block__title__link").attr("href");
        result.summary = $(this).find(".post-block__content", "p").text().replace(/\n|\t/g, "");
        result.image = $(this).find("img").attr("src");
        result.published = $(this).find("time").attr("datetime");

        db.Articles.create(result).then(function(dbArticles) {
          console.log(dbArticles);
        }).catch(function(err) {
          console.log(err);
        });
      });
      return res.send("Scrape complete");
    });
  });

  app.get("/note/:id", function(req, res) {
    db.Articles.findOne({
      _id: req.params.id
    }).populate("note").then(function(articlesDB) {
      res.json(articlesDB);
    }).catch(function(err) {
      console.log(err);
    });
  });

  app.post("/save/:id", function(req, res) {
    db.Notes.create(req.body).then(function(notesDB) {
      console.log(notesDB);
      db.Articles.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: notesDB._id
      }, {
        new: true
      }).then(function(articlesDB) {
        res.json(articlesDB);
      }).catch(function(err) {
        console.log(err);
      });
    });
  });
};
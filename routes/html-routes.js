var axios = require("axios");
var cheerio = require("cheerio");
module.exports = function(app, db) {
    //get all articles
    app.get("/", function(req, res) {
        db.Articles.find({})
            .sort("-published")
            .then(function(data) {
                res.render("index", {
                    data: data
                });
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    //scrape for new articles
    app.get("/scrape", function(req, res) {
        //get crunchbase page
        axios.get("https://techcrunch.com/startups/").then(function(response) {
            var $ = cheerio.load(response.data);

            var result = {};

            //get elements from page with cheerio and put them in the restults obj
            $(".post-block").each(function(i, element) {
                result.title = $(this)
                    .find(".post-block__title__link")
                    .text()
                    .replace(/\n|\t/g, "");
                result.link = $(this)
                    .find(".post-block__title__link")
                    .attr("href");
                result.summary = $(this)
                    .find(".post-block__content", "p")
                    .text()
                    .replace(/\n|\t/g, "");
                result.image = $(this)
                    .find("img")
                    .attr("src");
                result.published = $(this)
                    .find("time")
                    .attr("datetime");

                //insert result obj into mongo
                db.Articles.create(result)
                    .then(function(dbArticles) {
                        console.log(dbArticles);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
            return res.send("Scrape complete");
        });
    });

    //retrieve note when note button is clicked
    app.get("/note/:userID/:articleID", function(req, res) {
        db.Notes.findOne({
            userID: req.params.userID,
            articleID: req.params.articleID
        })
            .then(function(notesDB) {
                console.log(notesDB);
                res.json(notesDB);
            })
            .catch(function(err) {
                console.log(err);
            });
    });

    //save note when save button in clicked
    app.post("/save/:userID/:articleID", function(req, res) {
        console.log(req);
        //determine if a note already exists
        db.Notes.findOne({
            userID: req.params.userID,
            articleID: req.params.articleID
        }).then(function(resCheck) {
            //if note exists update it
            if (resCheck) {
                db.Notes.findOneAndUpdate(
                    {
                        _id: resCheck._id
                    },
                    {
                        body: req.body.body
                    },
                    {
                        new: true
                    }
                )
                    .then(function(notesDB) {
                        res.json(notesDB);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            } else {
                //if note does not exist create one
                db.Notes.create(req.body)
                    .then(function(notesDB) {
                        res.json(notesDB);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        });
    });
};

module.exports = function(app, db){
  app.get("/scrape", function(req, res){
    axios.get("https://techcrunch.com/startups/").then(function(response){
      console.log(response);
      var $ = cheerio.load(response.data);

      var result = {};

      $(".post-block").each(function(i, element){
        result.title = $(this).find(".post-block__title__link").text().replace(/\n|\t/g, "");
        result.link = $(this).find(".post-block__title__link").attr("href");
        result.summary = $(this).find(".post-block__content", "p").text().replace(/\n|\t/g, "");
        result.image = $(this).find("img").attr("src");

        db.Articles.create(result).then(function(dbArticles){
          console.log(dbArticles);
        }).catch(function(err){
          console.log(err);
        });
      });
      res.send("Scrape complete");
    });
  });

  app.get("/", function(req, res){
    console.log("/");
    db.Articles.find().then(function(data){
      console.log(data);
      res.render("index", {data: data});
    }).catch(function(err){
      res.json(err);
    });
  });
};

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 8080;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });

var exhbs = require("express-handlebars");
app.engine("handlebars", exhbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

require("./routes/html-routes.js")(app, db);





app.listen(PORT, function(){
  console.log("Listening on port " + PORT);
});

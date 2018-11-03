var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    published: {
        type: Date,
        required: true
    }
});

var Articles = mongoose.model("Articles", ArticleSchema);

module.exports = Articles;

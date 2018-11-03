var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
    body: {
        type: String
    },
    userID: {
        type: String
    },
    articleID: {
        type: String
    }
});

var Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;

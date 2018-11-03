//helper function to display note form after click
function displayForm(thisBtn, articleId, body) {
    var form = $("<form>");
    var bodyLabel = $("<label>").text("Note");
    var body = $("<textarea>")
        .attr("name", "body")
        .addClass("inputBody")
        .val(body);
    var button = $("<button>")
        .addClass("saveBtn button button-outline")
        .attr("data-articleId", articleId)
        .text("Save");

    form.append(bodyLabel, body, button);
    thisBtn.next(".formContainer").html(form);
}

//retrieve and display note / toggle note form
$(document).on("click", ".noteBtn", function() {
    //check if form exists in form container and remove it if it does
    if (
        $(this)
            .next(".formContainer")
            .children().length > 0
    ) {
        $(this)
            .next(".formContainer")
            .html("");
    } else {
        //add form if it does not exist
        var articleId = $(this).attr("data-articleId");
        var userID = localStorage.getItem("userID");
        var thisBtn = $(this);
        var url = "/note/" + userID + "/" + articleId;
        axios.get(url).then(function(res) {
            //if note does not exist continue with empty string otherwise load the note
            if (res.data === null) {
                var body = "";
            } else {
                var body = res.data.body;
            }

            displayForm(thisBtn, articleId, body);
        });
    }
});

//save note to mongo
$(document).on("click", ".saveBtn", function(event) {
    event.preventDefault();

    var thisBtn = $(this);
    var userID = localStorage.getItem("userID");
    var articleId = $(this).attr("data-articleId");

    var url = "/save/" + userID + "/" + articleId;

    axios
        .post(url, {
            body: $(this)
                .parent()
                .children(".inputBody")
                .val(),
            userID: userID,
            articleID: articleId
        })
        .then(function(res) {
            thisBtn.parent().remove();
        });
});

//run scrape on click
$(document).on("click", "#getLatest", function(event) {
    event.preventDefault();
    axios.get("/scrape").then(function(res) {
        window.location.reload();
    });
});

$(document).ready(function() {
    //generate random user id
    function makeid(cb) {
        var id = "";
        var possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 24; i++)
            id += possible.charAt(Math.floor(Math.random() * possible.length));

        cb(id);
    }

    //set new user id to localstorage
    function setid(newid) {
        localStorage.setItem("userID", newid);
    }

    //if user id does not exists in localstorage create one
    if (!localStorage.getItem("userID")) {
        makeid(setid);
    }
});

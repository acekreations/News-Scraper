function displayForm(thisBtn, articleId, extTitle, extBody) {
  var form = $("<form>");
  var titleLabel = $("<label>").text("Note Title");
  var title = $("<input>").attr("type", "input").attr("name", "title").addClass("inputTitle").val(extTitle);
  var bodyLabel = $("<label>").text("Note Body");
  var body = $("<textarea>").attr("name", "body").addClass("inputBody").val(extBody);
  var button = $("<button>").addClass("saveBtn button button-outline").attr("data-articleId", articleId).text("Save");

  form.append(titleLabel, title, bodyLabel, body, button);
  thisBtn.next(".formContainer").html(form);
}

$(document).on("click", ".noteBtn", function() {
  var articleId = $(this).attr("data-articleId");
  var thisBtn = $(this);
  var url = "/note/" + articleId;
  axios.get(url).then(function(res) {
    var extTitle = "";
    var extBody = "";

    if ("note" in res.data) {
      extTitle = res.data.note.title;
      extBody = res.data.note.body;
    }

    displayForm(thisBtn, articleId, extTitle, extBody);
  });
});

$(document).on("click", ".saveBtn", function(event) {
  event.preventDefault();

  var thisBtn = $(this);

  var url = "/save/" + $(this).attr("data-articleId");

  axios.post(url, {
    title: $(this).parent().children(".inputTitle").val(),
    body: $(this).parent().children(".inputBody").val()
  }).then(function(res) {
    thisBtn.parent().remove();
  });
});

$(document).on("click", "#getLatest", function(event) {
  event.preventDefault();
  axios.get("/scrape").then(function(res) {
    window.location.reload();
  });
});
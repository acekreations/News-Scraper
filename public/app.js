function loadArticles() {
  axios.get("http://localhost:8080/articles").then(function(res){
    displayArticles(res.data);
  }).catch(function(err){
    console.log(err);
  });
}

function displayArticles(data) {
  data.forEach(function(val){
    var hr = $("<hr>");

    var row = $("<div>").addClass("row");
    var leftCol = $("<div>").addClass("column column-80");
    var rightCol = $("<div>").addClass("column column-20");

    var link = $("<a>").attr("href", val.link).attr("target", "_blank").text(val.title);
    var title = $("<h4>").html(link);

    var summary = $("<p>").text(val.summary);

    var image = $("<img>").attr("src", val.image);

    var note = $("<button>").addClass("button button-outline").text("Note");

    leftCol.append(title, summary, note);
    rightCol.append(image);
    row.append(leftCol, rightCol);

    $("#articles").append(row, hr);
  });
}

window.onload = function(){
  //loadArticles();
};

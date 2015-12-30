var express = require("express");
var app = express();

app.set("view engine", "hbs");

app.get("/", function(req, res){
  res.render("index");
});

app.listen(4000, function(){
  console.log("app listening on port 4000");
});

var express = require("express");
var app = express();

require('dotenv').load();

app.set("view engine", "hbs");

app.get("/", function(req, res){
  res.render("index");
});

console.log(process.env.apiKey)

app.listen(4000, function(){
  console.log("Listening on port 4000. CTRL + C to stop");
});

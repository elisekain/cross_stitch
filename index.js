var express = require("express");
var request = require('request');
var app = express();
require('dotenv').load();

var path = require("path");
app.use(express.static(path.join(__dirname, "/public")));

app.set("view engine", "hbs");

app.get("/", function(req, res){
  request("https://openapi.etsy.com/v2/shops/5287176/listings/active?method=GET&api_key=" + process.env.apiKey + "&fields=title,url&limit=100&includes=MainImage", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var etsyData = JSON.parse(body);
      res.render("index", {etsyData: etsyData});
    } else {
      console.log(error);
    }
  })
});

app.listen(process.env.PORT || 4000, function(){
  console.log("Listening on port 4000. CTRL + C to stop");
});

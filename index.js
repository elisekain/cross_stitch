var express = require("express");
var https = require('https');
var request = require('request');
var app = express();

require('dotenv').load();

app.set("view engine", "hbs");

app.get("/", function(req, res){
  request("https://openapi.etsy.com/v2/shops/5287176/listings/active.js?method=GET&api_key=" + process.env.apiKey + "&fields=title,url&limit=100&includes=MainImage", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var etsyData = body;
      // Manipulate JSONP string into JSON compatible string.
      etsyData = etsyData.substr(5, (etsyData.length-7));
      // Parse string into object
      etsyData = JSON.parse(etsyData);
      res.render("index", {etsyData: etsyData});
    } else {
      console.log(error);
    }
  })
});

app.listen(4000, function(){
  console.log("Listening on port 4000. CTRL + C to stop");
});

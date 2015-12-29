# Cross Stitch
## Create an Express app

## Express Application Setup

In the terminal:
```
$ mkdir cross_stitch
$ cd cross_stitch
$ npm init
```
You can fill out the information prompted by npm init...or hit enter until it asks you "Is this okay?". Then, respond with "yes".

## Install and save dependencies with npm

```
$ npm install --save express
$ npm install --save nodemon
```
The `--save` flag modifies the package.json file to include dependencies for our app.

## Get the app running

```
$ touch index.js
```

Let's make sure our application is running. We need to
- Require Express
- Create an instance of Express
- Create a home route and basic response
- Tell the app to listen on port 4000

In index.js, include the following:
```
var express = require("express");
var app = express();

app.get("/", function(req, res){
  res.send("Cross Stitch");
});

app.listen(4000, function(){
  console.log("app listening on port 4000");
});
```
Then, in your terminal:
```
$ nodemon
```

Now, visit http://localhost:4000 in a browser. You should see the text "Cross Stitch".

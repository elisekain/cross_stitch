# Cross Stitch
## Create an Express app

## Express Application Setup

In the terminal:
```bash
$ mkdir cross_stitch
$ cd cross_stitch
$ npm init
```
You can fill out the information prompted by npm init...or hit enter until it asks you "Is this okay?". Then, respond with "yes".

## Install and save dependencies with npm
```bash
$ npm install --save express
$ npm install --save nodemon
$ npm install --save hbs
```
We need to install Express, Nodemon and Handlebars (hbs) for this application. The `--save` flag modifies the package.json file to include dependencies for our app.

## Get the app running

```bash
$ touch index.js
$ mkdir views
$ touch views/layout.hbs
$ touch views/index.hbs
```

Let's make sure our application is running. We need to
- Require Express
- Create an instance of Express
- Set the view engine to use handlebars (hbs)
- Create a home route and index template
- Tell the app to listen on port 4000

In index.js, include the following:
```javascript
var express = require("express");
var app = express();

app.set("view engine", "hbs");

app.get("/", function(req, res){
  res.render("index");
});

app.listen(4000, function(){
  console.log("Listening on port 4000. CTRL + C to stop");
});
```
Our layout.hbs file should look like this:
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="/css/styles.css">
  </head>
  <body>
   {{{body}}}
  </body>
</html>
```

And our index.hbs should include the following:
```html
<h1>Cross Stitch</h1>
<h2>Newest Patterns</h2>
<div id="patterns"></div>
```

Then, in your terminal, start the server using nodemon:
```bash
$ nodemon
```

Now, visit http://localhost:4000 in a browser. You should see the index page.

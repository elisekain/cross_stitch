# Cross Stitch
## Create an Express app

## Express application setup
Anything in this tutorial that begins with `$` should be entered into your terminal. Let's start by:

- Making a directory for our project
- Going into the directory
- Generating a package.json file using `npm init`.

```bash
$ mkdir cross_stitch
$ cd cross_stitch
$ npm init
```
You can fill out the information prompted by npm init (this information will be added to the package.json file)...or simply hit enter until it asks "Is this okay?". Then, respond with "yes".

## Install and save dependencies with npm
We need to install [Express](http://expressjs.com/), [Nodemon](http://nodemon.io/) and [Handlebars (hbs)](http://handlebarsjs.com/) for this application. The `--save` flag modifies the package.json file to include dependencies for our app.

```bash
$ npm install --save express
$ npm install --save nodemon
$ npm install --save hbs
```

## Get the app running
Let's start by creating a main `index.js` file and a views folder with layout and index (homepage) views. This will be just enough for us to make sure we can create an Express app and get information showing on our page. In the root of your project folder:

```bash
$ touch index.js
$ mkdir views
$ touch views/layout.hbs
$ touch views/index.hbs
```

Let's get application running. We need to:
- Require Express.
- Create an instance of Express and save it to a variable.
- Set the view engine to use handlebars (hbs).
- Create a home route and index template.
- Tell the app to listen on port 4000.

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
Our layout.hbs file will contain the basic structure for our HTML page. We're also going to add [Normalize.css](https://necolas.github.io/normalize.css/) as well.

`{{{body}}}` is Handlebar's way of allowing other views to render within this layout page.

Your file should look like this:
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css">
    <script  src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  </head>
  <body>
   {{{body}}}
  </body>
</html>
```

We want to include some basic header text and an empty div for our cross-stitch patterns. Let's add the following to index.hbs:
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

## Give app access to environment variables
We need to install another dependency ([dotenv](https://www.npmjs.com/package/dotenv)) to access environment variables in our development environment. Create a .env file in the root of your directory. This is where we will store our API Key for the 3rd party API. We will also create a .gitignore file to make sure the environment variables are not committed to git.

```bash
$ npm install --save dotenv
$ touch .env
$ touch .gitignore
```

The .gitignore file can include the following:
```
node_modules
.env
```

Add this line after `var app = express();` in index.js:
```javascript
require('dotenv').load();
```

## Register for an Etsy API key
So, now we have an empty div just waiting for some information. Let's utilize the Etsy API to get the latest items from [andwabisabi's](https://www.etsy.com/shop/andwabisabi) Etsy store.

Etsy will let us make requests to their API if we register our app with them. Follow these steps to get your API key:

- [Create an account or log in](https://www.etsy.com/) to your personal Etsy account.
- [Register your app](https://www.etsy.com/developers/documentation/getting_started/register) with Etsy.
- After the registration process is completed, Etsy will provide you with a keystring. This is your API key. You can also access it in the future by clicking on "Apps You've Made" and then "See API Key Details".

## Make an AJAX request


Important information to note from the url variable:
- `5287176` is andwabisabi's Etsy store id number. If you want to get listings from another store, change this number to whichever store you choose.
- We are looking for the "active" listings only
- We are limiting our search results to 100 (limit=100)
- We are making sure our results include an image (includes=MainImage)

Additionally, we have to manipulate the response from JSONP to JSON compatible and then parse it into an object. Then, we pass in the `etsyData` object to our render function so that it is available to use in our index.hbs template.
```javascript
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
```

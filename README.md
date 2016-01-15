# Cross Stitch
We're going to create an Express app that makes a call to the Etsy API and uses Handlebars to craft templates using our new data from the Etsy API. This tutorial is good practice for anyone looking to:
- Learn how to setup and start an Express app.
- Practice making a call to a 3rd party API.
- See how Handlebars can be used as a templating engine for Express.

View a deployed version of this app: https://cross-stitch-tutorial.herokuapp.com/

## Express application setup
Anything in this tutorial that begins with `$` should be entered into your terminal. Let's start by doing just that:

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
We need to install [Express](http://expressjs.com/), [Nodemon](http://nodemon.io/) and [Handlebars (hbs)](http://handlebarsjs.com/) for this application. The `--save` flag modifies the package.json file to include dependencies for our app. The`--global` flag installs nodemon on our entire system.

```bash
$ npm install --save express
$ npm install --save --global nodemon
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

Let's get the application running. We need to:
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

Your layout.hbs file should look like this:
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css">
    <script  src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  </head>
  <body>
    <h1>Cross Stitch</h1>
   {{{body}}}
  </body>
</html>
```

We want to include some basic header text and an empty div for our cross-stitch patterns. Let's add the following to index.hbs:
```html
<h2>Newest Patterns from <em>andwabisabi</em></h2>
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

## Prepare to make a request to 3rd Party API
We need to save the new API key in our .env file. Copy your keystring and save it to a variable called apiKey. You do not need quotes around the keystring. Here's an example of what your .env file should look like:
```
apiKey=<your_api_key_here>
```

And, to simplify making the request on our backend, we are going to install a dependency called "request". In the terminal:
```bash
$ npm install --save request
```

And, in index.js we need to require the new dependency. Somewhere in the top section of index.js (but before the app.get):
```javascript
var request = require('request');
```

## Make a request to 3rd Party API
Okay! Now we're finally ready to talk to the Etsy API. The Etsy API will provide us with a JSON string that we can use in our application.

Important information to note from the url that we will use to make the request:
- `5287176` is andwabisabi's Etsy store id number. If you want to get listings from another store, change this number to whichever store you choose.
- We are looking for the "active" listings only
- We access the apiKey we just saved to .env with `process.env.apiKey`
- We are limiting our search results to 100 (limit=100)
- We are making sure our results include an image (includes=MainImage)

After we receive a response, we save the data as an object to a variable called etsyData. Then, we pass in the `etsyData` object to our render function so that it is available to use in our index.hbs template.

Edit your `app.get("/", function(req, res){});` route in index.js to the following:
```javascript
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
```

## Use data in a template
So, our data is now accessible in our index.hbs template. We've passed it in as "etsyData", so we can access the data using that term. `etsyData.results` provides an array of items that we can iterate through.

In handlebars, we can use `{{#each etsyData.results}}` and `{{/each}}` to process a block of html for each result item. We're going to include the items's title, an image and link to the item on Etsy. Within the "#each" block, we can reference the current item as `this`.

The following html/handlebars code should go within the `<div id="patterns"></div>` in index.hbs:
```html
<!-- Generate Pattern Divs from Results -->
{{#each etsyData.results}}
<div class="pattern">
  <p>{{this.title}}
    <a href="{{this.url}}" target="_blank">
    <button>Stitch It!</button>
    </a>
  </p>
  <img src={{this.MainImage.url_170x135}} alt={{this.title}}>      
</div>
{{/each}}
```
## Get ready to add CSS
We've successfully made a call to a 3rd Party API and displayed the information in our template. If we want to add CSS to this project, we should create a public folder and include our stylesheets. To set this up in Express, let's do the following:
```bash
$ mkdir public
$ mkdir public/stylesheets
$ touch public/stylesheets/style.css
```

Then, we need to tell Express where to look for public assets. We need to add the following lines to our index.js file:
```javascript
var path = require("path");
app.use(express.static(path.join(__dirname, "/public")));
```

And, to connect our style.css to our layout, we need to include this link after Normalize.css in the layout.hbs file:
```html
<link rel="stylesheet" href="/stylesheets/style.css">
```

## Add CSS
There are lots of different ways to manipulate our page with CSS. Feel free to customize this application as you'd like.

If you want something to start with, you can check out [my CSS styles](https://github.com/elisekain/cross_stitch/blob/master/public/stylesheets/style.css) for the app.

I also added several "X" SVG icons below the "Cross Stitch" header in layout.hbs, so you'll see references to those in my version of the app.

## Further Steps
This is just a starting point. Dig deeper into the Etsy API to see what other functionality you might want to add. See what else you can do using Handlebars templates. Or, certainly check out a few of the cross stitch patterns and get inspired to craft some of your own!

const express = require('express');
const app = express();
const bodyParser = require('body-parser');


formidable = require('formidable');

var path    = require("path");
const https = require("https");
//var mustache = require('mustache');
var fs = require('fs'); 


const util = require('util');
const readFile = util.promisify(fs.readFile);


function serve() {
  
app.listen('8080', function() {
    console.log(`listening on-> http://localhost:8080`);
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

setupRoutes(app);

module.exports = {
  serve: serve
}

}



/** Set up routes based on IMAGES and STEG for all URLs to be handled
 *  by this server with all necessary middleware and handlers.
 */
function setupRoutes(app) {


app.set('view engine','html');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());



  app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/mainPage.html'));
});


}



























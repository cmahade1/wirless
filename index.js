#!/usr/bin/env nodejs

'use strict';

const assert = require('assert');
//const path = require('path');
const process = require('process');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var formidable = require('formidable');
var path    = require("path");
const https = require("https");
var fs = require('fs'); 
const util = require('util');
const readFile = util.promisify(fs.readFile);
var dialog = require('dialog');
var mustache = require('mustache');



app.listen('8080', function() {
    console.log(`listening on-> http://localhost:8080`);
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

setupRoutes(app);


function setupRoutes(app) {


app.set('view engine','html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



  app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/mainPage.html'));
});

  app.get('/home', function(req, res){
  res.sendFile(path.join(__dirname+'/uploader.html'));
});
  app.post('/', function(req, res){
  let received = {};
  let form = new formidable.IncomingForm(); 
   startMainPage();
   async function startMainPage() {
  await form.parse(req, function(err, fields, files) {
  received = fields; 
  }); 
    res.sendFile(path.join(__dirname+'/uploader.html'));
}
});

  app.post('/uploader', function(req, res){
  let received = {};
  var old_path = '';
  let form = new formidable.IncomingForm(); 

 form.parse(req, function(err, fields, files) {
  received = fields;
   old_path = files.file.path;

   fs.readFile(old_path, function (err, data) {
  if (err) throw err;
  //console.log(data);

   fs.writeFile('0uploads_'+received.filename, data.toString('ascii'), function (err, data) {

  res.sendFile(path.join(__dirname+'/uploaderSuccess.html'));
});
});
    }); 
});



app.get('/dashboard', function(req, res){
let mess = [];
    function render(write) {
  return function (err, buf) {
    var template = buf.toString('utf8')
    var html = mustache.to_html(template, {messages: mess})
    write(html)
  }
}

  function respond(html) {
    res.write(html);
    res.end();
  }
  
   var files = fs.readdirSync(__dirname);
   
    
   for(let i = 0;i<files.length;i++) {
    if(files[i].substring(0,1) == '0' || files[i].substring(0,1) == '9') {
    mess.push(files[i].substring(9,files[i].length));
    }
   }
  console.log(mess);
  fs.readFile('dashboard.html', render(respond));

});


 app.post('/dashboard', function(req, res){
    let form = new formidable.IncomingForm(); 
 form.parse(req, function(err, fields, files) {
  let filePath = path.join(__dirname+'/0uploads_'+fields.delete);
 
  try {
    fs.unlinkSync(filePath);
    res.redirect('/dashboard');
  }
  catch(e) {
     filePath = path.join(__dirname+'/9uploads_'+fields.delete);
      fs.unlinkSync(filePath);
    res.redirect('/dashboard');
  }
  
 });
 });


app.get('/download', function(req, res){
let mess = [];
console.log('ia m hherewef123445');
   var files = fs.readdirSync(__dirname);
  var file_toDownload;

   for(let i = 0;i<files.length;i++) {
    if(files[i].substring(0,1) == '0') {
   // mess.push(files[i].substring(9,files[i].length));
  
   file_toDownload = files[i];
   break;
    }
   }

  var contents = fs.readFileSync(file_toDownload);
   fs.renameSync(file_toDownload, ('9'+file_toDownload.substring(1, file_toDownload.length)));
 var sendString = contents.toString('ascii');
 console.log(sendString);
 //res.send(sendString);
 res.write(sendString);res.end()
});

  app.get('/bank', function(req, res){
  res.sendFile(path.join(__dirname+'/bank.html'));
});

  app.get('/issue', function(req, res){
  res.sendFile(path.join(__dirname+'/issue.html'));
});

}

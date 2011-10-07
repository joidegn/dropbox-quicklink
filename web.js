
/**
 * Module dependencies.
 */

var express = require('express');
var sys = require('sys');
var fs = require('fs');
var path = require('path');
var app = module.exports = express.createServer();


/**
 * Some Variable Declarations
 */

var basename = path.basename; 

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'Quick Dropbox Upload',
    scripts: ['/javascripts/upload.js'],
    styles: []
  });
});
app.get('/upload', function(req, res) {
  res.render('upload', {
    title: 'Upload Form',
    scripts: [],
    styles: []
    });
});
app.post('/upload', function(req, res){
  upload_file(req, res);
});

app.get('/test', function(req, res) {
    res.writeHead(200, {'content-type': 'text/html'});
      res.end(
            '<form action="/upload" enctype="multipart/form-data" '+
                'method="post">'+
                    '<input type="text" name="title"><br>'+
                        '<input type="file" name="upload" multiple="multiple"><br>'+
                            '<input type="submit" value="Upload">'+
                                '</form>'
                                  );
});


function upload_file(req, res) {
  var fName = req.header('x-file-name');
  var fSize = req.header('x-file-size');
  var fType = req.header('x-file-type');
  var fPath = 'public/images/' 
  console.log('Name:' + fName + ' Size:' + fSize + 'Type:' + fType + 'Path:' + fPath);
  var ws = fs.createWriteStream(__dirname + '/' + fPath + '/' + fName);
  req.on('data', function(data) { 
    ws.write(data); 
  }); 

}


app.listen(process.env.PORT);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

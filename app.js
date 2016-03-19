var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var https= require('https');
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');

var songs = {'bryan':'/Users/Justin/Downloads/ecstasy_chopped.mp3', 'sam':'/Users/Justin/Downloads/freshprince.mp3', 'prakash':'/Users/Justin/Downloads/flightof.mp3'};

var watcher = fs.watch('/Users/Justin/fullstack/tessel-code/person.jpg',{ persistent: true }, function(event){

  var img = base64_encode('/Users/Justin/fullstack/tessel-code/person.jpg');

  var postData =  JSON.stringify({
    "image":img,
    // "subject_id":"prakash",
    "gallery_name":"tessel3"
    // "selector":"SETPOSE",
    // "symmetricFill":"true"
  });

  var options = {
    hostname: 'api.kairos.com',
    port: 443,
    path:'/recognize',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'app_id': '9e98846a',
      'app_key': '9d40835e58592daf949e72542aeedaa6'
    }
  };

  var req = https.request(options, function(res) {

    res.setEncoding('utf8');
    res.on('data', function (chunk) {

      console.log('chunk:', chunk);
      if(chunk.toString().indexOf("bryan")>-1){

        console.log("FOUND BRYAN!!!");
        fs.createReadStream(songs.bryan)
          .pipe(new lame.Decoder())
          .on('format', function(format) {
              console.log("piping: ", 'ParisSecrets.mp3')
              this.pipe(new Speaker(format));
          });

      }
      else if(chunk.toString().indexOf("prakash")>-1){

        console.log("FOUND Prakash!!!");
        fs.createReadStream(songs.prakash)
          .pipe(new lame.Decoder())
          .on('format', function(format) {
              console.log("piping: ", '.mp3')
              this.pipe(new Speaker(format));
          });

      }
        else if(chunk.toString().indexOf("jai")>-1){

        console.log("FOUND Jai!!!");
        fs.createReadStream(songs.sam)
          .pipe(new lame.Decoder())
          .on('format', function(format) {
              console.log("piping: ", 'ParisSecrets.mp3')
              this.pipe(new Speaker(format));
          });

      }

    });
    res.on('end', function(){
      console.log('No more data in response.');
    })
  });

  req.on('error', function(e) {
    console.log("problem with request:" + e.message);
  });


  req.write(postData);
  req.end();


  console.log(event);
});

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
  }


  var app = express();

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/public'));

// app.use('/', routes);

// custom error handling to remove stack trace

app.get('/', function (req, res,next) {
  res.send('Hello World!')
});

app.post('/pics',function(req,res,next){
  console.log(req.body);
  res.send('picture received');
    //send to kairos
  })
app.get('/pics',function(req,res,next){
  console.log(req.body);
  res.send('picture received');
    //send to kairos
  })

app.use(function (err, req, res, next) {
  console.log(chalk.magenta('      ' + err.message));
  res.status(err.status || 500).end();
});


app.listen(1337, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
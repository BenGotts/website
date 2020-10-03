var functions = require('firebase-functions');
var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');

// var gapis = require('https://apis.google.com/js/api.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('../public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.get('/', function(req, res) {
  fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=1&playlistId=UUY4J5vw3Ed8Rc3Njc-2qzfg&key=AIzaSyCRWJ4QJime5LewJ9yvHNgvmSO5dTuHSOw')
  .then(response => response.json())
  .then(data => {
    var context = data;
    var videoID = context['items'][0]['contentDetails']['videoId'];
    var handlebars_file = 'index';
    res.render(handlebars_file, {"videoID": videoID});
  })
  .catch(err => console.error(err));
});

app.get('/comps', function(req, res){
  fetch('https://www.worldcubeassociation.org/api/v0/users/6836?upcoming_competitions=true')
    .then(response => response.json())
    .then(data => {
      var context = data;

      if(context["upcoming_competitions"].length == 0){
        context["competitions"] = false;
      }
      else{
        context["competitions"] = true;
      }
      var handlebars_file = 'compPage';
      res.render(handlebars_file, context);
    })
    .catch(err => console.error(err));
});

app.get('/pblTrainer', function(req, res) {
  context = {"case": ['A-', 'A+', 'adj', 'Ba', 'Bb', 'Ca', 'Cb', 'Da', 'Db', 'E', 'F', 'Ga', 'Gb', 'Gc', 'Gd', 'H', 'Ja', 'Jb', 'Ka', 'Kb', 'M', 'Na', 'Nb', 'O-', 'O+', 'opp', 'Pa', 'Pb', 'pJ', 'pN', 'Q', 'Ra', 'Rb', 'Sa', 'Sb', 'T', 'U-', 'U+', 'V', 'W', 'X', 'Y', 'Z', '-']}
  res.render('pblTrainer', context);
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

exports.index = functions.https.onRequest(app);
exports.comps = functions.https.onRequest(app);
exports.pblTrainer = functions.https.onRequest(app);
exports.about = functions.https.onRequest(app);

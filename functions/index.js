var functions = require('firebase-functions');
var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('../public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.use('/', express.static('../public'));

app.get('/comps', function(req, res){
  fetch('https://www.worldcubeassociation.org/api/v0/users/6836?upcoming_competitions=true')
    .then(response => response.json())
    .then(data => {
      var context = data;

      var handlebars_file = 'compPage';
      res.render(handlebars_file, context);
    })
    .catch(err => console.error(err));
});

app.get('/pblTrainer', function(req, res) {
  res.render('pblTrainer')
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

exports.comps = functions.https.onRequest(app);
exports.pblTrainer = functions.https.onRequest(app);

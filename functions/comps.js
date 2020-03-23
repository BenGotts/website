module.exports = function(){
  var fetch = require('node-fetch');
  var express = require('express');
  var router = express.Router();

  router.get('/', function(req, res){
    fetch('https://www.worldcubeassociation.org/api/v0/users/6836?upcoming_competitions=true')
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        var context = data;
        // console.log(context);

        var handlebars_file = 'compPage';
        res.render(handlebars_file, context);
      })
      .catch(err => console.error(err));
  });
  return router;
}();

var express = require('express'),
    cors = require('cors'),
    port = process.env.PORT || 3000,
    app = express();


var options = {
  origin: true,
  methods: ['POST']
};
app.options('/upload', cors(options));
app.post('/upload', cors(options), function(req, res){
  res.json({
    file: 'success !'
  });
});

if(!module.parent){
  app.listen(port, function(){
    console.log('Express server listening on port ' + port + '.');
  });
}

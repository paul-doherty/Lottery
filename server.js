/**
 * Main application file
 */

var express = require('express');
var morgan = require('morgan');
var app = express();
var config = require('./config');
var bodyParser = require('body-parser')

// use morgan to log request to the console
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var controller = require('./controllers/api'); // API controller
var routes = express.Router();

routes.route('/tickets').get(controller.api.getTickets);
routes.route('/tickets').post(controller.api.postTicket);
routes.route('/tickets/:id').get(controller.api.getTicket);
routes.route('/tickets/:id').patch(controller.api.patchTicket);

/* add your routes here

*/

// initialize routes with the /api prefix
app.use('/api', routes);

// catch 404 status code
app.get('*', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.status(404).send(JSON.stringify({ message: 'Not Found' }, null, 2));
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// start the server
app.listen(config.port, function() {
    console.log('Listening on port ' + config.port);
});

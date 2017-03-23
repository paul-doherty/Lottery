/**
 * Main application file
 * Application has been delinted using ESLint
 */
'use strict';

let express = require('express');
let morgan = require('morgan');
let app = express();
let config = require('./config');
let bodyParser = require('body-parser');

// use morgan to log request to the console
app.use(morgan('dev'));

// add body parsers
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// set routes
let controller = require('./controllers/api'); // API controller
let routes = express.Router(); // eslint-disable-line new-cap
routes.route('/').get(controller.api.getTickets);
routes.route('/').post(controller.api.postTicket);

/**
 * The following routes would be more standard but as viewing
 * a ticket modifies the state I don't believe it should use GET
 * It may leads to issues of tickets being clsed if the API was
 * crawled from an external service
 * routes.route('/:id').get(controller.api.getTicket);
 * routes.route('/:id').patch(controller.api.patchTicket);
 */
routes.route('/:id').patch(controller.api.getTicket);
routes.route('/:id/add').patch(controller.api.patchTicket);

// initialize routes with the /api/tickets prefix
app.use(config.ROUTE_PREFIX, routes);

// catch 404 status code
app.get('*', function(req, res) {
  res.json(404, {mesage: config.NOT_FOUND});
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

// start the server
app.listen(config.port, function() {
    console.log(config.LISTENING + config.port);
});

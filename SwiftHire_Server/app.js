var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/SwiftHire", {native_parser:true});
var index = require('./routes/index');
var usersRouter = require('./routes/users');
var jobRouter = require('./routes/jobs');
var jwt = require('express-jwt');
var cors = require('cors');
var app = express();

var authCheck = jwt({
    secret: new Buffer('gp37zq6_xriFoaLRKryicrHCPkVbzL22Ihr8se14aqevBOF3AhNEYMikVO8-LBwu', 'base64'),
    audience: 'wPOJ2LiGIJgiiuqWnirTs2IIMd2q7Te9',
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
});

// view engine setup
// templating library adapter for Express
app.engine("html", cons.ejs);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.enable('trust proxy');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// // route for JWT token check
// app.use(authCheck, function(req, res, next) {
//     next();
// });

// route for db
app.use(function(req, res, next) {
  req.db = db;
  req.jobs = db.bind('jobs');
  req.users = db.bind('users');
  next();
  req.db.close();
});

app.use('/', index);
app.use('/users', usersRouter);
app.use('/jobs', jobRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(4000);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var async = require('async')
const request = require('request');
const bcrypt = require('bcrypt');
const Rounds = 10;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:"uDPZH0ZRe6"
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
function normalizeport(val){
  var port = parseInt(val, 10);
  if (isNaN(port)){
    return val;
  }
  if(port >= 0){
    return port;
  }
  return false;
}
var port = normalizeport(process.env.PORT || '8080');
app.listen(port,process.env.IP,function () {
  console.log("running express server");
});
console.log("Now listening on port", port);

module.exports = app;

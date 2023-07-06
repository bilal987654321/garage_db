var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var servicesRouter = require('./routes/services');
var temoignageRouter = require('./routes/temoignage');
var formulaireRouter = require('./routes/formulaire');
var adminRouter = require('./routes/admin');

var app = express();
app.use(require('sanitize').middleware);

app.use(cors())

app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bb = require ('express-busboy');
bb.extend(app, {
  upload: true,
  path: '/public/uploads',
  allowedPath: /./
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/uploads')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/services', servicesRouter);
app.use('/temoignage', temoignageRouter);
app.use('/formulaire', formulaireRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
});

module.exports = app;
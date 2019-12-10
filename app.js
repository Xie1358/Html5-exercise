var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveIndex = require('serve-index') // 10/03

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//http://localhost:3000/users
app.use('/users', usersRouter);

//http://localhost:3000/api
app.use('/api', apiRouter)

//http://localhost:3000/
app.use('/',serveIndex(path.join(__dirname, 'public'))) // 10/03 此路徑會顯示public裡的檔案 其他路由較嚴謹所以要放他們下面
// 不然會出現FileReadImage.html:58 POST http://localhost:3000/api/upload 405 (Method Not Allowed)
//app.use('/', indexRouter); // 10/03

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

module.exports = app;

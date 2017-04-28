var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var busboy = require('connect-busboy');
// var expressLayouts = require('express-e6js-layouts');

//var session = require('cookie-session');
var MongoStore = require('connect-mongo')(session);
// var hbs = require('express-handlebars');  //view engine

var index = require('./routes/index');
var settings = require('./setting');
var flash = require('connect-flash');
var multer = require('multer');
var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {
  flags: 'a'
});
var errorLog = fs.createWriteStream('error.log', {
  flags: 'a'
});

var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blog');

var passport = require('passport');
require('./passport')(passport);

// view engine setup
// handlebars
// app.engine('hbs', hbs({
//     extname: 'hbs',
//     defaultLayout: 'main',
//     layoutsDir: __dirname + '/views/layouts/',
//     helpers: {
//         section: function(name, options){
//             if(!this._sections) this._sections = {};
//             this._sections[name] = options.fn(this);
//             return null;
//         }
//     }}));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

//ejs
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');

app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(logger('common', {
  stream: accessLog
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
  var meta = '[' + new Date() + ']' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

app.use(express.static('public'));

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 //30天
  },
  seen: 0,
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port,
    url: 'mongodb://localhost:27017/blog'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.user = req.session.user;
  res.locals.req = req;

  // render the error page
  res.status(err.status || 500);

  if (err.status == 500) {
    res.render('error', {
      title: 'Oops',
      code: err.status,
    });
  } else {
    res.render('error', {
      title: 'Not found',
      code: err.status,
    });
  }
  next();
});

module.exports = app;

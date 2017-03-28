var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var session = require('cookie-session');
var MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var settings = require('./setting');
var flash = require('connect-flash');
var multer = require('multer');
var fs = require('fs');
var accessLog = fs.createWriteStream('access.log',{flags: 'a'});
var errorLog = fs.createWriteStream('error.log',{flags: 'a'});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(logger('common',{stream: accessLog}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next){
	var meta = '[' + new Date() + ']' + req.url +'\n' ;
	errorLog.write(meta + err.stack + '\n');
	next();
});


app.use(session({
	secret : settings.cookieSecret,
	key : settings.db,
	resave: true,
    saveUninitialized: true,
	cookie : {
		maxAge : 1000*60*60*24*30 //30天
	}, 
	store : new MongoStore({
		db : settings.db,
		host : settings.host,
		port : settings.port,
		url : 'mongodb://localhost:27017/blog'
	})
}));

// function authChecker(req, res, next) {
	
//     if (req.session.user || req.path==='/login' || req.path === '/reg') {
//         next();
//     } else {
//     	console.log(req.session);
//     	req.flash('error','尚未登入');
//         res.redirect("/login");
//     }
// }

// app.use(authChecker);

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
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;

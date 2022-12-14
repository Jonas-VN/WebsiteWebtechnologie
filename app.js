var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var cookieSession = require('cookie-session');
var { randomBytes } = require('crypto');
const compression = require("compression");
const helmet = require("helmet");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(compression()); // Compress all routes
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            frameSrc: ["'self'", "*.google.com/", "*.youtube-nocookie.com/", "*.twitter.com/"],
			scriptSrc: ["'self'", "*.google.com/", "*.twitter.com/", "'unsafe-inline'", "*.gstatic.com/", "*.googletagmanager.com/"],
			connectSrc: ["'self'", "*.google-analytics.com/"],
        }
    },
}));

app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "cross-origin")
    next()
})

// Set up mongoose connection
const mongoDB = process.env.MONGODB_URI || "mongodb+srv://ginijo:azerty123%40@testwebsitelokeren.ky1irsu.mongodb.net/website_lokeren?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// set up the cookie for the session
app.use(cookieSession({
	name: 'session',                              // name of the cookie
	secret: randomBytes(100).toString('base64'),  // key to encode session
	maxAge: 24 * 60 * 60 * 1000,                  // cookie's lifespan
	sameSite: 'lax',                              // controls when cookies are sent
	path: '/',                                    // explicitly set this for security purposes
	secure: false,				      			  // cookie only sent on HTTPS
	httpOnly: true                                // cookie is not available to JavaScript (client)
  }));
  
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

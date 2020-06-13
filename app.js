var cookieParser = require('cookie-parser')

var createError = require('http-errors');
var express = require('express');

var path = require('path');
var logger = require('morgan');
var session = require('express-session')
var sqlite3 = require('sqlite3').verbose()

var indexRouter = require('./routes/index');
var todosRouter = require('./routes/todos');


var app = express();
app.use(cookieParser())

// przygotowanie bazy danych
var db = new sqlite3.Database(':memory:')
db.serialize(function() {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username varchar)");
  db.run("INSERT INTO users (username) VALUES ('user_1')");
  db.run("INSERT INTO users (username) VALUES ('user_2')");
  db.run("CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, todo varchar)");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'sAn7baRbhx4'
}));
app.use(function(req, res, next) {
  req.db = db;
  next();
})
app.use('/', indexRouter);
app.use('/todos', todosRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

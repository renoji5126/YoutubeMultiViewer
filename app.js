var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var MongoStore = require('connect-mongo')(express);

var routes = require('./routes/index');
var movie_list = require('./routes/movie_list');
var multi_view = require('./routes/multi_view');
var edit = require('./routes/edit');
var users = require('./routes/users');
var mongoose = require('mongoose');
var url = 'mongodb://localhost/test';
mongoose.connect(url, function(err){
  if (err) throw err;
});
var sampleCollect = new mongoose.Schema({
  moveId: String,
  sectionEndPoints: Array,
  deleteFlg: {type : Boolean, default: false},
},{collection:'sample_coll'});
var sampleModel = mongoose.model('test',sampleCollect);
edit.setModel(sampleModel);
movie_list.setModel(sampleModel);
multi_view.setModel(sampleModel);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
//app.use(logger('dev'));
app.use(function(req, res, next){
  console.log([
    req.headers['x-forwarded-for'] || req.client.remoteAddress,
    new Date().toLocaleString(),
    req.method,
    req.url,
    res.statusCode,
    req.headers.referer || '-'
    ].join('\t')
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/list', movie_list);
app.use('/edit', edit);
app.use('/users', users);
app.use('/view', multi_view);
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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


module.exports = app;

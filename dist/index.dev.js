"use strict";

var path = require("path");

var express = require('express');

var bodyParser = require('body-parser'); //------------------MySQL------------------------------------------------------------//

/*var mysql = require('mysql');

var connection = mysql.createConnection({ host: 'localhost', database: 'todoapp', user: 'root', password: 'tfglcsi2020', });

connection.connect(function(err) {
    if (err) { console.error('Error connecting: ' + err.stack); return; }
    console.log('Connected as id ' + connection.threadId);
});

connection.query('SELECT * FROM alumnos', function(error, results, fields) {
    if (error) throw error;
    results.forEach(result => { console.log(result); });
});

connection.end();*/
//----------------------SERVIDOR-----------------------------------------------------//


var app = express();
var PORT = 3000;
app.listen(PORT, function () {
  return console.log("Express server currently running on port ".concat(PORT));
}); //-------------------------LOGIN-----------------------------------------------------//

var session = require('express-session');

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.post('/auth', function (request, response) {
  var username = request.body.username;
  var password = request.body.password; // ... TO-DO comprobar que coinciden con los de la base de datos!

  if (username && password) {
    request.session.loggedin = true;
    response.sendFile('home.html', {
      root: "".concat(__dirname, "/public")
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});
/*app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile('home.html', { root: `${__dirname}/public` });
    } else {
        response.sendFile('404.html', { root: `${__dirname}/public` });
    }
    response.end();
});*/

app.get("/home", function (request, response) {
  response.sendFile('home.html', {
    root: "".concat(__dirname, "/public")
  });
});
app.get('/logout', function (req, res) {
  alert("Sesión cerrada");
  req.session.destroy();
}); //----------------------ROUTING-----------------------------------------------------//
//Esto estaría mejor con un switch-case

app.use(express["static"](path.join(__dirname, 'public')));
app.get("/", function (request, response) {
  response.sendFile('login.html', {
    root: "".concat(__dirname, "/public")
  });
});
app.get("/grammar", function (request, response) {
  response.sendFile('grammar.html', {
    root: "".concat(__dirname, "/public")
  });
});
app.get("/svgeditor", function (request, response) {
  response.sendFile('svgeditor.html', {
    root: "".concat(__dirname, "/public")
  });
});

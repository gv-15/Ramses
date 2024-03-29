"use strict";



const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql');

const app = express();
const PORT = 3000;
app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'todoapp',
    user: 'root',
    password: 'root',
});

connection.connect(function(err) {
    if (err) { console.error('Error connecting: ' + err.stack); return; }
    console.log('Connected as id ' + connection.threadId);
});

var session = require('express-session');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = require('node-sessionstorage');




app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
   
    storage.setItem('user', username)

    if (username && password) {
        connection.query('SELECT * FROM usuarios WHERE nombre_usuario = ? AND password_usuario = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get(`/home`, (request, response) => {
    response.sendFile('home.html', { root: `${__dirname}/public` });
});
/*
app.get(`/afterbd`, (request, response) => {
   
    var sql = "INSERT INTO maquinas (id_state, id_automata, id_usuario, id_posicion_x, id_posicion_y) VALUES (1,3,4,0.5,1.5)";
    connection.query(sql);
    connection.query(sql,function (err, result){
    if (err) {
        throw err;}
   
        console.log("1 record inserted");
        alert("Recorded!!");
    window.location.reload();
  });
     
  //response.sendFile('home.html', { root: `${__dirname}/public` });
}); */

app.use(express.static(path.join(__dirname, 'public')));

app.get(`/`, (request, response) => {
    response.sendFile('login.html', { root: `${__dirname}/public` });
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    connection.end();
    res.redirect('/');
});

app.get(`/`, (request, response) => {
    response.sendFile('login.html', { root: `${__dirname}/public` });
});

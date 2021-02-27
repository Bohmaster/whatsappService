const express = require('express');
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const fs = require("fs");
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'laravel',
  password : 'laravel',
  database : 'c1990040_Turnos'
});

connection.connect();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
 console.log(1, req.body.type, req.body.payload.payload.text);   
 if (req.body.type === "message" && req.body.payload.payload.text === "1") {
       res.send("1- Carlos Bustamante (Clínico), 2- Martin Rojas (Kiensiólogo)");
    } else {
       res.send("Bienvenido al sistema de turnos. Escriba 1 para ver los médicos");
    }
});

app.listen(3004, ()=> {
    console.log('running')
})
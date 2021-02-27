const express = require('express');
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const fs = require("fs");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let medicos = [];
let especialidades = [];

fs.createReadStream('Especialidad.csv')
    .pipe(csv())
    .on('data', (row) => {
        especialidades.push(row)
    })
    .on('end', () => {
        console.log('CSV file successfully processed');

        fs.createReadStream('Medicos.csv')
            .pipe(csv())
            .on('data', (row2) => {
                medicos.push(row2);

            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
    });

app.post('/webhook', (req, res) => {
    console.log(req.body, req.params, req.data);

    console.log(especialidades[0], medicos[0]);

    res.send("Great")
});

app.listen(3004, ()=> {
    console.log('running')
})
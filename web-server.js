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

const steps = [
    {
        text: "Bienvenido al sistema de turnos",
    },
    {
        text: "Seleccione especialidad",
        sql: "Select * FROM Especialidades",
        options: [],
        setOptions: function(options) {
            this.options = options;
        }
    },
    {
        
        text: "Seleccione medico",
        sql: "SELECT * FROM Medicos",
        options: [],
        setOptions: function(options) {
            this.options = options;
        }
    }
];

const sessions = {
    "5493416123822": {
        sessionTimeoutId: null,
        lastMessage: "",
        step: {
            current: steps[0],
            currentIndex: 0,
            prev: null
        },
        resetSession: function() {
            this.sessionInterval = setTimeout(() => {
                this.step = steps[this.step.currentIndex];
            }, 10000);                    
        },
        clearSession: function() {
            clearTimeout(this.sessionTimeoutId)
        },
        setStep: function(stepIndex) {
            this.step = {
                stepIndex,
                current: steps[stepIndex],
                prev: stepIndex > 0 ? steps[stepIndex - 1] : null
            };
            
            this.clearSession();
            this.resetSession();
        }
    }
};

const createReponse = step => {
    let message = step.text;
    
    if (step.options) {
        step.options.forEach(option => {
            message += " " + option.Descripcion;
        });
    }

    return message;
};

app.post('/webhook', (req, res) => {
 console.log(1, req.body.type, req.body.payload.payload.text);   
 if (req.body.type === "message" && req.body.payload.payload.text === "1") {
        const currentSession = sessions[req.body.payload.source];
        const step = steps[currentSession.step.currentIndex];

        if (step.sql) {
            connection.query(step.sql, function (error, results, fields) {
                if (error) throw error;

                step.setOptions(results);
            });
        }

        res.send(createReponse(step));
    } 
});

app.listen(3004, ()=> {
    console.log('running')
})
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//bring in the pg module

var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/employee_salary'; //the /node-app part is replaced by the name of the DB
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//get everything out of the DB/ get data route
app.get('/emp_info', function(req, res) {

    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM emp_info');

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            client.end();
            console.log(results);
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }

    });
});

app.post('/emp_info', function(req, res) {
    var addPerson = {
        emp_id: req.body.emp_id,
        emp_first_name: req.body.emp_first_name,
        emp_last_name: req.body.emp_last_name,
        emp_job_title: req.body.emp_job_title,
        emp_salary: req.body.emp_salary
    };
    pg.connect(connectionString, function(err, client, done) {
        client.query('INSERT INTO emp_info (emp_id, emp_first_name, emp_last_name, emp_job_title, emp_salary) ' +
            'VALUES ($1, $2, $3, $4, $5) RETURNING emp_id;',
            [addPerson.emp_id, addPerson.emp_first_name, addPerson.emp_last_name, addPerson.emp_job_title, addPerson.emp_salary],
            function(err, result) {
                done(); //this is needed to end the connection so that we can bypass the 10 db connections max default
                if(err) {
                    console.log('Error inserting data: ', err);
                    res.send(false);
                } else {
                    res.send(addPerson);
                }
            });
    });
});

app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});

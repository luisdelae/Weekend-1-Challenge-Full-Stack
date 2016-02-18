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

        //Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        //close connection
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


app.post('/people', function(req, res) {
    var addPerson = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
    pg.connect(connectionString, function(err, client, done) {
        client.query('INSERT INTO emp_info (emp_id, emp_first_name, emp_last_name, emp_job_title, emp_salary) VALUES ($1, $2) RETURNING person_id;',
            [addPerson.first_name, addPerson.last_name],
            function(err, result) {
                done(); //this is needed to end the connection so that we can bypass the 10 db connections max default
                if(err) {
                    console.log('Error inserting data: ', err);
                    res.send(false);
                } else {
                    //console.log(res[0]['person_id']);
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

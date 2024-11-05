/*
    SETUP
*/
//test comment

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT = 23108;
// Popups for client
//var popup = require('popups');                  // now we can use popup.alert to inform client of issues

// Database
var db = require('./database/db-connector');

// // Handlebars
// const { engine } = require('express-handlebars');
// var exphbs = require('express-handlebars');     // Import express-handlebars
// app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
// app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

// index
app.get('/index', function(req, res)
    {
         // SELECT *...
         db.pool.query('SELECT * FROM Shelters;', function(err, results, fields){

            // Send the results to the browser
            let base = "<h1>MySQL Results:</h1>"
            res.send(base + JSON.stringify(results));
        });
    }
);

app.get('/', function(req, res)
    {
         // SELECT *...
         db.pool.query('SELECT * FROM Shelters;', function(err, results, fields){

            // Send the results to the browser
            let base = "<h1>MySQL Results:</h1>"
            res.send(base + JSON.stringify(results));
         });
    }
);

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
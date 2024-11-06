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

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

// index
app.get('/index', function(req, res)
    {
        //get information on a specific pet for main page
        let getPet = `
        SELECT
            Pets.name, Pets.species, Pets.breed, Pets.filename, 
            DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), Pets.birthdate)), '%Y') + 0 AS birth, 
            Pets.size, Pets.description, Shelters.name AS shelter, 
            Shelters.email AS email, Shelters.phone AS phone, 
            Shelters.street_address AS street, Shelters.city AS city, 
            Shelters.postal_code AS postal, Shelters.state AS state
        FROM
            Pets
        LEFT JOIN
            Shelters ON Pets.shelter_id = Shelters.shelter_id
        WHERE
            Pets.pet_id = 1;
        `;

        db.pool.query(getPet, function(error, Pet, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
                return;
            }
            console.log({data:Pet});
            res.render('index', {data: Pet});
        })
    });

// about
app.get('/about', function(req, res)
    {
        console.log('Displaying about page...');
        res.render('about');
    });

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
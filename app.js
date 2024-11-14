/*
    SETUP
*/
//test comment

// Express
const express = require('express');
const app = express();
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

// Image Upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
// Temporary folder for file uploads
const upload = multer({ dest: 'uploads/' });

// Microservice Communication Pipe
const axios = require('axios');                 // Use axious for REST APIs
app.set('views', path.join(__dirname, 'views'));

/*
    ROUTES
*/

// index
app.get('/index', function(req, res)
    {
        //get information on a specific pet for main page
        const petId = req.query.pet_id || 1; // Default to pet_id = 1 if no ID is provided
        let getPet = `
        SELECT
            Pets.pet_id, Pets.name, Pets.species, Pets.breed, Pets.filename, 
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
            Pets.pet_id = ?;
        `;

        db.pool.query(getPet, [petId], function(error, Pet, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
                return;
            }
            res.render('index', { data: Pet, petId: petId }); // Pass petId to the view
        });
    });

// about
app.get('/about', function(req, res)
    {
        console.log('Displaying about page...');
        res.render('about');
    });

// pets
app.get('/pets', function(req, res)
    {
        console.log('Displaying pets page...');
        res.render('pets');
    });

// quizzes
app.get('/quizzes', function(req, res)
    {
        console.log('Displaying quizzes page...');
        res.render('quizzes');
    });

// addPets
app.get('/addPets', function(req, res)
    {
        console.log('Displaying addPets page...');
        res.render('addPets');
    });

// addTypical
app.get('/addTypical', function(req, res)
    {
        console.log('Displaying addTypical page...');
        res.render('addTypical');
    });

const userCriteria = {
    size: 'medium',
    energyLevel: 'high',
    goodWithKids: true,
    coatType: 'short',
    livingSpace: 'apartment',
    experienceWithDogs: 'beginner'
};

// Route to fetch and display the recommended dog breed
app.get('/dog', async (req, res) => {
    try {
        // Send the criteria to the microservice
        const response = await axios.post('http://localhost:23109/dog-breed', userCriteria);
        const recommendedBreed = response.data.breed;
        console.log(recommendedBreed);

        // Render the page with the recommended breed
        res.render('dog', { breed: recommendedBreed });
    } catch (error) {
        console.error('Error fetching recommended breed:', error);
        res.render('dog', { breed: 'Unable to fetch recommendation' });
    }
});

// add_Pet, handle POST for adding a pet
app.post('/add_pet', upload.single('image'), async (req, res) => {
    const { name, species, breed, birthdate, size, description, shelter_id } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
        return res.status(400).send('Image file is required.');
    }

    // Define the destination path for the uploaded image
    const destPath = path.join(__dirname, 'public/img/pets', imageFile.originalname);

    try {
        // Move the uploaded image from the temporary folder to the desired directory
        fs.renameSync(imageFile.path, destPath);


        // Insert the pet data into the Pets table
        const query = `INSERT INTO Pets (name, species, breed, birthdate, size, description, filename, shelter_id) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const queryValues = [name, species, breed, birthdate, size, description, imageFile.originalname, shelter_id];

        db.pool.query(query, queryValues, function(error, rows, fields){

            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log('Error executing query:', error)
                res.sendStatus(400);
            }
    
            // If there was no error, we redirect back to our pets page
            else
            {
                res.redirect('/pets');
            }
        })

    } catch (error) {
        console.error('Error adding pet:', error);

        // Remove the uploaded image from the server if an error occurs
        if (fs.existsSync(destPath)) {
            fs.unlinkSync(destPath);
        }

        res.status(500).send('An error occurred while adding the pet.');
    }
});
    
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
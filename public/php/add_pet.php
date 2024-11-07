<?php
// Database connection
include "dbConfig,php";

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Check if form is submitted and file is uploaded
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['image'])) {
    $name = $_POST['name'];
    $species = $_POST['species'];
    $breed = $_POST['breed'];
    $birthdate = $_POST['birthdate'];
    $size = $_POST['size'];
    $description = $_POST['description'];
    $shelter_id = $_POST['shelter_id'];
    
    // Handle image upload
    $upload_dir = __DIR__ . '/img/pets/';
    $filename = basename($_FILES['image']['name']);
    $target_file = $upload_dir . $filename;

    // Move the file to the server directory
    if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
        // Insert data into Pets table
        $stmt = $pdo->prepare("INSERT INTO Pets (name, species, breed, birthdate, size, description, filename, shelter_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $species, $breed, $birthdate, $size, $description, $filename, $shelter_id]);
        
        echo "Pet added successfully!";
    } else {
        echo "Error uploading image.";
    }
} else {
    echo "Invalid request.";
}
?>

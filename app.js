const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Load MongoDB URL and port from environment variables
const mongoURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/studentdb';
const port = process.env.PORT || 3000; // Default to 3000 if PORT is not set

// Connect to MongoDB
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define Student schema
const studentSchema = new mongoose.Schema({
    studentid: String,
    name: String,
    class: String,
    age: Number
});
const Student = mongoose.model('Student', studentSchema);

// Middleware to parse JSON
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // Set EJS as the view engine


// Render the EJS page and display student data
app.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('index', { students });
    } catch (err) {
        res.status(500).send('Error retrieving students');
    }
});

// Route to add a new student
app.post('/add-student', async (req, res) => {
    const { studentid, name, class: studentClass, age } = req.body;

    try {
        await Student.create({ studentid, name, class: studentClass, age });
        res.status(200).send('Student added successfully');
    } catch (err) {
        res.status(500).send('Error adding student');
    }
});

// Route to get all students in JSON format
app.get('/get-students', async (req, res) => {
    try {
        const students = await Student.find();
        res.setHeader('Content-Type', 'application/json');
        res.json(students); // Send students as JSON
    } catch (err) {
        res.status(500).send('Error retrieving students');
    }
});

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));

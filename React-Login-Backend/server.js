const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user'); // adjust the path to match your file structure
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://malathkarsrivibhav28:Vibhav12@cluster0.lphbtpk.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON bodies
app.use(bodyParser.json());



// POST route to create a new user
app.post('/signup', (req, res) => {
  const { email, password, username, userClass } = req.body;

  console.log('Received data:', req.body); // Log the received data

  // Check if a user with the provided email already exists
  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        // If a user with the provided email already exists, send an error message
        console.error('User with this email already exists');
        res.status(400).send('User with this email already exists');
      } else {
        // If no user with the provided email exists, create a new user
        const user = new User({ email, password, username, userClass });
        user.save()
          .then(user => {
            console.log('User added successfully:', user); // Log the added user
            res.send('User added');
          })
          .catch(err => {
            console.error('Could not add user', err);
            res.status(500).send('Could not add user');
          });
      }
    })
    .catch(err => {
      console.error('Error checking for existing user', err);
      res.status(500).send('Error checking for existing user');
    });
});


// POST route for login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user with requested email and password
  const user = await User.findOne({ username, password });

  if (user) {
    // User exists
    res.send('exist');
  } else {
    // User does not exist
    res.send('notexist');
  }
});

  app.use(cors({ origin: 'http://localhost:3001' }));
// Start the server
app.listen(3000, () => console.log('Server is running on port 3000'));
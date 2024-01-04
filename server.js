const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserModel = require('./server/models/users');
const Counter = require('./server/models/counter');
const emissionsModel = require('./server/models/emissions')
const cors = require('cors');
const axios = require('axios')
require('dotenv').config();

const app = express();


app.use(cors({ origin: 'http://localhost:3000' }));
// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err));

  app.get('/search', async (req, res) => {
    const scannedObject = req.query.q;
    const subreddit = 'environmental';
    const url = `https://www.reddit.com/r/${subreddit}/hot.json`;
  
    try {
      const response = await axios.get(url);
      const posts = response.data.data.children.map((post) => post.data);
  
      let results = posts
        .filter((post) => post.title.toLowerCase().includes(scannedObject.toLowerCase()))
        .map((post) => {
          const { title, url, preview } = post;
          const imageUrl = preview && preview.images && preview.images[0].source.url;
  
          return {
            title,
            url,
            imageUrl,
          };
        });
  
      // If there are no results for the scanned object, search for "recycling" instead
      if (results.length === 0) {
        const recyclingUrl = `https://www.reddit.com/search.json?q=${scannedObject}+recycling`;
        const recyclingResponse = await axios.get(recyclingUrl);
        const recyclingPosts = recyclingResponse.data.data.children.map((post) => post.data);
  
        results = recyclingPosts
          .filter((post) => !results.some(result => result.title === post.title))
          .map((post) => {
            const { title, url, preview } = post;
            const imageUrl = preview && preview.images && preview.images[0].source.url;
  
            return {
              title,
              url,
              imageUrl,
            };
          });
      }
  
      // Remove duplicates from the results
      results = results.filter((post, index) => results.findIndex(p => p.title === post.title) === index);
  
      res.json(results.slice(0, 10));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });

  // Create emissions model
const Emissions = mongoose.model('emissions', emissionsModel);

// Create endpoint for retrieving emissions data
app.post('/emissions', async (req, res) => {
  try {
    const make = req.body.make;
    const model = req.body.model;
    const year = req.body.year;

    // Query the database for matching emissions data
    const emissions = await Emissions.findOne(
      { make: make, model: model, year: year },
      { _id: 0, co2TailpipeGpm: 1, UHighway: 1 }
    );

    // If no matching emissions data was found, return a 404 error
    if (!emissions) {
      res.status(404).send('No results found');
    } else {
      res.status(200).json(emissions);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error querying database');
  }
});










// add scan amount to the server
app.post('/scan', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.scannedAmount = (user.scannedAmount || 0) + 1;
    await user.save();

    res.json({ message: 'Scanned amount updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET request to retrieve number of scans for a user with a specific email
app.get('/scans', async (req, res) => {
  const email = req.query.email;

  try {
    // Find the user with the specified email and retrieve the totalScans property
    const user = await UserModel.findOne({ email });
    const totalScans = user ? user.scannedAmount : 0;

    // Return the total number of scans as a response
    res.status(200).send({ totalScans });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});



  









// Create an empty array to store logged in users
const loggedInUsers = [];

// Login endpoint
// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  UserModel.findOne({ email: email })
    .then(user => {
      // Check if user exists and password is correct
      if (!user || user.password !== password) {
        res.status(401).send('Invalid email or password');
        return;
      }

      // Add user to logged in users array
      loggedInUsers.push(user);

      res.send({
        message: 'Logged in successfully',
        name: user.name,
        email: user.email
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
});

// Signup endpoint
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  Counter.findOneAndUpdate(
    { _id: 'userId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
    .then(counter => {
      const newUser = new UserModel({
        id: counter.seq,
        name,
        email,
        password
      });

      // Save the user to the database
      newUser.save()
        .then(() => res.status(201).json({ message: 'User created successfully.' }))
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port}!`));

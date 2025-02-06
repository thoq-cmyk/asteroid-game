const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submitUsername', async (req, res) => {
  const username = req.body.username;
  // Handle username submission logic here
  res.send('Username submitted');
});

app.post('/submitScore', async (req, res) => {
  const player = req.body.player;
  const score = req.body.score;

  try {
    await client.connect();
    const database = client.db('leaderboardDB');
    const collection = database.collection('scores');
    await collection.insertOne({ player, score });
    res.send('Score submitted');
  } catch (error) {
    res.status(500).send('Error submitting score');
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
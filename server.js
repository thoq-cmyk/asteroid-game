const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017"; // Your MongoDB connection string
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("leaderboardDB");
    const collection = database.collection("scores");

    app.get("/scores", async (req, res) => {
      try {
        const scores = await collection.find({}).toArray();
        res.json(scores);
      } catch (error) {
        console.error("Error fetching scores:", error);
        res.status(500).json({ error: "Failed to fetch scores" });
      }
    });

    app.post("/scores", async (req, res) => {
      const newScore = req.body;

      // Validate incoming data
      if (!newScore.player || typeof newScore.score !== "number") {
        return res.status(400).json({ error: "Invalid score data" });
      }

      try {
        const result = await collection.insertOne(newScore);
        res.status(201).json(result);
      } catch (error) {
        console.error("Error adding score:", error);
        res.status(500).json({ error: "Failed to add score" });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

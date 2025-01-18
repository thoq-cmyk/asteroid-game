const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

const uri = "mongodb://localhost:27017"; // Your MongoDB connection string
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("leaderboardDB");
    const collection = database.collection("scores");

    // Insert test scores if the collection is empty
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany([
        { player: "Alice", score: 150 },
        { player: "Bob", score: 100 },
        { player: "Charlie", score: 50 },
      ]);
    }

    app.get("/scores", async (req, res) => {
      try {
        const scores = await collection.find({}).sort({ score: -1 }).toArray(); // Sort scores in descending order
        console.log("Fetched scores:", scores); // Log the fetched scores
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

    app.delete("/scores/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await collection.deleteOne({
          _id: new MongoClient.ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Score not found" });
        }
        res.status(200).json({ message: "Score deleted successfully" });
      } catch (error) {
        console.error("Error deleting score:", error);
        res.status(500).json({ error: "Failed to delete score" });
      }
    });

    app.post("/scores/reset", async (req, res) => {
      try {
        await collection.deleteMany({}); // Remove all scores
        res.status(200).json({ message: "Leaderboard reset successfully" });
      } catch (error) {
        console.error("Error resetting leaderboard:", error);
        res.status(500).json({ error: "Failed to reset leaderboard" });
      }
    });

    app.post("/updatePlayer", async (req, res) => {
      const { oldName, newName } = req.body;
      try {
        await collection.updateMany(
          { player: oldName },
          { $set: { player: newName } }
        );
        res.status(200).send("Player name updated successfully");
      } catch (error) {
        console.error("Error updating player name:", error);
        res.status(500).send("Error updating player name");
      }
    });

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

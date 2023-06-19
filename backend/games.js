const router = require("express").Router();
const Game = require("./gameSchema");

router.post("/create", async (req, res) => {
  try {
    const { username, startTime, endTime, location, userScores, parData, id } = req.body;
    
    // Create a new game document based on the provided data
    const newGame = new Game({
      username,
      startTime,
      endTime,
      location,
      userScores,
      parData,
      id,
    });
    
    // Save the game document to the database
    await newGame.save();
    
    res.status(200).json({ message: "Game saved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

router.get("/:username", async (req, res) => {
    try {
      const username = req.params.username;
  
      // Find all games that belong to the specified username
      const games = await Game.find({ username });
  
      res.status(200).json(games);
    } catch (err) {
      console.log(err);
      res.status(500).json("Internal server error");
    }
  });

module.exports = router;

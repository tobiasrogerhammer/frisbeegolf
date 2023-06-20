const router = require("express").Router();
const Game = require("./gameSchema");

router.post("/create", async (req, res) => {
  try {
    const { username, startTime, endTime, location, userScores, parData } =
      req.body;

    const locationGames = await Game.find({ username, location }); // Retrieve games for the specific username and location
    const gameCount = locationGames.length + 1; // Increment the game count for the specific location

    const newGame = new Game({
      username,
      startTime,
      endTime,
      location,
      userScores,
      parData,
      id: gameCount, // Set the id based on the incremented game count for the location
    });

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
    const games = await Game.find({ username }).sort({ location: 1, id: -1 });

    res.status(200).json(games);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;

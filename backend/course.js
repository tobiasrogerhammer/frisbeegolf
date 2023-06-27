const router = require("express").Router();
const Course = require("./courseSchema");

router.post("/create", async (req, res) => {
  try {
    const {
      courseName,
      description,
      warnings,
      address,
      postKode,
      postSted,
      contact,
      website,
      holes,
      parData,
      holeLengths,
    } = req.body;

    const newCourse = new Course({
      courseName,
      description,
      warnings,
      address,
      postKode,
      postSted,
      contact,
      website,
      holes,
      parData,
      holeLengths,
      id,
    });

    await newCourse.save();

    res.status(200).json({ message: "Course saved successfully" });
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

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
      id,
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

router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;

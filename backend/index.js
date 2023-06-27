const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./users");
const games = require("./games");
const courses = require("./course");
const env = require("dotenv").config();

const app = express();
const db =
  "mongodb+srv://tobias:jippijippi@cluster0.6dqxuvj.mongodb.net/?retryWrites=true&w=majority";
const port = env.PORT || 5000;

mongoose.set("strictQuery", false);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "frisbee-db",
  })

  .then(console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use(
  cors({
    origin: "https://myfreesbee.onrender.com",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/user", users);
app.use("/game", games);
app.use("/courses", courses);

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});

const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./users");

const app = express();
const db =
  "mongodb+srv://tobias:<password>@cluster0.6dqxuvj.mongodb.net/?retryWrites=true&w=majority";
const port = 5000;

mongoose.set("strictQuery", false);
mongoose.connect(db, {});
mongoose
  .connect(
    "mongodb+srv://tobias:<password>@cluster0.6dqxuvj.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "frisbee-db",
    }
  )
  .then(console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/user", users);

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});

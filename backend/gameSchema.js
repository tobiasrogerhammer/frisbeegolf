const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  userScores: {
    type: [Number],
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Game", gameSchema);

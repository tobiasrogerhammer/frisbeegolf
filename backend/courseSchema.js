const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  warnings: {
    type: [String],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  postKode: {
    type: Number,
    required: true,
  },
  postSted: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  holes: {
    type: Number,
    required: true,
  },
  parData: {
    type: [Number],
    required: true,
  },
  holeLengths: {
    type: [Number],
    required: true,
  },
});

module.exports = mongoose.model("Course", courtSchema);

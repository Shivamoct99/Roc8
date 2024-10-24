const mongoose = require("mongoose");
const { Schema } = mongoose;

let dataSchema = new Schema(
  {
    Day: Number,
    Age: String,
    Gender: String,
    A: Number,
    B: Number,
    C: Number,
    D: Number,
    E: Number,
    F: Number,
  },
  { timestamps: true }
);
let Data = mongoose.model("Data", dataSchema);

module.exports = Data;

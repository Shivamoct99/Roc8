const mongoose = require("mongoose");
let url =
  "mongodb+srv://shivamsharma11111111:books123@books.8lf4w.mongodb.net/?retryWrites=true&w=majority&appName=Books";

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("not connected to database" + err);
  });

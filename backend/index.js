var express = require("express");
const xlsx = require("xlsx");
const data = require("./modules/data");
const DataUsers = require("./modules/User");
var cors = require("cors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

port = process.env.PORT || 3040;

// connect to moongodb
require("./mongodb");

const app = express();
// Function to convert Excel to JSON
function excelToJson(filePath) {
  const workbook = xlsx.readFile(filePath); // Read the Excel file
  const sheetName = workbook.SheetNames[0]; // Get the first sheet
  const worksheet = workbook.Sheets[sheetName]; // Get the worksheet data
  const jsonData = xlsx.utils.sheet_to_json(worksheet); // Convert to JSON

  return jsonData;
}
// Save JSON data to MongoDB
async function saveToMongoDB(jsonData) {
  try {
    const datapresent = await data.find();
    if (datapresent.length === 0) {
      await data.insertMany(jsonData); // Save array of data to MongoDB
      console.log("Data successfully saved to MongoDB");
    }
  } catch (error) {
    console.error("Error saving to MongoDB:", error);
  }
}

// Example usage
const filePath = "./data/Data.xlsx"; // Path to your Excel file
const jsonData = excelToJson(filePath); // Convert Excel to JSON
saveToMongoDB(jsonData); // Save JSON to MongoDB

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// routes
// get route
app.get("/", (req, res) => {
  data
    .find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(404).send("Please Fill All Required Fields");
    } else {
      const isAlreadyExist = await DataUsers.findOne({ email });
      if (isAlreadyExist) {
        res.status(404).send("User Already Exist");
      } else {
        const user = new DataUsers({
          name,
          email,
        });
        bcryptjs.hash(password, 10, (err, hashedPassword) => {
          user.set("password", hashedPassword);
          user.save();
          next();
        });
        return res.status(201).json("User Register Successfully");
      }
    }
  } catch (error) {
    console.log(error, "Error");
  }
});
app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Please Fill All Required Fields");
    } else {
      const user = await DataUsers.findOne({ email });
      if (!user) {
        res.status(401).send("User is not register ");
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res.status(400).send("User email or password is incorrect");
        } else {
          const payload = {
            userId: user._id,
            email: user.email,
          };
          const JWT_SECRET_KEY =
            process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY";
          jwt.sign(
            payload,
            JWT_SECRET_KEY,
            // { expiresIn: 84600 },
            async (err, token) => {
              await DataUsers.updateOne({ _id: user._id }, { $set: { token } });
              user.save();
              return res.status(200).json({
                user: { email: user.email, name: user.name, _id: user.id },
                token: token,
              });
            }
          );
        }
      }
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

// basic favicon route
app.get("/favicon.ico", function (req, res) {
  res.status(204);
  res.end();
});

// error handler middleware
// 404 error
app.use((req, res, next) => {
  res.send("Page Not Found");
});
// custome error
app.use((err, req, res, next) => {
  //   res.status(500).send("Internal Server Error");
  res.send(err);
});
// listtener
app.listen(port, () => {
  console.log("welcome to server" + port);
});

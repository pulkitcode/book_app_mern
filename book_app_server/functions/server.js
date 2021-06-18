const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// * set up mongoose

mongoose.connect(
  "mongodb+srv://MyUsername:MyPassword@mycluster.rkncu.mongodb.net/Book_app?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
  }
);

// * cors
app.use(cors({ origin: "*" }));

// * parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// * parse application/json
app.use(bodyParser.json());

app.use("/", require("./routes/user"));

module.exports.handler = serverless(app);

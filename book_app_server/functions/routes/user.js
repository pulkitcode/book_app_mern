const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const auth = require("../middlewares/auth");

// * user register

router.post("/register", async (req, res) => {
  // * required array
  let required = [];

  // * check required fields !
  if (!req.body.email) required.push("email");
  if (!req.body.password) required.push("password");
  if (!req.body.repeat_password) required.push("repeat_password");

  console.log("object");

  if (required.length === 0) {
    // * req.body

    const { password, email, repeat_password } = req.body;

    let findUser = await UserModel.findOne({
      email,
    });

    if (findUser) {
      res.json({
        status: "fail",
        message: "Email Id Already Exists !",
        response: [],
      });
    } else {
      // * got Match Password

      if (password !== repeat_password) {
        res.json({
          status: "fail",
          message: "Password Do Not Match !",
          response: [],
        });
      } else {
        let hash_password = bcrypt.hashSync(password, 8);
        console.log(hash_password);

        const newUserModel = new UserModel({
          password: hash_password,
          email,
        });

        await newUserModel.save();

        if (newUserModel) {
          res.json({
            status: "success",
            message: "Registered Succesfully !",
            response: newUserModel,
          });
        } else {
          res.json({
            status: "fail",
            message: "Something Went Wrong !",
            response: [],
          });
        }
      }
    }
  } else {
    // * mapping the required array list
    let message = required.map((item) => {
      return " " + item;
    });
    res.json({
      status: "fail",
      message: "Following fields are required - " + message,
      response: [],
    });
  }
});

//* user login

router.post("/login", async (req, res) => {
  // * required array
  let required = [];

  // * check required fields !
  if (!req.body.email) required.push("email");
  if (!req.body.password) required.push("password");

  if (required.length === 0) {
    // * req.body

    const { email, password } = req.body;

    let findUser = await UserModel.findOne({
      email,
    });

    if (findUser) {
      const isMatch = await bcrypt.compare(password, findUser.password);

      if (isMatch) {
        const token = jwt.sign(
          {
            id: findUser._id,
            email: findUser.email,
            createdAt: findUser.createdAt,
            updatedAt: findUser.updatedAt,
          },
          "shhhhhhh its my secret ...... ... .. .",
          { expiresIn: "1h" }
        );
        res.json({
          status: "success",
          message: "Logged In Succesfully !",
          response: {
            id: findUser._id,
            email: findUser.email,
          },
          token,
        });
      } else {
        res.json({
          status: "fail",
          message: "In Correct Password  !",
          response: [],
        });
      }
    } else {
      // * got Match Password

      res.json({
        status: "fail",
        message: "Email Id is Not Regsitered  !",
        response: [],
      });
    }
  } else {
    // * mapping the required array list
    let message = required.map((item) => {
      return " " + item;
    });
    res.json({
      status: "fail",
      message: "Following fields are required - " + message,
      response: [],
    });
  }
});

// * check auth token

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(
      token,
      "shhhhhhh its my secret ...... ... .. ."
    );
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// * delete user
router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// * get details of the user

router.get("/all_users", auth, async (req, res) => {
  const user = await UserModel.find({});
  res.json({
    user,
  });
});

// * ==================================================================

module.exports = router;

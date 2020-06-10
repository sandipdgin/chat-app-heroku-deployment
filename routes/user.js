/** @format */

const router = require("express").Router();
const ChatUser = require("../model/ChatUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("../routes/verifyToken");

//
// router.post("/register", verify, async (req, res) => {

router.post("/register", async (req, res) => {
  // checking user email id in db
  console.log("register api hit");
  const emailExist = await ChatUser.find({
    email: req.body.email,
  });

  if (!emailExist) return res.status(400).send("Email already exist");

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const chatUser = new ChatUser({
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    mobileNo: req.body.mobileNo,
    address: req.body.address,
    password: hashedPassword,
  });
  try {
    const saveChatUser = await chatUser.save();
    res.send(saveChatUser);
    console.log("user saved in db");
  } catch (error) {
    res.status(400).send(error);
  }
  //   res.send("All navigation");
});

// router.post("/login", verify, async (req, res) => {
router.post("/login", async (req, res) => {
  // checking user email id in db
  const userExist = await ChatUser.findOne({
    email: req.body.email,
  });

  if (!userExist) return res.status(400).send("Email is wrong");

  // checking user email id in db
  const userPass = await bcrypt.compare(req.body.password, userExist.password);

  if (!userPass) return res.status(400).send("Invalid password");

  // create and assign a token
  // console.log("req=", req);
  const gentoken = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", gentoken).send({ token: gentoken });
  // res.header("auth-token", gentoken).send(status, body);

  // res.send("User logged in");
});

router.post("/getUserDetails", async (req, res) => {
  try {
    // checking user email id in db
    const userExist = await ChatUser.findOne({
      email: req.body.email,
    });

    if (!userExist) return res.status(400).send("User is invalid");

    res.json({
      id: userExist._id,
      fName: userExist.fName,
      lName: userExist.lName,
      email: userExist.email,
      mobileNo: userExist.mobileNo,
      address: userExist.address,
    });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;

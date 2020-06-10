/** @format */

const mongoose = require("mongoose");
const chatUserSchema = new mongoose.Schema({
  fName: String,
  lName: String,
  email: String,
  mobileNo: String,
  address: String,
  password: String,
});

module.exports = mongoose.model("chatUser", chatUserSchema);

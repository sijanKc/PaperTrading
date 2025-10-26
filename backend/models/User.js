// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  dob: String,
  gender: String,
  nationality: String,
  citizenNo: String,
  countryCode: String,
  mobile: String,
  email: String,
  address: String,
  bankName: String,
  branch: String,
  accountNumber: String,
  accountType: String,
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;

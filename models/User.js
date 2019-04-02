const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  firstname: { type: String, require: true },
  lastname: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  password2: { type: String, require: true },
  gender: { type: String, require: true },
  created_at: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);
module.exports = User;

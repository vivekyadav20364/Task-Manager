const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {type:String,require:true},
  email:{type:String,require:true,unique: true},
  password:{type:String,require:true},
  role: { type: String, default: "user" }, // "admin" or "user"
});

module.exports = mongoose.model("UserTask", userSchema);

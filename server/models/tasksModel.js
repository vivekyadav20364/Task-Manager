const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: "UserTask",require:true },
  title: {type:String,require:true},
  description: {type:String,require:true},
  dueDate: {type:Date,require:true},
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "UserTask" },
});

module.exports = mongoose.model("Task", taskSchema);

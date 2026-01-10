const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },

  membershipNumber: String,
  membershipType: String,
  membershipStartDate: Date,
  membershipEndDate: Date,

  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("User", userSchema)

const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
  serialNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  author: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Book", bookSchema)

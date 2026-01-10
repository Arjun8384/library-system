require("dotenv").config()
const connectDB = require("../config/db")

const User = require("../models/User")
const Book = require("../models/Book")
const Transaction = require("../models/Transaction")

const clearDB = async () => {
  await connectDB()
  await Transaction.deleteMany()
  await Book.deleteMany()
  await User.deleteMany()
  console.log("🧹 Database cleared successfully")
  process.exit(0)
}

clearDB()

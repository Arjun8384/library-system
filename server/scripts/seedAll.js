const bcrypt = require("bcryptjs")
require("dotenv").config()

const connectDB = require("../config/db")

const User = require("../models/User")
const Book = require("../models/Book")
const Transaction = require("../models/Transaction")

const seedAll = async () => {
  try {
    await connectDB()
    console.log("MongoDB Connected (scripts)")

    await Transaction.deleteMany()
    await Book.deleteMany()
    await User.deleteMany()

    const adminPassword = await bcrypt.hash("admin123", 10)
    const userPassword = await bcrypt.hash("user123", 10)

    const admin = await User.create({
      name: "Admin",
      email: "arjunsingh@gmail.com",
      password: adminPassword,
      role: "admin",
    })

    const user = await User.create({
      name: "Test User",
      email: "user@library.com",
      password: userPassword,
      role: "user",
      membershipNumber: "MEM001",
      membershipType: "6 months",
      membershipStartDate: new Date(),
      membershipEndDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    })

    const books = await Book.insertMany([
      {
        serialNo: "BK001",
        name: "Clean Code",
        author: "Robert C. Martin",
      },
      {
        serialNo: "BK002",
        name: "Refactoring",
        author: "Martin Fowler",
      },
    ])

    await Transaction.create({
      userId: user._id,
      bookId: books[0]._id,
      issueDate: new Date(),
      returnDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      status: "issued",
    })

    await Book.findByIdAndUpdate(books[0]._id, { isAvailable: false })

    console.log("✅ Database seeded successfully")
    process.exit(0)
  } catch (err) {
    console.error("❌ Seeding error:", err)
    process.exit(1)
  }
}

seedAll()

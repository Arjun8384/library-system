const path = require("path")
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
})

const mongoose = require("mongoose")
const connectDB = require("../config/db")
const User = require("../models/User")

const seed = async () => {
  try {
    console.log("MONGO_URI =", process.env.MONGO_URI) // debug

    await connectDB()

    await User.deleteMany()

    await User.create([
      {
        name: "Admin",
        email: "arjunsingh@gmail.com",
        password: await require("bcryptjs").hash("admin123", 10),
        role: "admin",
      },
      {
        name: "User",
        email: "user@library.com",
        password: await require("bcryptjs").hash("user123", 10),
        role: "user",
      },
    ])

    console.log("✅ Database seeded successfully")
    process.exit(0)
  } catch (err) {
    console.error("❌ Seed error:", err)
    process.exit(1)
  }
}

seed()

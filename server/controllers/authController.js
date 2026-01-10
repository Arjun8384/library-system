const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || "library_secret",
      { expiresIn: "24h" },
    )

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)
    user = new User({ name, email, password: hashedPassword, role: role || "user" })
    await user.save()

    res.json({ message: "User created successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.seed = async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: "admin@library.com" })
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await User.create({ name: "Admin", email: "admin@library.com", password: hashedPassword, role: "admin" })
    }

    const userExists = await User.findOne({ email: "user@library.com" })
    if (!userExists) {
      const hashedPassword = await bcrypt.hash("user123", 10)
      const membershipNumber = "MEM" + Date.now()
      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 6)
      await User.create({
        name: "Test User",
        email: "user@library.com",
        password: hashedPassword,
        role: "user",
        membershipNumber,
        membershipType: "6 months",
        membershipStartDate: startDate,
        membershipEndDate: endDate,
      })
    }

    res.json({ message: "Seed data created" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

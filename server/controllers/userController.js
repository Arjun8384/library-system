const bcrypt = require("bcryptjs")
const User = require("../models/User")

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password")
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name) return res.status(400).json({ message: "Name is mandatory" })

    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: "User already exists" })

    const hashedPassword = await bcrypt.hash(password || "password123", 10)
    user = new User({ name, email, password: hashedPassword, role: "user" })
    await user.save()
    res.json({ message: "User created successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { name, email, isActive } = req.body
    if (!name) return res.status(400).json({ message: "Name is mandatory" })

    const user = await User.findByIdAndUpdate(req.params.id, { name, email, isActive }, { new: true }).select(
      "-password",
    )
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json({ message: "User updated successfully", user })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

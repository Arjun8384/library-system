const User = require("../models/User")

exports.addMembership = async (req, res) => {
  try {
    const { userId, membershipType } = req.body
    if (!userId || !membershipType) {
      return res.status(400).json({ message: "All fields are mandatory" })
    }

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    const membershipNumber = "MEM" + Date.now()
    const startDate = new Date()
    const endDate = new Date()

    if (membershipType === "6 months") endDate.setMonth(endDate.getMonth() + 6)
    else if (membershipType === "1 year") endDate.setFullYear(endDate.getFullYear() + 1)
    else if (membershipType === "2 years") endDate.setFullYear(endDate.getFullYear() + 2)

    user.membershipNumber = membershipNumber
    user.membershipType = membershipType
    user.membershipStartDate = startDate
    user.membershipEndDate = endDate
    await user.save()

    res.json({ message: "Membership added successfully", user })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.getMembership = async (req, res) => {
  try {
    const user = await User.findOne({ membershipNumber: req.params.membershipNumber }).select("-password")
    if (!user) return res.status(404).json({ message: "Membership not found" })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.updateMembership = async (req, res) => {
  try {
    const { action, extensionType } = req.body
    const user = await User.findOne({ membershipNumber: req.params.membershipNumber })
    if (!user) return res.status(404).json({ message: "Membership not found" })

    if (action === "cancel") {
      user.isActive = false
      user.membershipEndDate = new Date()
    } else if (action === "extend") {
      const extType = extensionType || "6 months"
      const endDate = new Date(user.membershipEndDate)
      if (extType === "6 months") endDate.setMonth(endDate.getMonth() + 6)
      else if (extType === "1 year") endDate.setFullYear(endDate.getFullYear() + 1)
      else if (extType === "2 years") endDate.setFullYear(endDate.getFullYear() + 2)
      user.membershipEndDate = endDate
    }

    await user.save()
    res.json({ message: "Membership updated successfully", user })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

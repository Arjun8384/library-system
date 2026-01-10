const Transaction = require("../models/Transaction")
const Book = require("../models/Book")
const User = require("../models/User")

exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query
    const query = {}

    if (req.user.role !== "admin") {
      query.userId = req.user.id
    }

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }
    if (status) query.status = status

    const transactions = await Transaction.find(query)
      .populate("bookId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })

    res.json(transactions)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.getBookStats = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 })
    const available = books.filter((b) => b.isAvailable).length
    const issued = books.filter((b) => !b.isAvailable).length
    res.json({ books, stats: { total: books.length, available, issued } })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.getMemberships = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      const user = await User.findById(req.user.id).select("-password")
      return res.json([user])
    }
    const users = await User.find({ membershipNumber: { $exists: true } }).select("-password")
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

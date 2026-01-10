const Book = require("../models/Book")

exports.getBooks = async (req, res) => {
  try {
    const { name, author, serialNo, type } = req.query
    const query = {}
    if (name) query.name = new RegExp(name, "i")
    if (author) query.author = new RegExp(author, "i")
    if (serialNo) query.serialNo = serialNo
    if (type) query.type = type
    const books = await Book.find(query)
    res.json(books)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.getAvailableBooks = async (req, res) => {
  try {
    const { name, author, serialNo } = req.query
    if (!name && !author && !serialNo) {
      return res.status(400).json({ message: "Please fill at least one search field" })
    }
    const query = { isAvailable: true }
    if (name) query.name = new RegExp(name, "i")
    if (author) query.author = new RegExp(author, "i")
    if (serialNo) query.serialNo = serialNo
    const books = await Book.find(query)
    res.json(books)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.addBook = async (req, res) => {
  try {
    const { serialNo, name, author, type, category } = req.body
    if (!serialNo || !name || !author) {
      return res.status(400).json({ message: "All fields are mandatory" })
    }
    const existing = await Book.findOne({ serialNo })
    if (existing) return res.status(400).json({ message: "Book with this serial number already exists" })

    const book = new Book({ serialNo, name, author, type: type || "book", category })
    await book.save()
    res.json({ message: "Book added successfully", book })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.updateBook = async (req, res) => {
  try {
    const { name, author, type, category } = req.body
    if (!name || !author) {
      return res.status(400).json({ message: "All fields are mandatory" })
    }
    const book = await Book.findOneAndUpdate(
      { serialNo: req.params.serialNo },
      { name, author, type: type || "book", category },
      { new: true },
    )
    if (!book) return res.status(404).json({ message: "Book not found" })
    res.json({ message: "Book updated successfully", book })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.seedBooks = async (req, res) => {
  try {
    const books = [
      { serialNo: "BK001", name: "The Great Gatsby", author: "F. Scott Fitzgerald", type: "book", category: "Fiction" },
      { serialNo: "BK002", name: "1984", author: "George Orwell", type: "book", category: "Fiction" },
      { serialNo: "BK003", name: "To Kill a Mockingbird", author: "Harper Lee", type: "book", category: "Fiction" },
      { serialNo: "MV001", name: "Inception", author: "Christopher Nolan", type: "movie", category: "Sci-Fi" },
      { serialNo: "MV002", name: "The Dark Knight", author: "Christopher Nolan", type: "movie", category: "Action" },
    ]

    for (const book of books) {
      const exists = await Book.findOne({ serialNo: book.serialNo })
      if (!exists) await Book.create(book)
    }
    res.json({ message: "Sample books added" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

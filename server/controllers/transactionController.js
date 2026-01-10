const Book = require("../models/Book")
const Transaction = require("../models/Transaction")

exports.issueBook = async (req, res) => {
  try {
    const { bookId, issueDate, returnDate, remarks } = req.body
    if (!bookId || !issueDate || !returnDate) {
      return res.status(400).json({ message: "Name of book, issue date and return date are required" })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const issueDateObj = new Date(issueDate)
    if (issueDateObj < today) {
      return res.status(400).json({ message: "Issue date cannot be lesser than today" })
    }

    const maxReturnDate = new Date(issueDateObj)
    maxReturnDate.setDate(maxReturnDate.getDate() + 15)
    const returnDateObj = new Date(returnDate)
    if (returnDateObj > maxReturnDate) {
      return res.status(400).json({ message: "Return date cannot be greater than 15 days from issue date" })
    }

    const book = await Book.findById(bookId)
    if (!book) return res.status(404).json({ message: "Book not found" })
    if (!book.isAvailable) return res.status(400).json({ message: "Book is not available" })

    const transaction = new Transaction({
      userId: req.user.id,
      bookId,
      issueDate: issueDateObj,
      returnDate: returnDateObj,
      remarks,
      status: "issued",
    })

    book.isAvailable = false
    await book.save()
    await transaction.save()

    res.json({ message: "Book issued successfully", transaction })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.getIssuedBooks = async (req, res) => {
  try {
    const { serialNo, bookName } = req.query
    const bookQuery = {}
    if (serialNo) bookQuery.serialNo = serialNo
    if (bookName) bookQuery.name = new RegExp(bookName, "i")

    const books = await Book.find(bookQuery)
    const bookIds = books.map((b) => b._id)

    const transactions = await Transaction.find({
      bookId: { $in: bookIds },
      status: "issued",
    })
      .populate("bookId")
      .populate("userId", "name email")

    res.json(transactions)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.returnBook = async (req, res) => {
  try {
    const { transactionId, actualReturnDate, finePaid, remarks } = req.body
    if (!transactionId || !actualReturnDate) {
      return res.status(400).json({ message: "Please select a book and return date" })
    }

    const transaction = await Transaction.findById(transactionId).populate("bookId")
    if (!transaction) return res.status(404).json({ message: "Transaction not found" })

    const returnDateObj = new Date(transaction.returnDate)
    const actualReturnObj = new Date(actualReturnDate)
    let fine = 0

    if (actualReturnObj > returnDateObj) {
      const diffTime = Math.abs(actualReturnObj - returnDateObj)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      fine = diffDays * 10
    }

    if (fine > 0 && !finePaid) {
      return res.status(400).json({
        message: "Fine payment checkbox must be checked to complete the return",
        fine,
      })
    }

    transaction.actualReturnDate = actualReturnObj
    transaction.fine = fine
    transaction.finePaid = fine > 0 ? finePaid : true
    transaction.status = "returned"
    transaction.remarks = remarks
    await transaction.save()

    const book = await Book.findById(transaction.bookId._id)
    book.isAvailable = true
    await book.save()

    res.json({ message: "Book returned successfully", transaction })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.getPendingFines = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,
      status: "returned",
      fine: { $gt: 0 },
      finePaid: false,
    }).populate("bookId")
    res.json(transactions)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.payFine = async (req, res) => {
  try {
    const { transactionId, finePaidCheckbox, remarks } = req.body
    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" })
    }

    const transaction = await Transaction.findById(transactionId)
    if (!transaction) return res.status(404).json({ message: "Transaction not found" })

    if (transaction.fine === 0) {
      return res.json({ message: "No fine to pay, transaction completed" })
    }

    if (!finePaidCheckbox) {
      return res.status(400).json({ message: "Please check the fine paid checkbox to confirm payment" })
    }

    transaction.finePaid = true
    transaction.remarks = remarks || transaction.remarks
    await transaction.save()

    res.json({ message: "Fine paid successfully", transaction })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

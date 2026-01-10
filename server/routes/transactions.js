const express = require("express")
const router = express.Router()
const transactionController = require("../controllers/transactionController")
const { auth } = require("../middleware/auth")

router.post("/issue", auth, transactionController.issueBook)
router.get("/issued", auth, transactionController.getIssuedBooks)
router.post("/return", auth, transactionController.returnBook)
router.get("/pending-fines", auth, transactionController.getPendingFines)
router.post("/pay-fine", auth, transactionController.payFine)

module.exports = router

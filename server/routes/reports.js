const express = require("express")
const router = express.Router()
const reportController = require("../controllers/reportController")
const { auth } = require("../middleware/auth")

router.get("/transactions", auth, reportController.getTransactions)
router.get("/books", auth, reportController.getBookStats)
router.get("/memberships", auth, reportController.getMemberships)

module.exports = router

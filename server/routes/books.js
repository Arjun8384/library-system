const express = require("express")
const router = express.Router()
const bookController = require("../controllers/bookController")
const { auth, adminOnly } = require("../middleware/auth")

router.get("/", auth, bookController.getBooks)
router.get("/available", auth, bookController.getAvailableBooks)
router.post("/", auth, adminOnly, bookController.addBook)
router.put("/:serialNo", auth, adminOnly, bookController.updateBook)
router.post("/seed", auth, adminOnly, bookController.seedBooks)

module.exports = router

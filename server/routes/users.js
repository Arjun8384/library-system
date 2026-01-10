const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { auth, adminOnly } = require("../middleware/auth")

router.get("/", auth, adminOnly, userController.getUsers)
router.post("/", auth, adminOnly, userController.createUser)
router.put("/:id", auth, adminOnly, userController.updateUser)

module.exports = router

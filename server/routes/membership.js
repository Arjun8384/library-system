const express = require("express")
const router = express.Router()
const membershipController = require("../controllers/membershipController")
const { auth, adminOnly } = require("../middleware/auth")

router.post("/", auth, adminOnly, membershipController.addMembership)
router.get("/:membershipNumber", auth, membershipController.getMembership)
router.put("/:membershipNumber", auth, adminOnly, membershipController.updateMembership)

module.exports = router

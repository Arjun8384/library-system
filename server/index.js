const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./config/db")

const authRoutes = require("./routes/auth")
const bookRoutes = require("./routes/books")
const userRoutes = require("./routes/users")
const membershipRoutes = require("./routes/membership")
const transactionRoutes = require("./routes/transactions")
const reportRoutes = require("./routes/reports")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/users", userRoutes)
app.use("/api/membership", membershipRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/reports", reportRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

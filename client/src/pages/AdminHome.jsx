"use client"

import { useState } from "react"
import api from "../api/axios"

export default function AdminHome() {
  const [message, setMessage] = useState("")

  const seedData = async () => {
    try {
      await api.post("/auth/seed")
      await api.post("/books/seed")
      setMessage("Sample data created successfully")
    } catch (err) {
      setMessage("Error creating sample data")
    }
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {message && <div className="success">{message}</div>}
      <div className="card">
        <h2>Welcome Admin</h2>
        <p>Use the sidebar to navigate to different modules:</p>
        <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            <strong>Maintenance:</strong> Add/Update Books, Memberships, User Management
          </li>
          <li>
            <strong>Transactions:</strong> Book Issue, Return Book, Pay Fine
          </li>
          <li>
            <strong>Reports:</strong> View all transactions and statistics
          </li>
        </ul>
        <button className="btn" style={{ marginTop: "20px" }} onClick={seedData}>
          Initialize Sample Data
        </button>
      </div>
    </div>
  )
}

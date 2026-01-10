"use client"

import { useState, useEffect } from "react"
import api from "../api/axios"

export default function AddMembership() {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState("")
  const [membershipType, setMembershipType] = useState("6 months")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await api.get("/users")
      const usersWithoutMembership = res.data.filter((u) => !u.membershipNumber)
      setUsers(usersWithoutMembership)
    } catch (err) {
      setError("Error loading users")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!userId || !membershipType) {
      setError("All fields are mandatory")
      return
    }

    try {
      await api.post("/membership", { userId, membershipType })
      setSuccess("Membership added successfully")
      setUserId("")
      loadUsers()
    } catch (err) {
      setError(err.response?.data?.message || "Error adding membership")
    }
  }

  return (
    <div>
      <h1>Add Membership</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select User *</label>
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
              <option value="">Select a user</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Membership Type *</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="membershipType"
                  value="6 months"
                  checked={membershipType === "6 months"}
                  onChange={(e) => setMembershipType(e.target.value)}
                />
                6 Months
              </label>
              <label>
                <input
                  type="radio"
                  name="membershipType"
                  value="1 year"
                  checked={membershipType === "1 year"}
                  onChange={(e) => setMembershipType(e.target.value)}
                />
                1 Year
              </label>
              <label>
                <input
                  type="radio"
                  name="membershipType"
                  value="2 years"
                  checked={membershipType === "2 years"}
                  onChange={(e) => setMembershipType(e.target.value)}
                />
                2 Years
              </label>
            </div>
          </div>
          <button type="submit" className="btn">
            Add Membership
          </button>
        </form>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import api from "../api/axios"

export default function UserManagement() {
  const [mode, setMode] = useState("new")
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await api.get("/users")
      setUsers(res.data)
    } catch (err) {
      setError("Error loading users")
    }
  }

  const handleUserSelect = (userId) => {
    const user = users.find((u) => u._id === userId)
    if (user) {
      setSelectedUser(user)
      setName(user.name)
      setEmail(user.email)
      setIsActive(user.isActive)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!name) {
      setError("Name is mandatory")
      return
    }

    try {
      if (mode === "new") {
        await api.post("/users", { name, email, password })
        setSuccess("User created successfully")
        setName("")
        setEmail("")
        setPassword("")
      } else {
        await api.put(`/users/${selectedUser._id}`, { name, email, isActive })
        setSuccess("User updated successfully")
      }
      loadUsers()
    } catch (err) {
      setError(err.response?.data?.message || "Error saving user")
    }
  }

  return (
    <div>
      <h1>User Management</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="mode"
              value="new"
              checked={mode === "new"}
              onChange={(e) => {
                setMode(e.target.value)
                setSelectedUser(null)
                setName("")
                setEmail("")
                setPassword("")
              }}
            />
            New User
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="existing"
              checked={mode === "existing"}
              onChange={(e) => setMode(e.target.value)}
            />
            Existing User
          </label>
        </div>
        {mode === "existing" && (
          <div className="form-group">
            <label>Select User</label>
            <select onChange={(e) => handleUserSelect(e.target.value)}>
              <option value="">Select a user</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {mode === "new" && (
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}
          {mode === "existing" && selectedUser && (
            <div className="checkbox-group">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <label>Active</label>
            </div>
          )}
          <button type="submit" className="btn">
            {mode === "new" ? "Create User" : "Update User"}
          </button>
        </form>
      </div>
    </div>
  )
}

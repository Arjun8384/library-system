"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div>
        <Link to="/">Library Management System</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: "20px" }}>Welcome, {user.name}</span>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}

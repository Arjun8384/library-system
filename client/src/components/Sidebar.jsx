"use client"

import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const basePath = isAdmin ? "/admin" : "/user"

  return (
    <div className="sidebar">
      <NavLink to={basePath} end>
        Home
      </NavLink>
      {isAdmin && (
        <>
          <h4 style={{ padding: "10px", marginTop: "10px", borderBottom: "1px solid #000" }}>Maintenance</h4>
          <NavLink to={`${basePath}/add-book`}>Add Book</NavLink>
          <NavLink to={`${basePath}/update-book`}>Update Book</NavLink>
          <NavLink to={`${basePath}/add-membership`}>Add Membership</NavLink>
          <NavLink to={`${basePath}/update-membership`}>Update Membership</NavLink>
          <NavLink to={`${basePath}/user-management`}>User Management</NavLink>
        </>
      )}
      <h4 style={{ padding: "10px", marginTop: "10px", borderBottom: "1px solid #000" }}>Transactions</h4>
      <NavLink to={`${basePath}/book-available`}>Book Available</NavLink>
      <NavLink to={`${basePath}/book-issue`}>Book Issue</NavLink>
      <NavLink to={`${basePath}/return-book`}>Return Book</NavLink>
      <NavLink to={`${basePath}/pay-fine`}>Pay Fine</NavLink>
      <h4 style={{ padding: "10px", marginTop: "10px", borderBottom: "1px solid #000" }}>Reports</h4>
      <NavLink to={`${basePath}/reports`}>View Reports</NavLink>
    </div>
  )
}

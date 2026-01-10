"use client"

import { useAuth } from "../context/AuthContext"

export default function UserHome() {
  const { user } = useAuth()

  return (
    <div>
      <h1>User Dashboard</h1>
      <div className="card">
        <h2>Welcome, {user?.name}</h2>
        <p>Use the sidebar to navigate:</p>
        <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            <strong>Transactions:</strong> Search Books, Issue Book, Return Book, Pay Fine
          </li>
          <li>
            <strong>Reports:</strong> View your transaction history
          </li>
        </ul>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import api from "../api/axios"

export default function Reports() {
  const [transactions, setTransactions] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  const loadReports = async () => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      if (status) params.append("status", status)

      const res = await api.get(`/reports/transactions?${params}`)
      setTransactions(res.data)
    } catch (err) {
      setError("Error loading reports")
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  return (
    <div>
      <h1>Reports</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="issued">Issued</option>
              <option value="returned">Returned</option>
            </select>
          </div>
          <button type="button" className="btn" style={{ alignSelf: "flex-end" }} onClick={loadReports}>
            Filter
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Serial No</th>
              <th>User</th>
              <th>Issue Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Fine</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{t.bookId?.name || "N/A"}</td>
                <td>{t.bookId?.serialNo || "N/A"}</td>
                <td>{t.userId?.name || "N/A"}</td>
                <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                <td>{new Date(t.returnDate).toLocaleDateString()}</td>
                <td>{t.status}</td>
                <td>{t.fine > 0 ? `Rs. ${t.fine}` : "-"}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

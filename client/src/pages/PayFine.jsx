"use client"

import { useState, useEffect } from "react"
import api from "../api/axios"

export default function PayFine() {
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [finePaidCheckbox, setFinePaidCheckbox] = useState(false)
  const [remarks, setRemarks] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadPendingFines()
  }, [])

  const loadPendingFines = async () => {
    try {
      const res = await api.get("/transactions/pending-fines")
      setTransactions(res.data)
    } catch (err) {
      setError("Error loading pending fines")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!selectedTransaction) {
      setError("Please select a transaction")
      return
    }

    if (selectedTransaction.fine > 0 && !finePaidCheckbox) {
      setError("Please check the fine paid checkbox to confirm payment")
      return
    }

    try {
      await api.post("/transactions/pay-fine", {
        transactionId: selectedTransaction._id,
        finePaidCheckbox,
        remarks,
      })
      setSuccess("Fine paid successfully")
      setSelectedTransaction(null)
      setFinePaidCheckbox(false)
      setRemarks("")
      loadPendingFines()
    } catch (err) {
      setError(err.response?.data?.message || "Error paying fine")
    }
  }

  return (
    <div>
      <h1>Pay Fine</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        {transactions.length === 0 && !error && <p>No pending fines. Transaction completed successfully if no fine.</p>}
        {transactions.length > 0 && !selectedTransaction && (
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Book Name</th>
                <th>Serial No</th>
                <th>Return Date</th>
                <th>Actual Return</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>
                    <input type="radio" name="transaction" onChange={() => setSelectedTransaction(t)} />
                  </td>
                  <td>{t.bookId.name}</td>
                  <td>{t.bookId.serialNo}</td>
                  <td>{new Date(t.returnDate).toLocaleDateString()}</td>
                  <td>{new Date(t.actualReturnDate).toLocaleDateString()}</td>
                  <td>Rs. {t.fine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedTransaction && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Name</label>
              <input value={selectedTransaction.bookId.name} disabled />
            </div>
            <div className="form-group">
              <label>Serial No</label>
              <input value={selectedTransaction.bookId.serialNo} disabled />
            </div>
            <div className="form-group">
              <label>Expected Return Date</label>
              <input value={new Date(selectedTransaction.returnDate).toLocaleDateString()} disabled />
            </div>
            <div className="form-group">
              <label>Actual Return Date</label>
              <input value={new Date(selectedTransaction.actualReturnDate).toLocaleDateString()} disabled />
            </div>
            <div className="form-group">
              <label>Fine Amount</label>
              <input value={`Rs. ${selectedTransaction.fine}`} disabled />
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={finePaidCheckbox}
                onChange={(e) => setFinePaidCheckbox(e.target.checked)}
              />
              <label>Fine Paid</label>
            </div>
            <div className="form-group">
              <label>Remarks</label>
              <input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn">
                Confirm Payment
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setSelectedTransaction(null)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import api from "../api/axios"

export default function ReturnBook() {
  const [searchSerialNo, setSearchSerialNo] = useState("")
  const [searchName, setSearchName] = useState("")
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [actualReturnDate, setActualReturnDate] = useState("")
  const [finePaid, setFinePaid] = useState(false)
  const [remarks, setRemarks] = useState("")
  const [calculatedFine, setCalculatedFine] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSearch = async () => {
    setError("")
    setTransactions([])
    setSelectedTransaction(null)

    if (!searchSerialNo && !searchName) {
      setError("Please enter serial number or book name")
      return
    }

    try {
      const params = new URLSearchParams()
      if (searchSerialNo) params.append("serialNo", searchSerialNo)
      if (searchName) params.append("bookName", searchName)

      const res = await api.get(`/transactions/issued?${params}`)
      setTransactions(res.data)
      if (res.data.length === 0) {
        setError("No issued books found")
      }
    } catch (err) {
      setError("Error searching transactions")
    }
  }

  const handleSelectTransaction = (t) => {
    setSelectedTransaction(t)
    const today = new Date().toISOString().split("T")[0]
    setActualReturnDate(today)

    const returnDateObj = new Date(t.returnDate)
    const actualDateObj = new Date(today)
    let fine = 0
    if (actualDateObj > returnDateObj) {
      const diffTime = Math.abs(actualDateObj - returnDateObj)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      fine = diffDays * 10
    }
    setCalculatedFine(fine)
  }

  const handleDateChange = (date) => {
    setActualReturnDate(date)
    if (selectedTransaction) {
      const returnDateObj = new Date(selectedTransaction.returnDate)
      const actualDateObj = new Date(date)
      let fine = 0
      if (actualDateObj > returnDateObj) {
        const diffTime = Math.abs(actualDateObj - returnDateObj)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        fine = diffDays * 10
      }
      setCalculatedFine(fine)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!selectedTransaction || !actualReturnDate) {
      setError("Please select a book and return date")
      return
    }

    try {
      await api.post("/transactions/return", {
        transactionId: selectedTransaction._id,
        actualReturnDate,
        finePaid,
        remarks,
      })
      setSuccess("Book returned successfully")
      setSelectedTransaction(null)
      setTransactions([])
      setSearchSerialNo("")
      setSearchName("")
      setRemarks("")
      setFinePaid(false)
      setCalculatedFine(0)
    } catch (err) {
      setError(err.response?.data?.message || "Error returning book")
    }
  }

  return (
    <div>
      <h1>Return Book</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Serial No</label>
            <input value={searchSerialNo} onChange={(e) => setSearchSerialNo(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Book Name</label>
            <input value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          </div>
          <button type="button" className="btn" style={{ alignSelf: "flex-end" }} onClick={handleSearch}>
            Search
          </button>
        </div>
        {transactions.length > 0 && !selectedTransaction && (
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Serial No</th>
                <th>Book Name</th>
                <th>Issue Date</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>
                    <input type="radio" name="transaction" onChange={() => handleSelectTransaction(t)} />
                  </td>
                  <td>{t.bookId.serialNo}</td>
                  <td>{t.bookId.name}</td>
                  <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                  <td>{new Date(t.returnDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedTransaction && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Name *</label>
              <input value={selectedTransaction.bookId.name} disabled />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input value={selectedTransaction.bookId.author} disabled />
            </div>
            <div className="form-group">
              <label>Serial No *</label>
              <input value={selectedTransaction.bookId.serialNo} disabled />
            </div>
            <div className="form-group">
              <label>Issue Date</label>
              <input value={new Date(selectedTransaction.issueDate).toLocaleDateString()} disabled />
            </div>
            <div className="form-group">
              <label>Return Date (Expected)</label>
              <input value={new Date(selectedTransaction.returnDate).toLocaleDateString()} disabled />
            </div>
            <div className="form-group">
              <label>Actual Return Date *</label>
              <input type="date" value={actualReturnDate} onChange={(e) => handleDateChange(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fine Amount</label>
              <input value={`Rs. ${calculatedFine}`} disabled />
            </div>
            {calculatedFine > 0 && (
              <div className="checkbox-group">
                <input type="checkbox" checked={finePaid} onChange={(e) => setFinePaid(e.target.checked)} />
                <label>Fine Paid</label>
              </div>
            )}
            <div className="form-group">
              <label>Remarks</label>
              <input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn">
                Confirm Return
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

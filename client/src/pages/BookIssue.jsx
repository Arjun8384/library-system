"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import api from "../api/axios"

export default function BookIssue() {
  const location = useLocation()
  const [book, setBook] = useState(location.state?.book || null)
  const [searchName, setSearchName] = useState("")
  const [books, setBooks] = useState([])
  const [issueDate, setIssueDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [remarks, setRemarks] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setIssueDate(today)
    const returnDateObj = new Date()
    returnDateObj.setDate(returnDateObj.getDate() + 15)
    setReturnDate(returnDateObj.toISOString().split("T")[0])
  }, [])

  const handleSearch = async () => {
    if (!searchName) return
    try {
      const res = await api.get(`/books/available?name=${searchName}`)
      setBooks(res.data)
    } catch (err) {
      setError("Error searching books")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!book || !issueDate || !returnDate) {
      setError("Name of book, issue date and return date are required")
      return
    }

    try {
      await api.post("/transactions/issue", {
        bookId: book._id,
        issueDate,
        returnDate,
        remarks,
      })
      setSuccess("Book issued successfully")
      setBook(null)
      setBooks([])
      setSearchName("")
      setRemarks("")
    } catch (err) {
      setError(err.response?.data?.message || "Error issuing book")
    }
  }

  return (
    <div>
      <h1>Book Issue</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        {!book && (
          <>
            <div className="form-group">
              <label>Search Book by Name *</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                <button type="button" className="btn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
            {books.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Serial No</th>
                    <th>Name</th>
                    <th>Author</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <input type="radio" name="book" onChange={() => setBook(b)} />
                      </td>
                      <td>{b.serialNo}</td>
                      <td>{b.name}</td>
                      <td>{b.author}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        {book && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Name *</label>
              <input value={book.name} disabled />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input value={book.author} disabled />
            </div>
            <div className="form-group">
              <label>Serial No</label>
              <input value={book.serialNo} disabled />
            </div>
            <div className="form-group">
              <label>Issue Date *</label>
              <input
                type="date"
                value={issueDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Return Date *</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
              <small>Cannot be more than 15 days from issue date</small>
            </div>
            <div className="form-group">
              <label>Remarks</label>
              <input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn">
                Issue Book
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setBook(null)}>
                Select Different Book
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

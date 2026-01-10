"use client"

import { useState } from "react"
import api from "../api/axios"

export default function UpdateBook() {
  const [type, setType] = useState("book")
  const [searchSerialNo, setSearchSerialNo] = useState("")
  const [book, setBook] = useState(null)
  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSearch = async () => {
    setError("")
    setBook(null)
    try {
      const res = await api.get(`/books?serialNo=${searchSerialNo}`)
      if (res.data.length > 0) {
        const b = res.data[0]
        setBook(b)
        setName(b.name)
        setAuthor(b.author)
        setCategory(b.category || "")
        setType(b.type)
      } else {
        setError("Book not found")
      }
    } catch (err) {
      setError("Error searching book")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!name || !author) {
      setError("All fields are mandatory")
      return
    }

    try {
      await api.put(`/books/${book.serialNo}`, { name, author, type, category })
      setSuccess("Book updated successfully")
    } catch (err) {
      setError(err.response?.data?.message || "Error updating book")
    }
  }

  return (
    <div>
      <h1>Update Book</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <div className="form-group">
          <label>Search by Serial No</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={searchSerialNo} onChange={(e) => setSearchSerialNo(e.target.value)} />
            <button type="button" className="btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        {book && (
          <form onSubmit={handleSubmit}>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="book"
                  checked={type === "book"}
                  onChange={(e) => setType(e.target.value)}
                />
                Book
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="movie"
                  checked={type === "movie"}
                  onChange={(e) => setType(e.target.value)}
                />
                Movie
              </label>
            </div>
            <div className="form-group">
              <label>Serial No</label>
              <input value={book.serialNo} disabled />
            </div>
            <div className="form-group">
              <label>Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Author *</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <button type="submit" className="btn">
              Update Book
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

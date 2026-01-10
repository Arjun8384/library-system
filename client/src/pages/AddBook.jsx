"use client"

import { useState } from "react"
import api from "../api/axios"

export default function AddBook() {
  const [type, setType] = useState("book")
  const [serialNo, setSerialNo] = useState("")
  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!serialNo || !name || !author) {
      setError("All fields are mandatory")
      return
    }

    try {
      await api.post("/books", { serialNo, name, author, type, category })
      setSuccess("Book added successfully")
      setSerialNo("")
      setName("")
      setAuthor("")
      setCategory("")
    } catch (err) {
      setError(err.response?.data?.message || "Error adding book")
    }
  }

  return (
    <div>
      <h1>Add Book</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
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
            <label>Serial No *</label>
            <input value={serialNo} onChange={(e) => setSerialNo(e.target.value)} />
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
            Add Book
          </button>
        </form>
      </div>
    </div>
  )
}

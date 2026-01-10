"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"

export default function BookAvailable() {
  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [serialNo, setSerialNo] = useState("")
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    setError("")
    setBooks([])
    setSelectedBook(null)

    if (!name && !author && !serialNo) {
      setError("Please fill at least one search field")
      return
    }

    try {
      const params = new URLSearchParams()
      if (name) params.append("name", name)
      if (author) params.append("author", author)
      if (serialNo) params.append("serialNo", serialNo)

      const res = await api.get(`/books/available?${params}`)
      setBooks(res.data)
      if (res.data.length === 0) {
        setError("No books found")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error searching books")
    }
  }

  const handleIssue = () => {
    if (selectedBook) {
      const basePath = user.role === "admin" ? "/admin" : "/user"
      navigate(`${basePath}/book-issue`, { state: { book: selectedBook } })
    }
  }

  return (
    <div>
      <h1>Book Available</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>Book Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Serial No</label>
            <input value={serialNo} onChange={(e) => setSerialNo(e.target.value)} />
          </div>
          <button type="submit" className="btn">
            Search
          </button>
        </form>
        {books.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Serial No</th>
                  <th>Name</th>
                  <th>Author</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <input
                        type="radio"
                        name="selectedBook"
                        checked={selectedBook?._id === book._id}
                        onChange={() => setSelectedBook(book)}
                      />
                    </td>
                    <td>{book.serialNo}</td>
                    <td>{book.name}</td>
                    <td>{book.author}</td>
                    <td>{book.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className="btn"
              style={{ marginTop: "15px" }}
              onClick={handleIssue}
              disabled={!selectedBook}
            >
              Issue Selected Book
            </button>
          </>
        )}
      </div>
    </div>
  )
}

"use client"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import AdminHome from "./pages/AdminHome"
import UserHome from "./pages/UserHome"
import AddBook from "./pages/AddBook"
import UpdateBook from "./pages/UpdateBook"
import AddMembership from "./pages/AddMembership"
import UpdateMembership from "./pages/UpdateMembership"
import UserManagement from "./pages/UserManagement"
import BookAvailable from "./pages/BookAvailable"
import BookIssue from "./pages/BookIssue"
import ReturnBook from "./pages/ReturnBook"
import PayFine from "./pages/PayFine"
import Reports from "./pages/Reports"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (adminOnly && user.role !== "admin") return <Navigate to="/user" />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <AdminHome />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-book"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <AddBook />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/update-book"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <UpdateBook />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-membership"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <AddMembership />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/update-membership"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <UpdateMembership />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/user-management"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <UserManagement />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/book-available"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <BookAvailable />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/book-issue"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <BookIssue />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/return-book"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <ReturnBook />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pay-fine"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <PayFine />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute adminOnly>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <Reports />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <UserHome />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/book-available"
        element={
          <ProtectedRoute>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <BookAvailable />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/book-issue"
        element={
          <ProtectedRoute>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <BookIssue />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/return-book"
        element={
          <ProtectedRoute>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <ReturnBook />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/pay-fine"
        element={
          <ProtectedRoute>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <PayFine />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/reports"
        element={
          <ProtectedRoute>
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <Reports />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/user") : "/login"} />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

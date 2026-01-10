"use client"

import { useState } from "react"
import api from "../api/axios"

export default function UpdateMembership() {
  const [membershipNumber, setMembershipNumber] = useState("")
  const [membership, setMembership] = useState(null)
  const [extensionType, setExtensionType] = useState("6 months")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSearch = async () => {
    setError("")
    setMembership(null)
    setSuccess("")

    if (!membershipNumber) {
      setError("Membership number is mandatory")
      return
    }

    try {
      const res = await api.get(`/membership/${membershipNumber}`)
      setMembership(res.data)
    } catch (err) {
      setError("Membership not found")
    }
  }

  const handleExtend = async () => {
    setError("")
    setSuccess("")
    try {
      await api.put(`/membership/${membershipNumber}`, { action: "extend", extensionType })
      setSuccess("Membership extended successfully")
      handleSearch()
    } catch (err) {
      setError(err.response?.data?.message || "Error extending membership")
    }
  }

  const handleCancel = async () => {
    setError("")
    setSuccess("")
    try {
      await api.put(`/membership/${membershipNumber}`, { action: "cancel" })
      setSuccess("Membership cancelled successfully")
      handleSearch()
    } catch (err) {
      setError(err.response?.data?.message || "Error cancelling membership")
    }
  }

  return (
    <div>
      <h1>Update Membership</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <div className="form-group">
          <label>Membership Number *</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={membershipNumber} onChange={(e) => setMembershipNumber(e.target.value)} />
            <button type="button" className="btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        {membership && (
          <>
            <div className="form-group">
              <label>Name</label>
              <input value={membership.name} disabled />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={membership.email} disabled />
            </div>
            <div className="form-group">
              <label>Current Membership Type</label>
              <input value={membership.membershipType} disabled />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input value={new Date(membership.membershipStartDate).toLocaleDateString()} disabled />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input value={new Date(membership.membershipEndDate).toLocaleDateString()} disabled />
            </div>
            <div className="form-group">
              <label>Status</label>
              <input value={membership.isActive ? "Active" : "Inactive"} disabled />
            </div>
            <div className="form-group">
              <label>Extension Period</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="extensionType"
                    value="6 months"
                    checked={extensionType === "6 months"}
                    onChange={(e) => setExtensionType(e.target.value)}
                  />
                  6 Months
                </label>
                <label>
                  <input
                    type="radio"
                    name="extensionType"
                    value="1 year"
                    checked={extensionType === "1 year"}
                    onChange={(e) => setExtensionType(e.target.value)}
                  />
                  1 Year
                </label>
                <label>
                  <input
                    type="radio"
                    name="extensionType"
                    value="2 years"
                    checked={extensionType === "2 years"}
                    onChange={(e) => setExtensionType(e.target.value)}
                  />
                  2 Years
                </label>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="btn" onClick={handleExtend}>
                Extend Membership
              </button>
              <button type="button" className="btn btn-outline" onClick={handleCancel}>
                Cancel Membership
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

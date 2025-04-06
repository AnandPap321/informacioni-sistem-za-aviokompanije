"use client";

import { useState, useEffect } from "react";
import { getAllUsers, promoteToAdmin, demoteToCustomer } from "../api/userApi";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId) => {
    if (actionInProgress) return;
    try {
      setActionInProgress(true);
      await promoteToAdmin(userId);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: "admin" } : user
        )
      );
    } catch (err) {
      setError("Failed to promote user.");
      console.error("Error promoting user:", err);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDemoteUser = async (userId) => {
    if (actionInProgress) return;
    try {
      setActionInProgress(true);
      await demoteToCustomer(userId);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: "customer" } : user
        )
      );
    } catch (err) {
      setError("Failed to demote user.");
      console.error("Error demoting admin:", err);
    } finally {
      setActionInProgress(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-user-management">
      <h1>User Management</h1>

      {error && <div className="error-message">{error}</div>}

      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <button onClick={fetchUsers} className="refresh-btn">
        Refresh
      </button>

      <div className="user-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Points</th>
              <th>Bookings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.phoneNumber || "N/A"}</td>
                  <td>{user.loyaltyPoints || 0}</td>
                  <td>
                    {user.bookingHistory?.length > 0
                      ? user.bookingHistory.length + " bookings"
                      : "None"}
                  </td>
                  <td>
                    {user.role === "customer" ? (
                      <button
                        onClick={() => handlePromoteUser(user._id)}
                        disabled={actionInProgress}
                        className="promote-btn">
                        Promote
                      </button>
                    ) : user.role === "admin" ? (
                      <button
                        onClick={() => handleDemoteUser(user._id)}
                        disabled={actionInProgress}
                        className="demote-btn">
                        Demote
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-users">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;

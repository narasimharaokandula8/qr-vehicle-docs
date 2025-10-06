import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AccessControl() {
  const [vehicles, setVehicles] = useState([]);
  const [userId, setUserId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all vehicles the current user can access
  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) return;
  axios.get(`http://localhost:5174/api/accessible-vehicles/${ownerId}`)
      .then(res => setVehicles(res.data.vehicles))
      .catch(() => setVehicles([]));
  }, []);

  // Grant access to another user
  const handleGrantAccess = async (e) => {
    e.preventDefault();
    try {
  await axios.post("http://localhost:5174/api/grant-access", { vehicleId, userId });
      setMessage("Access granted");
    } catch {
      setMessage("Grant access failed");
    }
  };

  // Assign driver to vehicle
  const handleAssignDriver = async (e) => {
    e.preventDefault();
    try {
  await axios.post("http://localhost:5174/api/assign-driver", { vehicleId, driverId });
      setMessage("Driver assigned");
    } catch {
      setMessage("Assign driver failed");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "auto" }}>
      <h2>Access Control & Driver Assignment</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleGrantAccess} style={{ marginBottom: 24 }}>
        <h4>Grant Access to User</h4>
        <label>Vehicle:
          <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} required>
            <option value="">Select Vehicle</option>
            {vehicles.map(v => <option key={v._id} value={v._id}>{v.vehicleNo}</option>)}
          </select>
        </label>
        <label>User ID:
          <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID" required />
        </label>
        <button type="submit">Grant Access</button>
      </form>
      <form onSubmit={handleAssignDriver}>
        <h4>Assign Driver to Vehicle</h4>
        <label>Vehicle:
          <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} required>
            <option value="">Select Vehicle</option>
            {vehicles.map(v => <option key={v._id} value={v._id}>{v.vehicleNo}</option>)}
          </select>
        </label>
        <label>Driver User ID:
          <input value={driverId} onChange={e => setDriverId(e.target.value)} placeholder="Driver User ID" required />
        </label>
        <button type="submit">Assign Driver</button>
      </form>
    </div>
  );
}

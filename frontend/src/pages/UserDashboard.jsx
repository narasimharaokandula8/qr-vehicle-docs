
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserDashboard = () => {
  const [docs, setDocs] = useState([]);
  const [message, setMessage] = useState("");
  const [qrMap, setQrMap] = useState({});
  const [userQr, setUserQr] = useState("");
  // Generate QR for user
  const handleGenerateUserQR = async () => {
    try {
  const res = await axios.get(`http://localhost:5174/api/userqr/${ownerId}`);
      setUserQr(res.data.qr);
    } catch {
      setMessage("User QR generation failed");
    }
  };
  const [editId, setEditId] = useState(null);
  const [editVehicleNo, setEditVehicleNo] = useState("");

  // Get ownerId from JWT
  const token = localStorage.getItem("token");
  let ownerId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      ownerId = decoded.id;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const fetchDocs = async () => {
    try {
  const res = await axios.get(`http://localhost:5174/api/accessible-vehicles/${ownerId}`);
      setDocs(res.data.vehicles);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch vehicles.");
    }
  };

  useEffect(() => {
    if (!ownerId) {
      setMessage("You must be logged in to view documents.");
      return;
    }
    fetchDocs();
    // eslint-disable-next-line
  }, [ownerId]);

  // Delete vehicle
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
  await axios.delete(`http://localhost:5174/api/documents/${id}`);
      setMessage("Vehicle deleted");
      fetchDocs();
    } catch {
      setMessage("Delete failed");
    }
  };

  // Start editing
  const handleEdit = (doc) => {
    setEditId(doc._id);
    setEditVehicleNo(doc.vehicleNo);
  };

  // Save update
  const handleUpdate = async (id) => {
    try {
  await axios.put(`http://localhost:5174/api/documents/${id}`, { vehicleNo: editVehicleNo });
      setMessage("Vehicle updated");
      setEditId(null);
      fetchDocs();
    } catch {
      setMessage("Update failed");
    }
  };

  // Generate QR for vehicle
  const handleGenerateQR = async (id) => {
    try {
  const res = await axios.get(`http://localhost:5174/api/vehicleqr/${id}`);
      setQrMap((prev) => ({ ...prev, [id]: res.data.qr }));
    } catch {
      setMessage("QR generation failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2>Your Uploaded Vehicle Documents</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={handleGenerateUserQR}>Show My QR</button>
        {userQr && <img src={userQr} alt="User QR" style={{ width: 80, height: 80, marginLeft: 16, verticalAlign: "middle" }} />}
      </div>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {docs.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>RC</th>
              <th>Insurance</th>
              <th>PUC</th>
              <th>Fitness</th>
              <th>Uploaded At</th>
              <th>Actions</th>
              <th>QR</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc._id}>
                <td>
                  {editId === doc._id ? (
                    <input value={editVehicleNo} onChange={e => setEditVehicleNo(e.target.value)} />
                  ) : (
                    doc.vehicleNo
                  )}
                </td>
                <td>
                  <a href={`http://localhost:5174/uploads/${doc.rc}`} target="_blank" rel="noreferrer">View</a>
                </td>
                <td>
                  <a href={`http://localhost:5174/uploads/${doc.insurance}`} target="_blank" rel="noreferrer">View</a>
                </td>
                <td>
                  <a href={`http://localhost:5174/uploads/${doc.puc}`} target="_blank" rel="noreferrer">View</a>
                </td>
                <td>
                  <a href={`http://localhost:5174/uploads/${doc.fitness}`} target="_blank" rel="noreferrer">View</a>
                </td>
                <td>{new Date(doc.createdAt).toLocaleString()}</td>
                <td>
                  {editId === doc._id ? (
                    <>
                      <button onClick={() => handleUpdate(doc._id)}>Save</button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(doc)}>Edit</button>
                      <button onClick={() => handleDelete(doc._id)}>Delete</button>
                      <button onClick={() => handleGenerateQR(doc._id)}>QR</button>
                    </>
                  )}
                </td>
                <td>
                  {qrMap[doc._id] && (
                    <img src={qrMap[doc._id]} alt="QR" style={{ width: 64, height: 64 }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDashboard;

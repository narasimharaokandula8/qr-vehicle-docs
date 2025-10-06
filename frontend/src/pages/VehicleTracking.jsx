import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const VehicleTracking = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState("");
  const [fuelInfo, setFuelInfo] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  let userId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
  const res = await axios.get(`http://localhost:5174/api/accessible-vehicles/${userId}`);
        setVehicles(res.data.vehicles);
      } catch {
        setMessage("Failed to fetch vehicles");
      }
    };
    if (userId) fetchVehicles();
  }, [userId]);

  const handleTrack = async () => {
    if (!selectedVehicle) return;
    try {
  const res = await axios.get(`http://localhost:5174/api/location/${selectedVehicle}`);
      setLocation(res.data.location);
    } catch {
      setMessage("Failed to get location");
    }
  };

  const handleCalculateFuel = async () => {
    if (!selectedVehicle || !distance) return;
    try {
  const res = await axios.post(`http://localhost:5174/api/calculate-fuel`, { vehicleId: selectedVehicle, distanceKm: parseFloat(distance) });
      setFuelInfo(res.data);
    } catch {
      setMessage("Fuel calculation failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Vehicle Tracking</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <div style={{ marginBottom: 20 }}>
        <label>Select Vehicle:</label>
        <select value={selectedVehicle} onChange={e => setSelectedVehicle(e.target.value)}>
          <option value="">Choose a vehicle</option>
          {vehicles.map(v => <option key={v._id} value={v._id}>{v.vehicleNo}</option>)}
        </select>
        <button onClick={handleTrack}>Track Location</button>
      </div>
      {location && (
        <div>
          <h3>Location</h3>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Last Updated: {new Date(location.lastUpdated).toLocaleString()}</p>
          {/* Placeholder for map */}
          <div style={{ height: 300, background: "#f0f0f0", border: "1px solid #ccc" }}>
            Map Placeholder - Integrate Google Maps here
          </div>
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <h3>Fuel Calculation</h3>
        <input
          type="number"
          placeholder="Distance in km"
          value={distance}
          onChange={e => setDistance(e.target.value)}
        />
        <button onClick={handleCalculateFuel}>Calculate Fuel</button>
        {fuelInfo && (
          <p>Fuel Needed: {fuelInfo.fuelNeeded.toFixed(2)} liters of {fuelInfo.fuelType}</p>
        )}
      </div>
    </div>
  );
};

export default VehicleTracking;


import express from "express";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import QRCode from "qrcode";
import { authMiddleware } from "./auth.js";

const router = express.Router();

// Fetch all documents for a user (owner or police only)
router.get("/documents/:ownerId", authMiddleware, async (req, res) => {
  try {
    const { ownerId } = req.params;
    // Only allow owner or police to fetch
    if (req.user.id !== ownerId && req.user.role !== "police") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const documents = await Vehicle.find({ ownerId });
    res.json({ documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a vehicle document (owner only)
router.delete("/documents/:vehicleId", authMiddleware, async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (req.user.id !== vehicle.ownerId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await Vehicle.findByIdAndDelete(vehicleId);
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// Update a vehicle document (owner only)
router.put("/documents/:vehicleId", authMiddleware, async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const update = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (req.user.id !== vehicle.ownerId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await Vehicle.findByIdAndUpdate(vehicleId, update);
    res.json({ message: "Vehicle updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

// Generate QR for user (protected)
router.get("/userqr/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    // Only allow self or police
    if (req.user.id !== userId && req.user.role !== "police") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const qrData = JSON.stringify({ userId: user._id, name: user.name, email: user.email });
    const qr = await QRCode.toDataURL(qrData);
    res.json({ qr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "QR generation failed" });
  }
});

// Generate QR for each vehicle (protected)
router.get("/vehicleqr/:vehicleId", authMiddleware, async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    // Only allow owner, assigned driver, or police
    if (
      req.user.id !== vehicle.ownerId.toString() &&
      (!vehicle.drivers || !vehicle.drivers.includes(req.user.id)) &&
      req.user.role !== "police"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const qrData = JSON.stringify({ vehicleId: vehicle._id, vehicleNo: vehicle.vehicleNo, ownerId: vehicle.ownerId });
    const qr = await QRCode.toDataURL(qrData);
    res.json({ qr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "QR generation failed" });
  }
});

// Add a new vehicle (owner only)
router.post("/documents", authMiddleware, async (req, res) => {
  try {
    const { vehicleNo, rc, insurance, puc, fitness } = req.body;
    // Only allow owner to add their own vehicle
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can add vehicles" });
    }
    const vehicle = new Vehicle({ vehicleNo, ownerId: req.user.id, rc, insurance, puc, fitness });
    await vehicle.save();
    res.json({ message: "Vehicle added", vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Add failed" });
  }
});

// Endpoint to fetch document by QR scan (protected)
import AuditLog from "../models/AuditLog.js";
router.post("/scan-qr", authMiddleware, async (req, res) => {
  try {
    const { qrData, fromApp } = req.body;
    let data;
    try {
      data = JSON.parse(qrData);
    } catch (e) {
      return res.status(400).json({ message: "Invalid QR data" });
    }
    if (data.vehicleId) {
      const vehicle = await Vehicle.findById(data.vehicleId);
      if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
      // Only allow owner, assigned driver, or police
      if (
        req.user.id !== vehicle.ownerId.toString() &&
        (!vehicle.drivers || !vehicle.drivers.includes(req.user.id)) &&
        req.user.role !== "police"
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (fromApp) {
res.json({ document: vehicle });
      try {
        await AuditLog.create({
          actorId: req.user.id,
          action: "qr_scan_vehicle",
          resource: String(vehicle._id),
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          details: { vehicleNo: vehicle.vehicleNo }
        });
      } catch (e) { /* log failure silently */ }
      } else {
res.json({ document: { vehicleId: vehicle._id, vehicleNo: vehicle.vehicleNo, ownerId: vehicle.ownerId } });
      try {
        await AuditLog.create({
          actorId: req.user.id,
          action: "qr_scan_vehicle_meta",
          resource: String(vehicle._id),
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          details: { vehicleNo: vehicle.vehicleNo }
        });
      } catch (e) { /* ignore */ }
      }
    } else if (data.userId) {
      const user = await User.findById(data.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      // Only allow self or police
      if (req.user.id !== user._id.toString() && req.user.role !== "police") {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (fromApp) {
res.json({ document: user });
      try {
        await AuditLog.create({
          actorId: req.user.id,
          action: "qr_scan_user",
          resource: String(user._id),
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          details: { email: user.email }
        });
      } catch (e) { /* ignore */ }
      } else {
res.json({ document: { userId: user._id, name: user.name, email: user.email } });
      try {
        await AuditLog.create({
          actorId: req.user.id,
          action: "qr_scan_user_meta",
          resource: String(user._id),
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          details: { email: user.email }
        });
      } catch (e) { /* ignore */ }
      }
    } else {
      res.status(400).json({ message: "QR data not recognized" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "QR scan failed" });
  }
});

// Get all vehicles a user can access (owned, assigned, or granted) - Task8
router.get("/accessible-vehicles/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    // Only allow self or police
    if (req.user.id !== userId && req.user.role !== "police") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const vehicles = await Vehicle.find({
      $or: [
        { ownerId: userId },
        { drivers: userId },
        { access: userId }
      ]
    });
    res.json({ vehicles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch accessible vehicles failed" });
  }
});

// Assign a driver to a vehicle (owner only)
router.post("/assign-driver", authMiddleware, async (req, res) => {
  try {
    const { vehicleId, driverId } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (req.user.id !== vehicle.ownerId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!vehicle.drivers.includes(driverId)) {
      vehicle.drivers.push(driverId);
      await vehicle.save();
    }
    res.json({ message: "Driver assigned", vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Assign driver failed" });
  }
});

// Grant access to a user for a vehicle (owner only)
router.post("/grant-access", authMiddleware, async (req, res) => {
  try {
    const { vehicleId, userId } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (req.user.id !== vehicle.ownerId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!vehicle.access.includes(userId)) {
      vehicle.access.push(userId);
      await vehicle.save();
    }
    res.json({ message: "Access granted", vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Grant access failed" });
  }
});

// Update vehicle location (owner or driver)
router.post("/update-location", authMiddleware, async (req, res) => {
  try {
    const { vehicleId, latitude, longitude } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    // Only allow owner or assigned driver
    if (
      req.user.id !== vehicle.ownerId.toString() &&
      (!vehicle.drivers || !vehicle.drivers.includes(req.user.id))
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    vehicle.location = { latitude, longitude, lastUpdated: new Date() };
    await vehicle.save();
    res.json({ message: "Location updated", vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update location failed" });
  }
});

// Get vehicle location (owner, driver, or police)
router.get("/location/:vehicleId", authMiddleware, async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findById(vehicleId).select('location vehicleNo ownerId drivers');
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    // Only allow owner, driver, or police
    if (
      req.user.id !== vehicle.ownerId.toString() &&
      (!vehicle.drivers || !vehicle.drivers.includes(req.user.id)) &&
      req.user.role !== "police"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json({ location: vehicle.location, vehicleNo: vehicle.vehicleNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch location failed" });
  }
});

// Calculate fuel for route (owner, driver, or police)
router.post("/calculate-fuel", authMiddleware, async (req, res) => {
  try {
    const { vehicleId, distanceKm } = req.body; // distance in km
    const vehicle = await Vehicle.findById(vehicleId).select('fuelConsumption fuelType ownerId drivers');
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    // Only allow owner, driver, or police
    if (
      req.user.id !== vehicle.ownerId.toString() &&
      (!vehicle.drivers || !vehicle.drivers.includes(req.user.id)) &&
      req.user.role !== "police"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const fuelNeeded = distanceKm / vehicle.fuelConsumption;
    res.json({ fuelNeeded, fuelType: vehicle.fuelType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fuel calculation failed" });
  }
});

export default router;

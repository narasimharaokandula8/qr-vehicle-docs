import mongoose from "mongoose";

const qrScanSchema = new mongoose.Schema({
  // QR Code being scanned
  qrCode: { type: String, required: true },
  qrType: { type: String, enum: ["user", "vehicle"], required: true },
  
  // Who scanned
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scannerRole: { type: String, enum: ["owner", "driver", "police"], required: true },
  
  // What was accessed
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  targetVehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  
  // Scan context
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  
  // Device and network info
  deviceInfo: {
    userAgent: String,
    platform: String,
    browser: String,
    isMobile: Boolean
  },
  
  ip: String,
  sessionId: String,
  
  // Scan results
  success: { type: Boolean, default: true },
  errorReason: String,
  documentsAccessed: [{
    type: { type: String, enum: ["rc", "insurance", "puc", "fitness", "license"] },
    accessed: { type: Boolean, default: true },
    accessedAt: { type: Date, default: Date.now }
  }],
  
  // Security and fraud detection
  riskScore: { type: Number, default: 0, min: 0, max: 100 },
  suspiciousActivity: {
    rapidScanning: Boolean,
    unusualLocation: Boolean,
    multipleDevices: Boolean,
    officeHours: Boolean
  },
  
  // Duration tracking
  scanDuration: Number, // in milliseconds
  viewDuration: Number, // how long documents were viewed
  
  // Additional metadata
  purpose: String, // e.g., "traffic_check", "verification", "routine_patrol"
  notes: String,
  
  // Privacy and retention
  anonymized: { type: Boolean, default: false },
  retainUntil: Date
}, { 
  timestamps: true,
  // Auto-expire scans after 1 year for privacy
  expires: 31536000 // 1 year in seconds
});

// Pre-save middleware to calculate risk score
qrScanSchema.pre('save', function(next) {
  let riskScore = 0;
  
  // Calculate risk based on various factors
  if (this.suspiciousActivity?.rapidScanning) riskScore += 25;
  if (this.suspiciousActivity?.unusualLocation) riskScore += 20;
  if (this.suspiciousActivity?.multipleDevices) riskScore += 30;
  if (!this.suspiciousActivity?.officeHours) riskScore += 10;
  if (this.scannerRole === 'owner' && this.targetUserId?.toString() !== this.scannedBy?.toString()) {
    riskScore += 15; // Scanning someone else's QR
  }
  
  this.riskScore = Math.min(riskScore, 100);
  next();
});

// Static method to record a scan
qrScanSchema.statics.recordScan = async function(scanData) {
  const scan = new this(scanData);
  
  // Check for rapid scanning (same user scanning multiple codes quickly)
  const recentScans = await this.countDocuments({
    scannedBy: scanData.scannedBy,
    createdAt: { $gte: new Date(Date.now() - 60000) } // Last minute
  });
  
  if (recentScans >= 5) {
    scan.suspiciousActivity = scan.suspiciousActivity || {};
    scan.suspiciousActivity.rapidScanning = true;
  }
  
  return scan.save();
};

// Method to get scan statistics for a user/vehicle
qrScanSchema.statics.getStatistics = function(userId, vehicleId = null) {
  const matchQuery = { targetUserId: userId };
  if (vehicleId) matchQuery.targetVehicleId = vehicleId;
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalScans: { $sum: 1 },
        uniqueScanners: { $addToSet: "$scannedBy" },
        avgRiskScore: { $avg: "$riskScore" },
        lastScan: { $max: "$createdAt" },
        scansByRole: {
          $push: {
            role: "$scannerRole",
            count: 1
          }
        }
      }
    },
    {
      $project: {
        totalScans: 1,
        uniqueScannersCount: { $size: "$uniqueScanners" },
        avgRiskScore: { $round: ["$avgRiskScore", 2] },
        lastScan: 1,
        scansByRole: 1
      }
    }
  ]);
};

// Indexes for performance
qrScanSchema.index({ qrCode: 1 });
qrScanSchema.index({ scannedBy: 1, createdAt: -1 });
qrScanSchema.index({ targetUserId: 1, createdAt: -1 });
qrScanSchema.index({ targetVehicleId: 1, createdAt: -1 });
qrScanSchema.index({ riskScore: -1 });
qrScanSchema.index({ createdAt: -1 });
qrScanSchema.index({ ip: 1 });

export default mongoose.model("QRScan", qrScanSchema);
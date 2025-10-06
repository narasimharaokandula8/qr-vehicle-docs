import mongoose from "mongoose";
import { nanoid } from "nanoid";

const documentSchema = new mongoose.Schema({
  type: { type: String, enum: ['rc', 'insurance', 'puc', 'fitness', 'license'], required: true },
  filename: { type: String, required: true },
  originalName: String,
  mimeType: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
  expiryDate: Date,
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verifiedAt: Date,
  encryptionIv: String, // For file encryption
  status: { type: String, enum: ['active', 'expired', 'invalid'], default: 'active' }
});

const vehicleSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true, unique: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  access: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
  // Vehicle Details
  vehicleType: { type: String, enum: ['car', 'bike', 'truck', 'bus', 'auto'], default: 'car' },
  make: String,
  model: String,
  year: Number,
  color: String,
  engineNumber: String,
  chassisNumber: String,
  
  // Documents - Enhanced structure
  documents: [documentSchema],
  
  // Legacy document fields for compatibility
  rc: String,
  insurance: String,
  puc: String,
  fitness: String,
  
  // QR Code for this vehicle (if per-vehicle QR is enabled)
  qrCode: {
    data: String,
    generatedAt: Date,
    expiresAt: Date,
    isActive: { type: Boolean, default: true },
    scanCount: { type: Number, default: 0 }
  },
  
  // Location tracking
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    lastUpdated: Date
  },
  
  // Vehicle specifications
  fuelType: { type: String, enum: ['petrol', 'diesel', 'cng', 'electric', 'hybrid'], default: 'petrol' },
  fuelConsumption: { type: Number, default: 10 },
  engineCapacity: String,
  seatingCapacity: Number,
  
  // Registration details
  registrationDate: Date,
  registrationState: String,
  rtoCode: String,
  
  // Status and verification
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationDate: Date,
  
  // Document expiry tracking
  documentExpiry: {
    rc: Date,
    insurance: Date,
    puc: Date,
    fitness: Date,
    permit: Date
  },
  
  // Notifications
  notifications: {
    expiryAlerts: { type: Boolean, default: true },
    lastAlertSent: Date
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate QR code for this vehicle
vehicleSchema.methods.generateQRCode = function() {
  this.qrCode = {
    data: `vehicle:${this._id}:${nanoid(10)}`,
    generatedAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true,
    scanCount: 0
  };
  return this.qrCode.data;
};

// Check if any documents are expiring soon
vehicleSchema.methods.getExpiringDocuments = function(daysAhead = 30) {
  const cutoffDate = new Date(Date.now() + (daysAhead * 24 * 60 * 60 * 1000));
  const expiring = [];
  
  Object.entries(this.documentExpiry || {}).forEach(([docType, expiryDate]) => {
    if (expiryDate && new Date(expiryDate) <= cutoffDate) {
      expiring.push({ type: docType, expiryDate });
    }
  });
  
  return expiring;
};

// Get document by type
vehicleSchema.methods.getDocument = function(docType) {
  return this.documents.find(doc => doc.type === docType && doc.status === 'active');
};

// Add or update document
vehicleSchema.methods.addDocument = function(docData) {
  // Remove existing document of same type
  this.documents = this.documents.filter(doc => doc.type !== docData.type);
  // Add new document
  this.documents.push(docData);
  return this.save();
};

// Virtual for display name
vehicleSchema.virtual('displayName').get(function() {
  return `${this.make} ${this.model} (${this.vehicleNo})`;
});

// Indexes for performance
vehicleSchema.index({ vehicleNo: 1 });
vehicleSchema.index({ ownerId: 1 });
vehicleSchema.index({ 'qrCode.data': 1 });
vehicleSchema.index({ 'documents.type': 1 });
vehicleSchema.index({ 'documentExpiry.insurance': 1 });
vehicleSchema.index({ 'documentExpiry.puc': 1 });

export default mongoose.model("Vehicle", vehicleSchema);

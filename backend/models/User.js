import mongoose from "mongoose";
import { nanoid } from "nanoid";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["owner", "driver", "police"], default: "owner" },
  
  // Personal Information
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "India" }
  },
  
  // Document & Profile
  profilePicture: String,
  licenseNumber: String,
  licenseExpiry: Date,
  
  // QR Code Management
  qrCode: {
    data: String, // QR code string
    generatedAt: { type: Date, default: Date.now },
    expiresAt: Date,
    isActive: { type: Boolean, default: true },
    scanCount: { type: Number, default: 0 }
  },
  
  // Security & Authentication
  loginAttempts: { type: Number, default: 0 },
  lockoutTime: Date,
  lastLogin: Date,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Multi-Vehicle Management
  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
  
  // Payment & Subscription
  paymentStatus: { type: String, enum: ["pending", "paid", "expired"], default: "pending" },
  subscriptionExpiry: Date,
  paymentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  
  // Preferences
  preferences: {
    qrCodeType: { type: String, enum: ["single", "per-vehicle"], default: "single" },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      documentExpiry: { type: Boolean, default: true }
    }
  },
  
  // Status
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  blockReason: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate unique QR code data
userSchema.methods.generateQRCode = function() {
  this.qrCode = {
    data: `user:${this._id}:${nanoid(10)}`,
    generatedAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    isActive: true,
    scanCount: 0
  };
  return this.qrCode.data;
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockoutTime && this.lockoutTime > Date.now());
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  if (this.lockoutTime && this.lockoutTime < Date.now()) {
    return this.updateOne({
      $unset: { lockoutTime: 1, loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockoutTime: Date.now() + 15 * 60 * 1000 }; // 15 minutes
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { lockoutTime: 1, loginAttempts: 1 },
    $set: { lastLogin: Date.now() }
  });
};

// Virtual for full name display
userSchema.virtual('displayName').get(function() {
  return this.name;
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ 'qrCode.data': 1 });
userSchema.index({ licenseNumber: 1 });

export default mongoose.model("User", userSchema);

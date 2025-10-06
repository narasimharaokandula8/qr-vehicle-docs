import mongoose from "mongoose";
import { nanoid } from "nanoid";

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true, default: () => `PAY_${nanoid(10)}` },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  
  // Payment details
  type: { type: String, enum: ["registration", "modification", "renewal", "qr_generation"], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  
  // Payment method and gateway
  method: { type: String, enum: ["upi", "card", "netbanking", "wallet"], default: "upi" },
  gateway: { type: String, enum: ["razorpay", "payu", "phonepe", "demo"], default: "demo" },
  gatewayTransactionId: String,
  gatewayPaymentId: String,
  
  // Status tracking
  status: { type: String, enum: ["pending", "processing", "success", "failed", "refunded"], default: "pending" },
  failureReason: String,
  
  // Timestamps
  initiatedAt: { type: Date, default: Date.now },
  completedAt: Date,
  
  // Additional metadata
  description: String,
  invoice: {
    number: String,
    url: String
  },
  refund: {
    amount: Number,
    reason: String,
    refundedAt: Date,
    refundId: String
  },
  
  meta: { type: Object, default: {} }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for payment reference
paymentSchema.virtual('reference').get(function() {
  return this.paymentId;
});

// Method to mark payment as successful
paymentSchema.methods.markSuccess = function(transactionDetails = {}) {
  this.status = 'success';
  this.completedAt = new Date();
  this.gatewayTransactionId = transactionDetails.transactionId;
  this.gatewayPaymentId = transactionDetails.paymentId;
  return this.save();
};

// Method to mark payment as failed
paymentSchema.methods.markFailed = function(reason) {
  this.status = 'failed';
  this.failureReason = reason;
  this.completedAt = new Date();
  return this.save();
};

// Indexes
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model("Payment", paymentSchema);

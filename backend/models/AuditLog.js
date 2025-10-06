import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  // Who performed the action
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  actorRole: { type: String, enum: ["owner", "driver", "police", "admin"], required: true },
  actorEmail: String, // Cache for quick reference
  
  // What action was performed
  action: { type: String, required: true }, // e.g., 'qr_scan', 'document_upload', 'login'
  actionCategory: { type: String, enum: ["auth", "document", "qr", "payment", "admin"], required: true },
  
  // What resource was affected
  resource: String, // e.g., 'vehicle:123', 'user:456'
  resourceType: { type: String, enum: ["user", "vehicle", "document", "payment", "qr_code"] },
  resourceId: { type: mongoose.Schema.Types.ObjectId },
  
  // Context information
  ip: String,
  userAgent: String,
  location: {
    city: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  
  // Request details
  httpMethod: String,
  endpoint: String,
  statusCode: Number,
  
  // Security tracking
  riskLevel: { type: String, enum: ["low", "medium", "high", "critical"], default: "low" },
  flagged: { type: Boolean, default: false },
  flagReason: String,
  
  // Session tracking
  sessionId: String,
  deviceFingerprint: String,
  
  // Additional metadata
  details: { type: Object, default: {} },
  
  // Success/failure
  success: { type: Boolean, default: true },
  errorMessage: String,
  
  // Privacy
  anonymized: { type: Boolean, default: false }
}, { 
  timestamps: true,
  // Auto-expire logs after 2 years for privacy
  expires: 63072000 // 2 years in seconds
});

// Static method to log actions
auditLogSchema.statics.logAction = function({
  actorId,
  actorRole,
  actorEmail,
  action,
  actionCategory,
  resource,
  resourceType,
  resourceId,
  ip,
  userAgent,
  httpMethod,
  endpoint,
  statusCode,
  riskLevel = 'low',
  details = {},
  success = true,
  errorMessage,
  req
}) {
  // Extract additional info from request if available
  if (req) {
    ip = ip || req.ip || req.connection.remoteAddress;
    userAgent = userAgent || req.get('User-Agent');
    httpMethod = httpMethod || req.method;
    endpoint = endpoint || req.originalUrl;
  }
  
  return this.create({
    actorId,
    actorRole,
    actorEmail,
    action,
    actionCategory,
    resource,
    resourceType,
    resourceId,
    ip,
    userAgent,
    httpMethod,
    endpoint,
    statusCode,
    riskLevel,
    details,
    success,
    errorMessage
  });
};

// Method to flag suspicious activity
auditLogSchema.methods.flag = function(reason) {
  this.flagged = true;
  this.flagReason = reason;
  this.riskLevel = 'high';
  return this.save();
};

// Indexes for performance and queries
auditLogSchema.index({ actorId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ actionCategory: 1 });
auditLogSchema.index({ riskLevel: 1 });
auditLogSchema.index({ flagged: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ ip: 1 });

export default mongoose.model("AuditLog", auditLogSchema);

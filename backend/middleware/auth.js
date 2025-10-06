import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { rateLimiter, DeviceUtils } from '../utils/crypto.js';

/**
 * Enhanced authentication middleware with security features
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided',
        code: 'NO_TOKEN'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch fresh user data to check if account is still active
      const user = await User.findById(decoded.id).select('+loginAttempts +lockoutTime +isActive +isBlocked');
      
      if (!user) {
        return res.status(401).json({ 
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      
      if (!user.isActive || user.isBlocked) {
        return res.status(401).json({ 
          message: 'Account is inactive or blocked',
          code: 'ACCOUNT_INACTIVE'
        });
      }
      
      if (user.isLocked()) {
        return res.status(423).json({ 
          message: 'Account is temporarily locked',
          code: 'ACCOUNT_LOCKED',
          lockoutTime: user.lockoutTime
        });
      }
      
      // Add user info to request
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        isVerified: user.isVerified,
        preferences: user.preferences
      };
      
      // Add device info for security tracking
      req.device = DeviceUtils.parseUserAgent(req.get('User-Agent'));
      req.fingerprint = DeviceUtils.generateFingerprint(req);
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      return res.status(401).json({ 
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      message: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    const userRole = req.user.role;
    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowed,
        current: userRole
      });
    }
    
    next();
  };
};

/**
 * Rate limiting middleware
 */
export const rateLimit = (options = {}) => {
  const {
    maxRequests = 10,
    windowMs = 60000,
    message = 'Too many requests',
    keyGenerator = (req) => req.ip,
    skipSuccessful = false
  } = options;
  
  return (req, res, next) => {
    const key = keyGenerator(req);
    const limit = rateLimiter.isRateLimited(key, maxRequests, windowMs);
    
    if (limit.limited) {
      return res.status(429).json({
        message,
        code: 'RATE_LIMITED',
        resetTime: new Date(limit.resetTime).toISOString(),
        windowMs
      });
    }
    
    // Add rate limit info to response headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': limit.remaining,
      'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString()
    });
    
    next();
  };
};

/**
 * Audit logging middleware
 */
export const auditLog = (action, actionCategory, options = {}) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const startTime = Date.now();
    
    // Override res.send to capture response
    res.send = function(data) {
      const duration = Date.now() - startTime;
      const success = res.statusCode >= 200 && res.statusCode < 400;
      
      // Log the action
      setImmediate(async () => {
        try {
          const logData = {
            actorId: req.user?.id,
            actorRole: req.user?.role,
            actorEmail: req.user?.email,
            action,
            actionCategory,
            resource: options.resourceId || req.params.id || req.params.userId || req.params.vehicleId,
            resourceType: options.resourceType,
            resourceId: options.resourceId,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            httpMethod: req.method,
            endpoint: req.originalUrl,
            statusCode: res.statusCode,
            success,
            details: {
              duration,
              body: options.logBody ? req.body : undefined,
              query: Object.keys(req.query).length > 0 ? req.query : undefined,
              ...options.additionalDetails
            },
            sessionId: req.headers['x-session-id'],
            deviceFingerprint: req.fingerprint,
            riskLevel: options.riskLevel || 'low'
          };
          
          if (!success && data) {
            try {
              const errorData = JSON.parse(data);
              logData.errorMessage = errorData.message || 'Unknown error';
            } catch (e) {
              logData.errorMessage = 'Parse error response failed';
            }
          }
          
          await AuditLog.logAction(logData);
        } catch (error) {
          console.error('Audit logging failed:', error);
        }
      });
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Resource ownership middleware - checks if user owns the resource
 */
export const requireOwnership = (resourceModel, param = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[param];
      const userId = req.user.id;
      
      const resource = await resourceModel.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ 
          message: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }
      
      // Check ownership - handle different ownership patterns
      let isOwner = false;
      
      if (resource.ownerId) {
        isOwner = resource.ownerId.toString() === userId;
      } else if (resource.userId) {
        isOwner = resource.userId.toString() === userId;
      } else if (resource._id) {
        isOwner = resource._id.toString() === userId;
      }
      
      // Police can access any resource
      if (req.user.role === 'police') {
        isOwner = true;
      }
      
      if (!isOwner) {
        return res.status(403).json({ 
          message: 'Access denied - resource not owned by user',
          code: 'NOT_RESOURCE_OWNER'
        });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ 
        message: 'Ownership verification failed',
        code: 'OWNERSHIP_CHECK_ERROR'
      });
    }
  };
};

/**
 * Police-only access middleware with location validation
 */
export const requirePoliceAccess = (options = {}) => {
  return async (req, res, next) => {
    if (req.user.role !== 'police') {
      return res.status(403).json({ 
        message: 'Police access required',
        code: 'POLICE_ACCESS_REQUIRED'
      });
    }
    
    // Optional: Validate location for on-duty verification
    if (options.requireLocation) {
      const { latitude, longitude } = req.body;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ 
          message: 'Location required for police access',
          code: 'LOCATION_REQUIRED'
        });
      }
      
      req.policeLocation = { latitude, longitude };
    }
    
    // Optional: Check working hours
    if (options.workingHoursOnly) {
      const hour = new Date().getHours();
      const isWorkingHours = hour >= 6 && hour <= 22; // 6 AM to 10 PM
      
      if (!isWorkingHours) {
        // Log after-hours access
        req.afterHours = true;
      }
    }
    
    next();
  };
};

/**
 * Validate request data middleware
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message,
          value: d.context?.value
        }))
      });
    }
    
    req.validatedData = value;
    next();
  };
};

/**
 * Security headers middleware
 */
export const securityHeaders = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': \"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'\"
  });
  next();
};

/**
 * CORS middleware with enhanced security
 */
export const corsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://yourdomain.com'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  
  res.set({
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Session-ID',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  });
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
};
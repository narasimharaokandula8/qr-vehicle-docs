import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Encryption utilities
export class FileEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyBase64 = process.env.FILE_ENCRYPTION_KEY;
    
    if (!this.keyBase64) {
      console.warn('FILE_ENCRYPTION_KEY not set - file encryption disabled');
      this.enabled = false;
      return;
    }
    
    try {
      this.key = this.keyBase64.startsWith('base64:') 
        ? Buffer.from(this.keyBase64.slice(7), 'base64')
        : Buffer.from(this.keyBase64, 'base64');
      this.enabled = true;
    } catch (error) {
      console.error('Invalid encryption key format:', error.message);
      this.enabled = false;
    }
  }

  /**
   * Encrypt a file and return the encrypted filename
   */
  encryptFile(filePath) {
    if (!this.enabled) return null;
    
    try {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipher(this.algorithm, this.key, iv);
      
      const data = fs.readFileSync(filePath);
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
      const tag = cipher.getAuthTag();
      
      // Format: [iv(12) + tag(16) + encrypted_data]
      const result = Buffer.concat([iv, tag, encrypted]);
      
      const encryptedPath = filePath + '.enc';
      fs.writeFileSync(encryptedPath, result);
      
      // Remove original file
      fs.unlinkSync(filePath);
      
      return path.basename(encryptedPath);
    } catch (error) {
      console.error('File encryption failed:', error.message);
      return null;
    }
  }

  /**
   * Decrypt a file and return the decrypted buffer
   */
  decryptFile(encryptedFilePath) {
    if (!this.enabled) {
      // Return original file if encryption is disabled
      return fs.readFileSync(encryptedFilePath);
    }

    try {
      const data = fs.readFileSync(encryptedFilePath);
      
      const iv = data.slice(0, 12);
      const tag = data.slice(12, 28);
      const encrypted = data.slice(28);
      
      const decipher = crypto.createDecipher(this.algorithm, this.key, iv);
      decipher.setAuthTag(tag);
      
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ]);
      
      return decrypted;
    } catch (error) {
      console.error('File decryption failed:', error.message);
      throw new Error('Failed to decrypt file');
    }
  }

  /**
   * Check if a file is encrypted based on extension
   */
  isEncrypted(filename) {
    return filename.endsWith('.enc');
  }

  /**
   * Get the original filename from encrypted filename
   */
  getOriginalFilename(encryptedFilename) {
    return encryptedFilename.replace(/\.enc$/, '');
  }
}

// Password hashing utilities
export class PasswordUtils {
  static generateSalt(rounds = 12) {
    return crypto.randomBytes(rounds);
  }

  static async hashPassword(password, saltRounds = 12) {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password, hash) {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hash);
  }

  // Generate secure random tokens
  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate OTP
  static generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[crypto.randomInt(0, digits.length)];
    }
    return otp;
  }
}

// QR Code utilities
export class QRUtils {
  /**
   * Generate QR code data for user
   */
  static generateUserQRData(user) {
    return {
      type: 'user',
      userId: user._id,
      name: user.name,
      email: user.email,
      qrId: user.qrCode?.data || `user:${user._id}:${crypto.randomUUID()}`,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Generate QR code data for vehicle
   */
  static generateVehicleQRData(vehicle, owner) {
    return {
      type: 'vehicle',
      vehicleId: vehicle._id,
      vehicleNo: vehicle.vehicleNo,
      ownerId: vehicle.ownerId,
      ownerName: owner?.name,
      qrId: vehicle.qrCode?.data || `vehicle:${vehicle._id}:${crypto.randomUUID()}`,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Parse and validate QR code data
   */
  static parseQRData(qrString) {
    try {
      const data = typeof qrString === 'string' ? JSON.parse(qrString) : qrString;
      
      // Validate required fields
      if (!data.type || !['user', 'vehicle'].includes(data.type)) {
        throw new Error('Invalid QR type');
      }

      if (data.type === 'user' && !data.userId) {
        throw new Error('User ID required for user QR');
      }

      if (data.type === 'vehicle' && !data.vehicleId) {
        throw new Error('Vehicle ID required for vehicle QR');
      }

      return {
        isValid: true,
        data,
        type: data.type
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
        type: null
      };
    }
  }
}

// Device fingerprinting for security
export class DeviceUtils {
  static generateFingerprint(req) {
    const components = [
      req.get('User-Agent') || '',
      req.get('Accept-Language') || '',
      req.get('Accept-Encoding') || '',
      req.ip || '',
      req.get('X-Forwarded-For') || ''
    ];
    
    return crypto.createHash('sha256')
      .update(components.join('|'))
      .digest('hex')
      .substring(0, 16);
  }

  static parseUserAgent(userAgent) {
    if (!userAgent) return {};
    
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    let platform = 'Unknown';
    if (userAgent.includes('Windows')) platform = 'Windows';
    else if (userAgent.includes('Mac')) platform = 'macOS';
    else if (userAgent.includes('Linux')) platform = 'Linux';
    else if (userAgent.includes('Android')) platform = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) platform = 'iOS';
    
    return {
      browser,
      platform,
      isMobile,
      isTablet,
      userAgent
    };
  }
}

// Rate limiting utilities
export class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  /**
   * Check if request should be rate limited
   */
  isRateLimited(key, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= maxRequests) {
      return {
        limited: true,
        resetTime: validRequests[0] + windowMs
      };
    }
    
    // Add current request
    validRequests.push(now);
    
    return {
      limited: false,
      remaining: maxRequests - validRequests.length
    };
  }

  /**
   * Clean up old entries periodically
   */
  cleanup() {
    const now = Date.now();
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > now - 300000); // 5 minutes
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

// Initialize utilities
export const fileEncryption = new FileEncryption();
export const rateLimiter = new RateLimiter();

// Cleanup rate limiter every 5 minutes
setInterval(() => rateLimiter.cleanup(), 300000);
# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**VehicleDoc Pro** is a comprehensive QR-based vehicle document management system built with a modern full-stack architecture. It enables secure digital storage, management, and verification of vehicle documents through QR codes, serving vehicle owners, drivers, and police officers.

## Development Commands

### Initial Setup
```bash
# Run automated setup script (recommended for first time)
npm run setup

# Manual setup - install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Development Servers
```bash
# Start both frontend and backend simultaneously
npm run dev:backend    # Backend on localhost:5174
npm run dev:frontend   # Frontend on localhost:5173 (with proxy to backend)

# Individual servers
cd backend && npm start
cd frontend && npm run dev
```

### Building & Testing
```bash
# Build frontend for production
npm run build
npm run build:frontend

# Run tests (when implemented)
npm test
npm run test:backend
npm run test:frontend

# Linting (when configured)
npm run lint
npm run lint:backend
npm run lint:frontend
```

### Database & Environment Setup
```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Generate security keys (use setup.js output)
# Backend .env requires: MONGO_URI, JWT_SECRET, FILE_ENCRYPTION_KEY
# Frontend .env requires: VITE_API_BASE_URL
```

## Architecture Overview

### System Design
The application follows a **3-tier architecture** with clear separation of concerns:

- **Frontend (React + Vite)**: Glassmorphism UI with role-based dashboards
- **Backend (Node.js + Express)**: RESTful API with JWT authentication
- **Database (MongoDB)**: Document storage with Mongoose ODM

### Key Components

#### Backend Architecture
- **Routes**: Modular API endpoints (`auth.js`, `documents.js`, `upload.js`, `payments.js`)
- **Models**: Mongoose schemas (`User.js`, `Vehicle.js`, `Payment.js`, `AuditLog.js`, `QRScan.js`)
- **Middleware**: JWT authentication, RBAC, security headers
- **File Handling**: Multer for uploads, AES-256-GCM encryption for document security

#### Frontend Architecture  
- **Pages**: Role-based dashboards (Home, UserDashboard, PoliceDashboard, UploadDocs, QrScanner)
- **Routing**: React Router with protected routes based on JWT roles
- **State Management**: Local state with JWT token persistence
- **API Integration**: Axios with proxy configuration (dev) and environment-based URLs (prod)

#### Database Schema Design
- **Users**: Multi-role support (owner/driver/police), QR code management, security features
- **Vehicles**: Document storage, driver assignment, location tracking, QR generation
- **Payments**: Transaction tracking with gateway integration
- **AuditLogs**: Comprehensive activity tracking for security compliance

### Role-Based Access Control (RBAC)
- **Owners**: Full vehicle management, document upload, QR generation, driver assignment
- **Drivers**: Access to assigned vehicles, document viewing, location updates  
- **Police**: Read-only document verification, QR scanning, audit trail generation

### Security Implementation
- **Document Encryption**: Files encrypted using AES-256-GCM before storage
- **JWT Authentication**: Role-based tokens with 1-hour expiration
- **QR Code Security**: Unique identifiers with nanoid, expiration tracking
- **Audit Logging**: All sensitive operations logged with IP/user-agent tracking
- **Access Control**: Granular permissions based on ownership, assignment, or role

## Development Patterns & Conventions

### API Design Patterns
- RESTful endpoints with consistent HTTP methods
- JWT middleware for protected routes with role-based access checks
- Standardized error responses with appropriate HTTP status codes
- Request validation and sanitization

### Frontend Patterns
- **Protected Routes**: JWT verification with automatic redirects
- **Role-based UI**: Component rendering based on user roles
- **API Client Pattern**: Centralized Axios configuration with interceptors
- **Form Handling**: Consistent validation and error display patterns

### Database Patterns
- **Referential Integrity**: ObjectId references with populate for related data
- **Indexing Strategy**: Optimized indexes on frequently queried fields
- **Virtual Properties**: Computed fields for display purposes
- **Middleware Hooks**: Pre/post save operations for business logic

## Development Guidelines

### Environment Configuration
- Backend runs on port 5174, frontend on 5173 with proxy configuration
- Use `.env` files for secrets - NEVER commit actual values
- MongoDB connection can be local or Atlas cloud
- Security keys should be generated using the `setup.js` script

### File Upload & Security
- Documents are uploaded to `/backend/uploads` directory
- Files are encrypted before storage with unique IV per file
- QR codes are generated as data URLs and cached in database
- Document access requires proper authentication and authorization

### QR Code Implementation
- **User QR**: Links to user profile for multi-vehicle access
- **Vehicle QR**: Links to specific vehicle and its documents
- QR data is JSON with type identification (`userId` or `vehicleId`)
- QR scanning creates audit logs for compliance tracking

### Payment Integration
- Demo payment system included for development
- Payment status tracking with gateway transaction IDs
- Support for registration fees, modifications, and renewals
- Payment history linked to user accounts

### Testing Approach
- API endpoints should be tested with proper authentication headers
- QR scanning functionality requires valid JWT tokens
- Document upload/encryption requires proper file handling tests
- Role-based access should be verified for all protected endpoints

## Common Development Tasks

### Adding New Document Types
1. Update `Vehicle.js` model document schema enum
2. Modify upload routes to handle new document type
3. Update frontend forms and validation
4. Add appropriate UI components for new document display

### Implementing New User Roles
1. Add role to `User.js` enum
2. Update authentication middleware for role checks
3. Create role-specific dashboard components
4. Add role-based route protection

### Enhancing QR Functionality
1. QR data structure is defined in `documents.js` route handlers
2. QR generation uses `qrcode` library with JSON data encoding
3. Audit logging in `AuditLog.js` tracks all QR scanning activities
4. Frontend QR scanner uses device camera with proper permissions

### Database Operations
- Vehicle ownership transfers require updating `ownerId` and clearing driver assignments
- Document expiry tracking uses `documentExpiry` object with date fields
- Location tracking updates require owner or driver permissions
- Audit logs should be created for all sensitive data access

## Performance Considerations

### Database Optimization
- Indexes are configured on frequently queried fields (email, vehicleNo, QR codes)
- Use pagination for large datasets (mongoose-paginate-v2 available)
- Populate operations should be selective to avoid over-fetching

### File Storage
- Consider cloud storage (AWS S3, etc.) for production deployments
- Implement file compression for document uploads
- Use CDN for serving static assets in production

### Frontend Optimization
- Vite provides automatic code splitting and hot reload
- Images and assets are optimized during build process
- Consider implementing lazy loading for document previews

## Deployment Notes

- Backend designed for Render.com deployment (see `DEPLOYMENT.md`)
- Frontend optimized for Netlify with Vite build process
- MongoDB Atlas recommended for production database
- Environment variables must be configured in deployment platforms
- CORS settings need adjustment for production domains

## Security Checklist

- [ ] All API endpoints use proper authentication middleware
- [ ] File uploads validate file types and sizes
- [ ] Document access checks user permissions
- [ ] QR codes have expiration and rate limiting
- [ ] Audit logs capture all sensitive operations
- [ ] Environment variables are properly secured
- [ ] Production builds remove debug information
- [ ] HTTPS enforced in production environments
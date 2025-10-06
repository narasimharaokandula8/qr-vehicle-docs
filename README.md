# 🚗 VehicleDoc Pro - QR-Based Vehicle Document Management System

> **A secure, modern solution for digital vehicle document management and verification using QR codes**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.4-green.svg)](https://mongodb.com)
[![React](https://img.shields.io/badge/react-%3E%3D18.0.0-blue.svg)](https://reactjs.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

VehicleDoc Pro is a comprehensive digital platform that revolutionizes vehicle document management by providing:

- **Digital Document Storage**: Secure cloud-based storage for all vehicle documents
- **QR Code Generation**: Unique QR codes for instant document verification
- **Multi-User Support**: Different access levels for vehicle owners, drivers, and police officers
- **Real-time Verification**: Instant document access for traffic police during checks
- **Multi-Vehicle Management**: Support for multiple vehicles under single account
- **End-to-End Encryption**: Military-grade security for document protection

## ✨ Features

### 🔐 For Vehicle Owners/Drivers
- ✅ **Secure Registration & Authentication** with OTP support
- ✅ **Multi-Vehicle Management** under single account
- ✅ **Document Upload & Encryption** (RC, Insurance, PUC, Fitness Certificate)
- ✅ **QR Code Generation** (Single QR for all vehicles or per-vehicle QR)
- ✅ **Payment Integration** for registration and modifications
- ✅ **Expiry Notifications** for document renewals
- ✅ **Mobile-First Design** for easy access on smartphones

### 👮 For Police Officers
- ✅ **QR Code Scanning** for instant document verification
- ✅ **Read-Only Access** with audit trail logging
- ✅ **Location-Based Verification** with GPS tracking
- ✅ **Offline Capability** for areas with poor connectivity
- ✅ **Fraud Detection** with suspicious activity alerts
- ✅ **Real-time Statistics** and reporting dashboard

### 🏛️ For Government Authorities
- ✅ **Centralized Dashboard** for compliance monitoring
- ✅ **Analytics & Reporting** for policy decisions
- ✅ **Audit Trail Management** for security compliance
- ✅ **Integration APIs** for RTO/Transport Authority databases

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **FontAwesome & React Icons** - Beautiful icons
- **CSS3 with Custom Properties** - Glassmorphism design system

### Backend
- **Node.js 16+** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **QRCode** - QR code generation library
- **Crypto-js** - Encryption utilities

### Security & DevOps
- **File Encryption** - AES-256-GCM encryption
- **Rate Limiting** - Request throttling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Audit Logging** - Comprehensive activity tracking
- **Git** - Version control

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (Vite) - Glassmorphism UI                      │
│  ├── Pages: Home, Login, Dashboard, QRScanner                  │
│  ├── Components: Reusable UI components                        │
│  └── Utils: API client, Security helpers                       │
├─────────────────────────────────────────────────────────────────┤
│                        API Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Backend - RESTful API                              │
│  ├── Routes: Auth, Documents, QR, Payments                     │
│  ├── Middleware: Authentication, RBAC, Security                │
│  └── Utils: Encryption, QR Generation, Audit                   │
├─────────────────────────────────────────────────────────────────┤
│                        Data Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB Database                                               │
│  ├── Collections: Users, Vehicles, Payments, AuditLogs        │
│  ├── Indexes: Optimized queries for performance               │
│  └── Security: Encrypted document storage                      │
├─────────────────────────────────────────────────────────────────┤
│                       Security Layer                           │
└─────────────────────────────────────────────────────────────────┘
│  • End-to-end encryption                                       │
│  • JWT-based authentication                                    │
│  • Rate limiting & DDoS protection                            │
│  • Comprehensive audit logging                                 │
│  • Anti-screenshot measures                                    │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/narasimharaokandula8/qr-vehicle-docs.git
cd qr-vehicle-docs
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables
# Edit .env file with your settings:
# - MongoDB connection string
# - JWT secret key
# - File encryption key
# - Payment gateway credentials
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure frontend environment
# Edit .env file with API base URL
```

### 4. Database Setup
```bash
# Start MongoDB service
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# The application will create collections automatically
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Backend will run on http://localhost:5174
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

## 📱 Usage

### For Vehicle Owners

1. **Registration**
   - Visit the application homepage
   - Click "Sign Up" and complete registration
   - Verify your account via OTP

2. **Document Upload**
   - Navigate to "Upload Documents"
   - Upload required documents (RC, Insurance, PUC, Fitness)
   - Documents are automatically encrypted

3. **QR Code Generation**
   - Access your dashboard
   - Generate QR code for your profile or individual vehicles
   - Print or save QR code for use

4. **Vehicle Management**
   - Add multiple vehicles to your account
   - Assign drivers to specific vehicles
   - Set document expiry reminders

### For Police Officers

1. **Account Setup**
   - Register with "police" role
   - Complete verification process

2. **Document Verification**
   - Use QR scanner on mobile device
   - Scan vehicle owner's QR code
   - View documents in read-only mode
   - Log is automatically created

3. **Reporting**
   - Access verification history
   - Generate compliance reports
   - Flag suspicious activities

## 🔌 API Documentation

### Authentication Endpoints

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "role": "owner"
}
```

```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "owner"
  }
}
```

### Document Management

```http
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- vehicleNo: "MH12AB1234"
- rc: <file>
- insurance: <file>
- puc: <file>
- fitness: <file>
```

```http
GET /api/documents/:userId
Authorization: Bearer <token>

Response:
{
  "documents": [
    {
      "vehicleNo": "MH12AB1234",
      "documents": [...],
      "qrCode": "user:60d5ec49f5b7d12a3c8e9f0b:Ab3Cd4Ef5G"
    }
  ]
}
```

### QR Code Operations

```http
POST /api/scan-qr
Authorization: Bearer <token>
Content-Type: application/json

{
  "qrData": "{\"type\":\"user\",\"userId\":\"...\"}",
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777
  }
}
```

## 🔒 Security Features

### Document Security
- **AES-256-GCM Encryption** for all uploaded documents
- **Secure file storage** with encrypted filenames
- **Access control** with role-based permissions

### Authentication & Authorization
- **JWT-based authentication** with secure token handling
- **Multi-factor authentication** support
- **Account lockout** after failed attempts
- **Session management** with automatic timeout

### Privacy Protection
- **Screenshot prevention** on sensitive screens
- **Screen recording detection** and blocking
- **Audit trail** for all document access
- **Data anonymization** for privacy compliance

### Network Security
- **HTTPS enforcement** in production
- **CORS protection** with whitelist
- **Rate limiting** to prevent abuse
- **DDoS mitigation** strategies

## 📸 Screenshots

### Home Page - Glassmorphism Design
![Home Page](docs/screenshots/home.png)

### Dashboard - Multi-Vehicle Management
![Dashboard](docs/screenshots/dashboard.png)

### QR Scanner - Police Interface
![QR Scanner](docs/screenshots/qr-scanner.png)

### Document Upload - Secure File Handling
![Upload](docs/screenshots/upload.png)

## 🎨 Design System

The application uses a modern **Glassmorphism** design system with:

- **Frosted Glass Effects** with backdrop blur
- **Gradient Backgrounds** with smooth transitions  
- **Soft Shadows** and subtle borders
- **Modern Typography** with Inter font family
- **Responsive Grid System** for all screen sizes
- **Smooth Animations** and micro-interactions
- **Accessible Color Palette** with proper contrast ratios

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests  
cd frontend
npm test

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Production Environment Setup

1. **Environment Configuration**
```bash
# Production .env for backend
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://prod-cluster/vehicledoc
JWT_SECRET=your-super-secure-jwt-secret
FILE_ENCRYPTION_KEY=base64:your-32-byte-encryption-key
```

2. **Build Applications**
```bash
# Build frontend
cd frontend
npm run build

# Backend is ready for production
cd ../backend
npm start
```

3. **Deploy to Cloud**
   - **Frontend**: Deploy to Netlify, Vercel, or AWS S3
   - **Backend**: Deploy to Heroku, AWS EC2, or Digital Ocean
   - **Database**: Use MongoDB Atlas for managed database

### Docker Deployment

```dockerfile
# Dockerfile for backend
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```yml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/vehicledoc
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  
  mongo:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Coding Standards
- Use **ESLint** and **Prettier** for code formatting
- Follow **React Hooks** best practices
- Write **comprehensive tests** for new features
- Update **documentation** for API changes
- Use **semantic commit messages**

### Bug Reports
- Use the **issue template**
- Include **reproduction steps**
- Provide **environment details**
- Add **screenshots** if applicable

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Narasimha**
- GitHub: [@narasimharaokandula8](https://github.com/narasimharaokandula8)
- Email: narasimharaokandula8@gmail.com
- LinkedIn: [Narasimha Rao Kandula](https://linkedin.com/in/narasimharaokandula8)

## 🙏 Acknowledgments

- **React Team** for the amazing UI library
- **Express.js** for the robust backend framework
- **MongoDB** for flexible document storage
- **FontAwesome** for beautiful icons
- **Vite** for lightning-fast development experience

## 📞 Support

If you need help or have questions:

1. **Check** the [FAQ section](docs/FAQ.md)
2. **Search** existing [GitHub Issues](https://github.com/your-repo/issues)
3. **Create** a new issue with details
4. **Join** our [Discord community](https://discord.gg/your-invite)

---

<div align="center">
  <p><strong>Built with ❤️ for safer roads and digital governance</strong></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
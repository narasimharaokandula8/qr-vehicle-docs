#!/usr/bin/env node

/**
 * VehicleDoc Pro - Development Setup Script
 * Automated setup for development environment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const runCommand = (command, cwd = process.cwd()) => {
  try {
    log(`Running: ${command}`, 'cyan');
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Error running command: ${command}`, 'red');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
};

const checkPrerequisites = () => {
  log('🔍 Checking prerequisites...', 'yellow');
  
  const checks = [
    { cmd: 'node --version', name: 'Node.js' },
    { cmd: 'npm --version', name: 'npm' },
    { cmd: 'git --version', name: 'Git' }
  ];
  
  let allPassed = true;
  
  checks.forEach(({ cmd, name }) => {
    try {
      const version = execSync(cmd, { encoding: 'utf-8' }).trim();
      log(`✅ ${name}: ${version}`, 'green');
    } catch (error) {
      log(`❌ ${name}: Not installed or not in PATH`, 'red');
      allPassed = false;
    }
  });
  
  // Check MongoDB (optional for development with MongoDB Atlas)
  try {
    execSync('mongod --version', { encoding: 'utf-8' });
    log('✅ MongoDB: Available locally', 'green');
  } catch (error) {
    log('⚠️  MongoDB: Not available locally (you can use MongoDB Atlas)', 'yellow');
  }
  
  if (!allPassed) {
    log('\\n❌ Please install missing prerequisites before continuing.', 'red');
    process.exit(1);
  }
  
  log('✅ All prerequisites checked!', 'green');
  return true;
};

const setupBackend = () => {
  log('\\n🔧 Setting up backend...', 'yellow');
  
  const backendDir = path.join(__dirname, 'backend');
  
  if (!fs.existsSync(backendDir)) {
    log('❌ Backend directory not found!', 'red');
    return false;
  }
  
  // Install backend dependencies
  if (!runCommand('npm install', backendDir)) {
    log('❌ Failed to install backend dependencies', 'red');
    return false;
  }
  
  // Setup environment file
  const envExamplePath = path.join(backendDir, '.env.example');
  const envPath = path.join(backendDir, '.env');
  
  if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
    log('📄 Creating .env file from .env.example...', 'cyan');
    fs.copyFileSync(envExamplePath, envPath);
    log('⚠️  Please update the .env file with your configuration!', 'yellow');
  }
  
  log('✅ Backend setup complete!', 'green');
  return true;
};

const setupFrontend = () => {
  log('\\n⚡ Setting up frontend...', 'yellow');
  
  const frontendDir = path.join(__dirname, 'frontend');
  
  if (!fs.existsSync(frontendDir)) {
    log('❌ Frontend directory not found!', 'red');
    return false;
  }
  
  // Install frontend dependencies
  if (!runCommand('npm install', frontendDir)) {
    log('❌ Failed to install frontend dependencies', 'red');
    return false;
  }
  
  // Setup environment file
  const envExamplePath = path.join(frontendDir, '.env.example');
  const envPath = path.join(frontendDir, '.env');
  
  if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
    log('📄 Creating .env file from .env.example...', 'cyan');
    fs.copyFileSync(envExamplePath, envPath);
    log('⚠️  Please update the .env file with your configuration!', 'yellow');
  }
  
  log('✅ Frontend setup complete!', 'green');
  return true;
};

const createDirectories = () => {
  log('\\n📁 Creating required directories...', 'yellow');
  
  const dirs = [
    path.join(__dirname, 'backend', 'uploads'),
    path.join(__dirname, 'backend', 'logs'),
    path.join(__dirname, 'docs'),
    path.join(__dirname, 'docs', 'screenshots')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`✅ Created: ${dir}`, 'green');
    }
  });
  
  log('✅ Directory structure ready!', 'green');
};

const generateSecrets = () => {
  log('\\n🔐 Generating security keys...', 'yellow');
  
  const crypto = require('crypto');
  
  // Generate JWT secret
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  
  // Generate file encryption key
  const encryptionKey = crypto.randomBytes(32).toString('base64');
  
  const secrets = {
    JWT_SECRET: jwtSecret,
    FILE_ENCRYPTION_KEY: `base64:${encryptionKey}`
  };
  
  // Write to a temporary file for reference
  const secretsFile = path.join(__dirname, 'generated-secrets.txt');
  const secretsContent = `
VehicleDoc Pro - Generated Security Keys
Generated on: ${new Date().toISOString()}

IMPORTANT: Copy these values to your .env files and then DELETE this file!

Backend .env:
JWT_SECRET=${secrets.JWT_SECRET}
FILE_ENCRYPTION_KEY=${secrets.FILE_ENCRYPTION_KEY}

⚠️  SECURITY WARNING:
- Keep these secrets secure and never commit them to version control
- Use different secrets for production
- Delete this file after copying the values
`;
  
  fs.writeFileSync(secretsFile, secretsContent);
  
  log('✅ Security keys generated!', 'green');
  log(`📄 Keys saved to: ${secretsFile}`, 'cyan');
  log('⚠️  Copy the keys to your .env files and DELETE the secrets file!', 'yellow');
};

const displayNextSteps = () => {
  log('\\n🎉 Setup Complete!', 'green');
  log('\\nNext steps:', 'bright');
  log('1. Update .env files in both backend and frontend directories', 'yellow');
  log('2. Copy generated secrets from generated-secrets.txt to backend/.env', 'yellow');
  log('3. Configure your MongoDB connection in backend/.env', 'yellow');
  log('4. Delete the generated-secrets.txt file for security', 'yellow');
  
  log('\\n🚀 Start development servers:', 'bright');
  log('Backend:  cd backend && npm start', 'cyan');
  log('Frontend: cd frontend && npm run dev', 'cyan');
  
  log('\\n📚 Useful commands:', 'bright');
  log('npm run dev:all    - Start both servers concurrently', 'cyan');
  log('npm run test       - Run tests', 'cyan');
  log('npm run build      - Build for production', 'cyan');
  
  log('\\n🌟 Happy coding!', 'magenta');
};

// Main setup function
const main = async () => {
  log('🚗 VehicleDoc Pro - Development Setup', 'bright');
  log('=====================================', 'bright');
  
  try {
    checkPrerequisites();
    createDirectories();
    
    const backendSuccess = setupBackend();
    const frontendSuccess = setupFrontend();
    
    if (backendSuccess && frontendSuccess) {
      generateSecrets();
      displayNextSteps();
    } else {
      log('\\n❌ Setup failed! Please check the errors above.', 'red');
      process.exit(1);
    }
  } catch (error) {
    log(`\\n❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Run setup
if (require.main === module) {
  main();
}

module.exports = { main };
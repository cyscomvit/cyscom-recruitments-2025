// Firebase Environment Configuration
// This file should be excluded from version control in production
// Use environment variables or secure configuration management in production

// Production Firebase Configuration
// Note: In production, consider using environment variables or a secure config service
window.FIREBASE_ENV = {
  // Firebase configuration
  config: {
    apiKey: "AIzaSyDd4tqtajZcvTinZHUDXMWQIkBSeeO3lZ4",
    authDomain: "cyscom-recruitment-portal.firebaseapp.com",
    projectId: "cyscom-recruitment-portal",
    storageBucket: "cyscom-recruitment-portal.firebasestorage.app",
    messagingSenderId: "1093153228555",
    appId: "1:1093153228555:web:2a1b4b24187f571af3c40e",
    measurementId: "G-RC5ZE3GEPM"
  },
  
  // Security settings
  security: {
    enableRateLimiting: true,
    maxSubmissionsPerHour: 5,
    enableSuspiciousActivityDetection: true,
    logSecurityEvents: true
  },
  

  environment: 'development', // 'development', 'staging', 'production'
  debug: true
};



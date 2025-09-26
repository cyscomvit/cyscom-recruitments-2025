// Firebase Public Environment Configuration
window.FIREBASE_ENV = {
  config: {
    apiKey: "XXXX",
    authDomain: "XXXX",
    projectId: "XXXX",
    storageBucket: "XXXX",
    messagingSenderId: "XXXX",
    appId: "XXXX",
    measurementId: "XXXXX"
  },
  
  // Security settings
  security: {
    enableRateLimiting: true,
    maxSubmissionsPerHour: 5,
    enableSuspiciousActivityDetection: true,
    logSecurityEvents: true
  },
  

  environment: 'development', 
  debug: true
};



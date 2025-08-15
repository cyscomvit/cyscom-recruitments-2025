
(async function() {
  

  if (typeof window.FIREBASE_ENV === 'undefined') {
    console.error('Environment configuration not found.');
    return;
  }

  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
    const { getFirestore, collection, addDoc, doc, updateDoc, setDoc, getDoc, getDocs, query, where, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
    const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
    
    const app = initializeApp(window.FIREBASE_ENV.config);
    const db = getFirestore(app);
    const auth = getAuth(app);
    
    window.firebase = { 
      app, 
      db, 
      auth,
      collection, 
      addDoc,
      doc,
      updateDoc,
      setDoc,
      getDoc,
      getDocs,
      query,
      where,
      serverTimestamp,

      GoogleAuthProvider,
      signInWithPopup,
      signOut,
      onAuthStateChanged,

      security: window.FIREBASE_ENV.security,
      environment: window.FIREBASE_ENV.environment
    };
    

    window.firebaseLoaded = true;
    

    window.dispatchEvent(new CustomEvent('firebaseLoaded'));
    
  } catch (error) {
    console.error('initialization failed:', error);
    window.firebaseLoaded = false;
  }
})();


window.validationRules = {
  firstName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    required: true
  },
  lastName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    required: true
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254,
    required: true
  },
  phone: {
    pattern: /^[+]?[\d\s()-]{10,15}$/,
    required: true
  },
  regNumber: {
    pattern: /^[0-9]{2}[A-Z]{3}[0-9]{4}$/,
    required: true
  },
  skills: {
    minLength: 10,
    maxLength: 1000,
    required: true
  },
  motivation: {
    minLength: 20,
    maxLength: 2000,
    required: true
  },
  contribution: {
    minLength: 0,
    maxLength: 2000,
    required: false
  }
};


window.sanitize = {
  // Remove HTML tags and escape special characters
  html: (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // Remove potentially dangerous characters
  strict: (str) => {
    return str.replace(/[<>\"'%;()&+]/g, '');
  },

  // Clean whitespace
  whitespace: (str) => {
    return str.trim().replace(/\s+/g, ' ');
  }
};

// Rate limiting configuration (make available globally)
window.rateLimiting = {
  submissionCooldown: 30000, // 30 seconds between submissions
  maxAttemptsPerHour: 5,     // Maximum 5 attempts per hour
  blockedDuration: 3600000   // 1 hour block after exceeding limit
};

// Security headers and CSP (make available globally)
window.securityConfig = {
  // Content Security Policy
  csp: {
    'default-src': "'self'",
    'script-src': "'self' https://www.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
    'style-src': "'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    'img-src': "'self' data: https:",
    'connect-src': "'self' https://*.googleapis.com https://*.firebaseio.com",
    'font-src': "'self' https://cdn.jsdelivr.net",
    'object-src': "'none'",
    'media-src': "'self'",
    'frame-src': "'none'"
  },

  // Additional security headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
};

// Department configuration with security validation (make available globally)
window.departments = {
  'technical': {
    name: 'Technical',
    description: 'Hardware, software security, and technical implementations',
    icon: '🔧',
    validSkills: [
      'cybersecurity', 'networking', 'linux', 'windows', 'penetration testing',
      'vulnerability assessment', 'incident response', 'forensics', 'malware analysis',
      'security tools', 'firewalls', 'ids', 'ips', 'siem'
    ]
  },
  'design': {
    name: 'Design',
    description: 'UI/UX design, graphics, and visual communications',
    icon: '🎨',
    validSkills: [
      'figma', 'adobe creative suite', 'photoshop', 'illustrator', 'sketch',
      'ui design', 'ux design', 'graphic design', 'branding', 'typography',
      'web design', 'mobile design', 'prototyping'
    ]
  },
  'dev': {
    name: 'Development',
    description: 'Web development, mobile apps, and software solutions',
    icon: '💻',
    validSkills: [
      'javascript', 'python', 'java', 'c++', 'html', 'css', 'react', 'node.js',
      'vue.js', 'angular', 'mongodb', 'mysql', 'git', 'docker', 'aws',
      'mobile development', 'web development', 'api development'
    ]
  },
  'social-media': {
    name: 'Social Media',
    description: 'Social media management and digital marketing',
    icon: '📱',
    validSkills: [
      'social media marketing', 'content creation', 'instagram', 'twitter',
      'linkedin', 'facebook', 'tiktok', 'canva', 'video editing',
      'analytics', 'engagement', 'brand management', 'campaigns'
    ]
  },
  'content': {
    name: 'Content',
    description: 'Content creation, writing, and documentation',
    icon: '✍️',
    validSkills: [
      'technical writing', 'content creation', 'blogging', 'copywriting',
      'editing', 'proofreading', 'research', 'seo', 'documentation',
      'storytelling', 'journalism', 'creative writing'
    ]
  },
  'event-management': {
    name: 'Event Management',
    description: 'Event planning, coordination, and execution',
    icon: '🎪',
    validSkills: [
      'event planning', 'project management', 'coordination', 'logistics',
      'vendor management', 'budgeting', 'marketing', 'communication',
      'team leadership', 'problem solving', 'time management'
    ]
  }
};

// Error messages (make available globally)
window.errorMessages = {
  validation: {
    firstName: 'First name must be 2-50 characters and contain only letters',
    lastName: 'Last name must be 2-50 characters and contain only letters',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    regNumber: 'Please enter a valid VIT registration number (e.g., 22BCE1234)',
    department: 'Please select a department',
    skills: 'Please describe your skills (10-1000 characters)',
    motivation: 'Please explain your motivation (20-2000 characters)',
    contribution: 'Use your creativity'
  },
  security: {
    rateLimited: 'Too many submission attempts. Please wait before trying again.',
    suspiciousActivity: 'Suspicious activity detected. Please contact support.',
    networkError: 'Network error. Please check your connection and try again.',
    serverError: 'Server error. Please try again later.'
  }
};

// Logging configuration for security monitoring (make available globally)
window.loggingConfig = {
  levels: {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    SECURITY: 'security'
  },
  events: {
    FORM_SUBMIT: 'form_submit',
    VALIDATION_ERROR: 'validation_error',
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
    SUSPICIOUS_ACTIVITY: 'suspicious_activity'
  }
};

// React Components Integration
// This file contains React components that enhance the existing HTML structure

const { useState, useEffect, useRef, useCallback } = React;

// Enhanced Navigation Component
const ReactNavigation = () => {
    const [activeSection, setActiveSection] = useState('page1');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
            
            // Update active section based on scroll position
            const sections = ['page1', 'moto', 'page2', 'page4', 'impact'];
            const currentSection = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            
            if (currentSection) {
                setActiveSection(currentSection);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return React.createElement('div', {
        className: `nav-overlay ${isScrolled ? 'scrolled' : ''}`,
        style: {
            position: 'fixed',
            top: 0,
            right: '2rem',
            zIndex: 1000,
            display: 'flex',
            gap: '0.5rem',
            padding: '1rem',
            background: isScrolled ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
            backdropFilter: isScrolled ? 'blur(10px)' : 'none'
        }
    }, [
        React.createElement('div', {
            key: 'nav-indicator',
            style: {
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
            }
        }, [
            React.createElement('span', {
                key: 'current-section',
                style: {
                    color: '#00BFFF',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }
            }, activeSection === 'page1' ? 'Home' : 
               activeSection === 'moto' ? 'About' :
               activeSection === 'page2' ? 'Departments' :
               activeSection === 'page4' ? 'Apply' : 'Contact'),
            
            React.createElement('div', {
                key: 'progress-dots',
                style: {
                    display: 'flex',
                    gap: '0.3rem'
                }
            }, ['page1', 'moto', 'page2', 'page4', 'impact'].map(section => 
                React.createElement('div', {
                    key: section,
                    style: {
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: activeSection === section ? '#00BFFF' : 'rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    },
                    onClick: () => {
                        const element = document.getElementById(section);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                })
            ))
        ])
    ]);
};

// Enhanced Recruitment Form Component
const ReactRecruitmentForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        regNumber: '',
        year: '',
        department: '',
        skills: '',
        motivation: '',
        contribution: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [validationState, setValidationState] = useState({});

    // Real-time validation
    const validateField = useCallback((name, value) => {
        let error = '';
        
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value || value.length < 2) {
                    error = 'Must be at least 2 characters';
                } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                    error = 'Only letters, spaces, hyphens and apostrophes allowed';
                }
                break;
            case 'email':
                if (!value) {
                    error = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'phone':
                if (!value) {
                    error = 'Phone number is required';
                } else if (!/^[+]?[\d\s()-]{10,15}$/.test(value)) {
                    error = 'Please enter a valid phone number';
                }
                break;
            case 'regNumber':
                if (!value) {
                    error = 'Registration number is required';
                } else if (!/^[0-9]{2}[A-Z]{3}[0-9]{4}$/i.test(value)) {
                    error = 'Please enter valid VIT reg number (e.g., 22BCE1234)';
                }
                break;
            case 'skills':
                if (!value || value.length < 10) {
                    error = 'Please provide at least 10 characters';
                }
                break;
            case 'motivation':
                if (!value || value.length < 20) {
                    error = 'Please provide at least 20 characters';
                }
                break;
        }
        
        return error;
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Real-time validation
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
        
        // Set validation state for visual feedback
        setValidationState(prev => ({
            ...prev,
            [name]: {
                isValid: !error && value.length > 0,
                isInvalid: !!error,
                isTouched: true
            }
        }));
    }, [validateField]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (['firstName', 'lastName', 'email', 'phone', 'regNumber', 'year', 'department', 'skills', 'motivation'].includes(key)) {
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        try {
            // Add metadata
            const applicationData = {
                ...formData,
                submissionTime: new Date().toISOString(),
                timestamp: window.firebase?.serverTimestamp ? window.firebase.serverTimestamp() : new Date(),
                applicationId: 'APP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                source: 'react-enhanced'
            };
            
            // Submit to Firebase or fallback
            if (window.firebase && window.firebase.db) {
                await window.firebase.addDoc(
                    window.firebase.collection(window.firebase.db, 'applications'),
                    applicationData
                );
            } else {
                console.log('React form submission:', applicationData);
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            }
            
            setSubmitStatus('success');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                regNumber: '',
                year: '',
                department: '',
                skills: '',
                motivation: '',
                contribution: ''
            });
            setValidationState({});
            setErrors({});
            
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return React.createElement('div', {
        className: 'react-form-enhancement'
    }, [
        // Form validation indicator
        React.createElement('div', {
            key: 'validation-indicator',
            style: {
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
                gap: '0.5rem'
            }
        }, [
            React.createElement('div', {
                key: 'progress',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '0.5rem 1rem',
                    borderRadius: '25px',
                    backdropFilter: 'blur(10px)'
                }
            }, [
                React.createElement('span', {
                    key: 'progress-text',
                    style: {
                        color: '#FFFFFF',
                        fontSize: '0.9rem'
                    }
                }, 'Form Progress: '),
                React.createElement('div', {
                    key: 'progress-bar',
                    style: {
                        width: '100px',
                        height: '4px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }
                }, [
                    React.createElement('div', {
                        key: 'progress-fill',
                        style: {
                            width: `${Math.min(100, (Object.keys(validationState).filter(key => validationState[key].isValid).length / 9) * 100)}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #00BFFF, #0484ac)',
                            transition: 'width 0.3s ease'
                        }
                    })
                ])
            ])
        ]),
        
        // Field validation feedback
        Object.keys(formData).length > 0 && React.createElement('div', {
            key: 'field-status',
            style: {
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
            }
        }, ['firstName', 'lastName', 'email', 'phone', 'regNumber', 'department', 'skills', 'motivation'].map(field => {
            const state = validationState[field];
            if (!state || !state.isTouched) return null;
            
            return React.createElement('div', {
                key: field,
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '15px',
                    background: state.isValid ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                    border: `1px solid ${state.isValid ? '#2ecc71' : '#e74c3c'}`
                }
            }, [
                React.createElement('i', {
                    key: 'icon',
                    className: state.isValid ? 'ri-check-line' : 'ri-close-line',
                    style: {
                        fontSize: '0.8rem',
                        color: state.isValid ? '#2ecc71' : '#e74c3c'
                    }
                }),
                React.createElement('span', {
                    key: 'label',
                    style: {
                        fontSize: '0.7rem',
                        color: '#FFFFFF',
                        textTransform: 'capitalize'
                    }
                }, field.replace(/([A-Z])/g, ' $1').trim())
            ]);
        })),
        
        // Submit status
        submitStatus && React.createElement('div', {
            key: 'submit-status',
            style: {
                margin: '1rem 0',
                padding: '1rem',
                borderRadius: '10px',
                textAlign: 'center',
                background: submitStatus === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                border: `1px solid ${submitStatus === 'success' ? '#2ecc71' : '#e74c3c'}`,
                color: '#FFFFFF'
            }
        }, [
            React.createElement('div', {
                key: 'status-icon',
                style: { fontSize: '2rem', marginBottom: '0.5rem' }
            }, submitStatus === 'success' ? '✅' : '❌'),
            React.createElement('h4', {
                key: 'status-title'
            }, submitStatus === 'success' ? 'Application Submitted!' : 'Submission Failed'),
            React.createElement('p', {
                key: 'status-message'
            }, submitStatus === 'success' ? 
                'Thank you! We\'ll review your application soon.' : 
                'Please try again later.')
        ])
    ]);
};

// Interactive Statistics Component
const ReactStatistics = () => {
    const [stats, setStats] = useState({
        totalApplications: 0,
        departmentStats: {},
        isLoading: true
    });

    useEffect(() => {
        // Simulate loading stats (in real app, fetch from Firebase)
        setTimeout(() => {
            setStats({
                totalApplications: 247,
                departmentStats: {
                    'technical': 45,
                    'design': 38,
                    'dev': 52,
                    'social-media': 31,
                    'content': 41,
                    'event-management': 40
                },
                isLoading: false
            });
        }, 1500);
    }, []);

    if (stats.isLoading) {
        return React.createElement('div', {
            style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                color: '#00BFFF'
            }
        }, [
            React.createElement('i', {
                key: 'loading-icon',
                className: 'ri-loader-4-line',
                style: {
                    fontSize: '1.5rem',
                    animation: 'spin 1s linear infinite',
                    marginRight: '0.5rem'
                }
            }),
            React.createElement('span', {
                key: 'loading-text'
            }, 'Loading statistics...')
        ]);
    }

    return React.createElement('div', {
        className: 'react-stats',
        style: {
            position: 'fixed',
            bottom: '2rem',
            left: '2rem',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '1rem',
            border: '1px solid rgba(0, 191, 255, 0.3)',
            zIndex: 1000,
            minWidth: '200px'
        }
    }, [
        React.createElement('h4', {
            key: 'title',
            style: {
                color: '#00BFFF',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
            }
        }, 'Live Statistics'),
        
        React.createElement('div', {
            key: 'total',
            style: {
                color: '#FFFFFF',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
            }
        }, `${stats.totalApplications} Applications`),
        
        React.createElement('div', {
            key: 'departments',
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem'
            }
        }, Object.entries(stats.departmentStats).map(([dept, count]) => 
            React.createElement('div', {
                key: dept,
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: '#FFFFFF'
                }
            }, [
                React.createElement('span', {
                    key: 'dept-name',
                    style: { textTransform: 'capitalize' }
                }, dept.replace('-', ' ')),
                React.createElement('span', {
                    key: 'dept-count',
                    style: { color: '#00BFFF', fontWeight: 'bold' }
                }, count)
            ])
        ))
    ]);
};

// Enhanced Slider Component
const ReactSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const totalSlides = 6;

    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % totalSlides);
        }, 4000);
        
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    return React.createElement('div', {
        className: 'react-slider-enhancement',
        style: {
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            padding: '0.8rem 1.5rem',
            border: '1px solid rgba(0, 191, 255, 0.3)'
        }
    }, [
        React.createElement('button', {
            key: 'auto-play',
            onClick: () => setIsAutoPlaying(!isAutoPlaying),
            style: {
                background: 'none',
                border: 'none',
                color: isAutoPlaying ? '#00BFFF' : '#FFFFFF',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'color 0.3s ease'
            }
        }, React.createElement('i', {
            className: isAutoPlaying ? 'ri-pause-fill' : 'ri-play-fill'
        })),
        
        React.createElement('div', {
            key: 'slide-indicator',
            style: {
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
            }
        }, [
            React.createElement('span', {
                key: 'current',
                style: {
                    color: '#FFFFFF',
                    fontSize: '0.9rem'
                }
            }, `${currentSlide + 1} / ${totalSlides}`),
            
            React.createElement('div', {
                key: 'progress',
                style: {
                    width: '60px',
                    height: '3px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '1.5px',
                    overflow: 'hidden'
                }
            }, [
                React.createElement('div', {
                    key: 'progress-fill',
                    style: {
                        width: `${((currentSlide + 1) / totalSlides) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #00BFFF, #0484ac)',
                        transition: 'width 0.3s ease'
                    }
                })
            ])
        ])
    ]);
};

// Initialize React components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Mount React components to enhance existing sections
    
    // Enhanced Navigation
    const navContainer = document.createElement('div');
    navContainer.id = 'react-nav-enhancement';
    document.body.appendChild(navContainer);
    ReactDOM.render(React.createElement(ReactNavigation), navContainer);
    
    // Enhanced Form (mount inside existing form container)
    const formContainer = document.getElementById('recruitment-form-container');
    if (formContainer) {
        const reactFormDiv = document.createElement('div');
        reactFormDiv.id = 'react-form-enhancement';
        formContainer.insertBefore(reactFormDiv, formContainer.firstChild);
        ReactDOM.render(React.createElement(ReactRecruitmentForm), reactFormDiv);
        
        // Enhance existing form with React data binding
        const existingForm = document.getElementById('recruitment-form');
        if (existingForm) {
            const inputs = existingForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    // Trigger React component updates via custom events
                    window.dispatchEvent(new CustomEvent('formFieldUpdate', {
                        detail: { name: e.target.name, value: e.target.value }
                    }));
                });
            });
        }
    }
    
    // Statistics component
    const statsContainer = document.createElement('div');
    statsContainer.id = 'react-stats';
    document.body.appendChild(statsContainer);
    ReactDOM.render(React.createElement(ReactStatistics), statsContainer);
    
    // Enhanced Slider (mount inside page2)
    const page2 = document.getElementById('page2');
    if (page2) {
        const sliderEnhancement = document.createElement('div');
        sliderEnhancement.id = 'react-slider-enhancement';
        page2.style.position = 'relative';
        page2.appendChild(sliderEnhancement);
        ReactDOM.render(React.createElement(ReactSlider), sliderEnhancement);
    }
});

// Add CSS for React enhancements
const reactStyles = document.createElement('style');
reactStyles.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .react-form-enhancement {
        margin-bottom: 1rem;
    }
    
    .nav-overlay {
        animation: fadeInDown 0.5s ease;
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .react-stats {
        animation: fadeInUp 0.5s ease 1s both;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .react-slider-enhancement {
        animation: fadeInRight 0.5s ease 1.5s both;
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(reactStyles);

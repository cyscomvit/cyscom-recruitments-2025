// React Hooks and Context Integration
// This file provides React hooks that integrate with the existing vanilla JS functionality

const { useState, useEffect, useContext, createContext, useCallback, useMemo } = React;

// Global App Context
const AppContext = createContext();

// App Provider Component
const AppProvider = ({ children }) => {
    const [appState, setAppState] = useState({
        currentPage: 'page1',
        formData: {},
        isLoading: false,
        notifications: [],
        theme: 'dark',
        animations: {
            navbar: false,
            video: false,
            cursor: false
        }
    });

    const updateAppState = useCallback((updates) => {
        setAppState(prev => ({
            ...prev,
            ...updates
        }));
    }, []);

    const addNotification = useCallback((notification) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };
        
        setAppState(prev => ({
            ...prev,
            notifications: [...prev.notifications, newNotification]
        }));

        // Auto remove after 5 seconds
        setTimeout(() => {
            setAppState(prev => ({
                ...prev,
                notifications: prev.notifications.filter(n => n.id !== id)
            }));
        }, 5000);
    }, []);

    const contextValue = useMemo(() => ({
        appState,
        updateAppState,
        addNotification
    }), [appState, updateAppState, addNotification]);

    return React.createElement(AppContext.Provider, {
        value: contextValue
    }, children);
};

// Custom Hooks
const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};

// Hook for scroll detection
const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('up');

    useEffect(() => {
        let lastScrollY = window.pageYOffset;

        const updateScrollPosition = () => {
            const scrollY = window.pageYOffset;
            setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
            setScrollPosition(scrollY);
            lastScrollY = scrollY;
        };

        window.addEventListener('scroll', updateScrollPosition);
        return () => window.removeEventListener('scroll', updateScrollPosition);
    }, []);

    return { scrollPosition, scrollDirection };
};

// Hook for intersection observer
const useIntersectionObserver = (elementId, options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);

    useEffect(() => {
        const element = document.getElementById(elementId);
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
            if (entry.isIntersecting && !hasBeenVisible) {
                setHasBeenVisible(true);
            }
        }, {
            threshold: 0.3,
            ...options
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, [elementId, hasBeenVisible, options]);

    return { isVisible, hasBeenVisible };
};

// Enhanced React Components with Hooks

// Navigation Enhancement with Context
const ReactNavEnhanced = () => {
    const { appState, updateAppState } = useAppContext();
    const { scrollPosition, scrollDirection } = useScrollPosition();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const pages = [
        { id: 'page1', name: 'Home', icon: 'ri-home-line' },
        { id: 'moto', name: 'About', icon: 'ri-information-line' },
        { id: 'page2', name: 'Departments', icon: 'ri-team-line' },
        { id: 'page4', name: 'Apply', icon: 'ri-file-text-line' },
        { id: 'page5', name: 'Contact', icon: 'ri-phone-line' }
    ];

    const navigateTo = useCallback((pageId) => {
        const element = document.getElementById(pageId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateAppState({ currentPage: pageId });
            setIsMenuOpen(false);
        }
    }, [updateAppState]);

    const isHidden = scrollDirection === 'down' && scrollPosition > 100;

    return React.createElement('nav', {
        className: 'react-nav-enhanced',
        style: {
            position: 'fixed',
            top: isHidden ? '-100px' : '20px',
            right: '20px',
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            padding: '0.5rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(0, 191, 255, 0.3)'
        }
    }, [
        React.createElement('button', {
            key: 'menu-toggle',
            onClick: () => setIsMenuOpen(!isMenuOpen),
            style: {
                background: 'none',
                border: 'none',
                color: '#00BFFF',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
            }
        }, React.createElement('i', {
            className: isMenuOpen ? 'ri-close-line' : 'ri-menu-line'
        })),

        isMenuOpen && React.createElement('div', {
            key: 'menu-items',
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginTop: '0.5rem',
                animation: 'slideIn 0.3s ease'
            }
        }, pages.map(page => 
            React.createElement('button', {
                key: page.id,
                onClick: () => navigateTo(page.id),
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: appState.currentPage === page.id ? 'rgba(0, 191, 255, 0.2)' : 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '0.5rem 1rem',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem'
                }
            }, [
                React.createElement('i', {
                    key: 'icon',
                    className: page.icon
                }),
                React.createElement('span', {
                    key: 'name'
                }, page.name)
            ])
        ))
    ]);
};

// Real-time Form Validation Component
const ReactFormValidator = () => {
    const { addNotification } = useAppContext();
    const [validationResults, setValidationResults] = useState({});

    useEffect(() => {
        const handleFormUpdate = (event) => {
            const { name, value } = event.detail;
            
            // Perform validation
            let isValid = false;
            let message = '';

            switch (name) {
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    message = isValid ? 'Valid email address' : 'Please enter a valid email';
                    break;
                case 'regNumber':
                    isValid = /^[0-9]{2}[A-Z]{3}[0-9]{4}$/i.test(value);
                    message = isValid ? 'Valid registration number' : 'Format: 22BCE1234';
                    break;
                case 'phone':
                    isValid = /^[+]?[\d\s()-]{10,15}$/.test(value);
                    message = isValid ? 'Valid phone number' : 'Please enter a valid phone number';
                    break;
                default:
                    isValid = value.length > 0;
                    message = isValid ? 'Field completed' : 'This field is required';
            }

            setValidationResults(prev => ({
                ...prev,
                [name]: { isValid, message, value }
            }));

            // Show validation notification for important fields
            if (['email', 'regNumber'].includes(name) && value.length > 0) {
                addNotification({
                    type: isValid ? 'success' : 'error',
                    title: `${name.charAt(0).toUpperCase() + name.slice(1)} Validation`,
                    message
                });
            }
        };

        window.addEventListener('formFieldUpdate', handleFormUpdate);
        return () => window.removeEventListener('formFieldUpdate', handleFormUpdate);
    }, [addNotification]);

    const completedFields = Object.keys(validationResults).filter(key => validationResults[key].isValid).length;
    const totalFields = Object.keys(validationResults).length;

    if (totalFields === 0) return null;

    return React.createElement('div', {
        style: {
            position: 'fixed',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '1rem',
            border: '1px solid rgba(0, 191, 255, 0.3)',
            zIndex: 999,
            minWidth: '200px'
        }
    }, [
        React.createElement('h4', {
            key: 'title',
            style: {
                color: '#00BFFF',
                marginBottom: '1rem',
                fontSize: '0.9rem'
            }
        }, 'Form Validation'),

        React.createElement('div', {
            key: 'progress',
            style: {
                marginBottom: '1rem'
            }
        }, [
            React.createElement('div', {
                key: 'progress-text',
                style: {
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    marginBottom: '0.5rem'
                }
            }, `${completedFields}/${totalFields} fields valid`),

            React.createElement('div', {
                key: 'progress-bar',
                style: {
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }
            }, [
                React.createElement('div', {
                    key: 'progress-fill',
                    style: {
                        width: `${totalFields > 0 ? (completedFields / totalFields) * 100 : 0}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #00BFFF, #2ecc71)',
                        transition: 'width 0.5s ease'
                    }
                })
            ])
        ]),

        React.createElement('div', {
            key: 'validation-list',
            style: {
                maxHeight: '200px',
                overflowY: 'auto'
            }
        }, Object.entries(validationResults).map(([field, result]) =>
            React.createElement('div', {
                key: field,
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    padding: '0.3rem',
                    borderRadius: '8px',
                    background: result.isValid ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'
                }
            }, [
                React.createElement('i', {
                    key: 'status-icon',
                    className: result.isValid ? 'ri-check-line' : 'ri-close-line',
                    style: {
                        color: result.isValid ? '#2ecc71' : '#e74c3c',
                        fontSize: '0.8rem'
                    }
                }),
                React.createElement('span', {
                    key: 'field-name',
                    style: {
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        textTransform: 'capitalize'
                    }
                }, field.replace(/([A-Z])/g, ' $1').trim())
            ])
        ))
    ]);
};

// Notification System
const ReactNotifications = () => {
    const { appState } = useAppContext();

    if (!appState.notifications.length) return null;

    return React.createElement('div', {
        style: {
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }
    }, appState.notifications.map(notification =>
        React.createElement('div', {
            key: notification.id,
            style: {
                background: notification.type === 'success' ? 'rgba(46, 204, 113, 0.9)' : 'rgba(231, 76, 60, 0.9)',
                color: '#FFFFFF',
                padding: '1rem',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${notification.type === 'success' ? '#2ecc71' : '#e74c3c'}`,
                minWidth: '250px',
                animation: 'slideInLeft 0.3s ease'
            }
        }, [
            React.createElement('div', {
                key: 'title',
                style: {
                    fontWeight: 'bold',
                    marginBottom: '0.3rem'
                }
            }, notification.title),
            React.createElement('div', {
                key: 'message',
                style: {
                    fontSize: '0.9rem',
                    opacity: 0.9
                }
            }, notification.message)
        ])
    ));
};

// Section Animation Trigger
const ReactSectionAnimations = () => {
    const page1Visible = useIntersectionObserver('page1');
    const page2Visible = useIntersectionObserver('page2');
    const page4Visible = useIntersectionObserver('page4');
    
    useEffect(() => {
        if (page1Visible.hasBeenVisible) {
            console.log('Page 1 animated');
        }
        if (page2Visible.hasBeenVisible) {
            console.log('Page 2 animated');
        }
        if (page4Visible.hasBeenVisible) {
            console.log('Page 4 animated');
        }
    }, [page1Visible.hasBeenVisible, page2Visible.hasBeenVisible, page4Visible.hasBeenVisible]);

    return null; // This component doesn't render anything
};

// Initialize Enhanced React App
const ReactEnhancedApp = () => {
    return React.createElement(AppProvider, null, [
        React.createElement(ReactNavEnhanced, { key: 'nav' }),
        React.createElement(ReactFormValidator, { key: 'validator' }),
        React.createElement(ReactNotifications, { key: 'notifications' }),
        React.createElement(ReactSectionAnimations, { key: 'animations' })
    ]);
};

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    // Create app container
    const appContainer = document.createElement('div');
    appContainer.id = 'react-enhanced-app';
    document.body.appendChild(appContainer);
    
    // Render enhanced React app
    ReactDOM.render(React.createElement(ReactEnhancedApp), appContainer);

    // Add enhanced styles
    const enhancedStyles = document.createElement('style');
    enhancedStyles.textContent = `
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .react-nav-enhanced:hover {
            transform: scale(1.02);
        }

        .react-nav-enhanced button:hover {
            background: rgba(0, 191, 255, 0.3) !important;
            transform: translateX(2px);
        }
    `;
    document.head.appendChild(enhancedStyles);
});

// Export for external use
window.ReactComponents = {
    AppProvider,
    useAppContext,
    useScrollPosition,
    useIntersectionObserver,
    ReactNavEnhanced,
    ReactFormValidator,
    ReactNotifications
};

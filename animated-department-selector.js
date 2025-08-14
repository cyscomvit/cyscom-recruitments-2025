// Animated Department Selector with Scroll-Linked Animation
// Using React with CSS animations for better compatibility

const { useState, useEffect, useRef } = React;

// Department data with colors and descriptions
const departments = [
    {
        id: 'technical',
        name: 'Technical',
        description: 'CTFs, Ethical Hacking and more',
        color: '#2f86e9ff',
        icon: './Images/Tech.png',
        gradient: 'linear-gradient(135deg, #013066, #094488ff)'
    },
    {
        id: 'design',
        name: 'Design',
        description: 'UI/UX design and graphics',
        color: '#4ecdc4',
        icon: './Images/Design.png',
        gradient: 'linear-gradient(135deg, #094488ff, #0859b6ff)'
    },
    {
        id: 'dev',
        name: 'Development',
        description: 'Web development',
        color: '#141e36',
        icon: './Images/dEV.png',
        gradient: 'linear-gradient(135deg, #0859b6ff, #1f7ae2ff)'
    },
    {
        id: 'social-media',
        name: 'Social Media',
        description: 'Social media management and digital marketing',
        color: '#0484ac',
        icon: './Images/SM.png',
        gradient: 'linear-gradient(135deg, #1f7ae2ff, #4778d3ff)'
    },
    {
        id: 'content',
        name: 'Content',
        description: 'Content creation, writing, and documentation',
        color: '#5f27cd',
        icon: './Images/Content.png',
        gradient: 'linear-gradient(135deg, #4778d3ff, #3360b4ff)'
    },
    {
        id: 'event-management',
        name: 'Event Management',
        description: 'Event planning, coordination, and execution',
        color: '#172cecff',
        icon: './Images/EM.png',
        gradient: 'linear-gradient(135deg, #3360b4ff, #214994ff)'
    }
];

function AnimatedDepartmentSelector() {
    const containerRef = useRef(null);
    const [selectedDepartments, setSelectedDepartments] = useState({
        primary: null,
        secondary: null
    });
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectionMode, setSelectionMode] = useState('primary'); // 'primary' or 'secondary'

    // Update hidden inputs when departments are selected
    useEffect(() => {
        const primaryInput = document.getElementById('department-primary');
        const secondaryInput = document.getElementById('department-secondary');
        
        if (primaryInput && selectedDepartments.primary) {
            primaryInput.value = selectedDepartments.primary.id;
            const event = new Event('change', { bubbles: true });
            primaryInput.dispatchEvent(event);
        }
        
        if (secondaryInput && selectedDepartments.secondary) {
            secondaryInput.value = selectedDepartments.secondary.id;
            const event = new Event('change', { bubbles: true });
            secondaryInput.dispatchEvent(event);
        }
    }, [selectedDepartments]);

    // Handle reset event from form submission
    useEffect(() => {
        const handleReset = () => {
            setSelectedDepartments({
                primary: null,
                secondary: null
            });
            setSelectionMode('primary');
        };

        window.addEventListener('resetDepartmentSelector', handleReset);
        
        // Cleanup
        return () => {
            window.removeEventListener('resetDepartmentSelector', handleReset);
        };
    }, []);

    // Handle scroll progress
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
            setScrollProgress(progress);
            
            // Update current index based on scroll
            const index = Math.round(progress * (departments.length - 1));
            setCurrentIndex(index);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDepartmentClick = (department, index) => {
        if (selectionMode === 'primary') {
            // If clicking the same department that's already secondary, swap them
            if (selectedDepartments.secondary?.id === department.id) {
                setSelectedDepartments(prev => ({
                    primary: department,
                    secondary: prev.primary
                }));
            } else {
                setSelectedDepartments(prev => ({
                    ...prev,
                    primary: department
                }));
            }
        } else {
            // Secondary selection mode
            // Don't allow same department for both preferences
            if (selectedDepartments.primary?.id === department.id) {
                alert('Please choose a different department for your second preference.');
                return;
            }
            
            setSelectedDepartments(prev => ({
                ...prev,
                secondary: department
            }));
        }
        
        // Scroll to center the selected department
        if (containerRef.current) {
            const cardWidth = 270; // card width + gap
            const containerWidth = containerRef.current.clientWidth;
            const scrollTo = (index * cardWidth) - (containerWidth / 2) + (cardWidth / 2);
            containerRef.current.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
        }
    };

    return React.createElement('div', {
        style: {
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            margin: '20px auto',
            padding: '20px 0'
        }
    }, [
        // Progress indicator
        React.createElement('div', {
            key: 'progress-container',
            style: {
                position: 'absolute',
                top: '-70px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10
            }
        }, 
            React.createElement('div', {
                style: {
                    width: '80px',
                    height: '80px',
                    position: 'relative'
                }
            }, [
                React.createElement('svg', {
                    key: 'progress-svg',
                    width: '80',
                    height: '80',
                    viewBox: '0 0 100 100',
                    style: { 
                        transform: 'rotate(-90deg)',
                        position: 'absolute'
                    }
                }, [
                    React.createElement('circle', {
                        key: 'bg-circle',
                        cx: '50',
                        cy: '50',
                        r: '30',
                        stroke: '#e0e0e0',
                        strokeWidth: '8',
                        fill: 'none'
                    }),
                    React.createElement('circle', {
                        key: 'progress-circle',
                        cx: '50',
                        cy: '50',
                        r: '30',
                        stroke: selectedDepartments.primary ? selectedDepartments.primary.color : '#667eea',
                        strokeWidth: '8',
                        fill: 'none',
                        strokeDasharray: '188.4', // 2 * π * 30
                        strokeDashoffset: `${188.4 * (1 - scrollProgress)}`,
                        style: {
                            transition: 'stroke 0.3s ease, stroke-dashoffset 0.1s ease'
                        }
                    })
                ])
            ])
        ),

        // Selection mode toggle and current department indicator
        React.createElement('div', {
            key: 'selection-controls',
            style: {
                textAlign: 'center',
                marginBottom: '20px'
            }
        }, [
            React.createElement('div', {
                key: 'mode-toggle',
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                }
            }, [
                React.createElement('button', {
                    key: 'primary-btn',
                    onClick: () => setSelectionMode('primary'),
                    style: {
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        background: selectionMode === 'primary' ? '#667eea' : '#f0f0f0',
                        color: selectionMode === 'primary' ? 'white' : '#333',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }
                }, '1st Preference'),
                React.createElement('button', {
                    key: 'secondary-btn',
                    onClick: () => setSelectionMode('secondary'),
                    style: {
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        background: selectionMode === 'secondary' ? '#667eea' : '#f0f0f0',
                        color: selectionMode === 'secondary' ? 'white' : '#333',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }
                }, '2nd Preference')
            ]),
            
            // Current selections display
            React.createElement('div', {
                key: 'selections-display',
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '30px',
                    flexWrap: 'wrap',
                    minHeight: '120px',
                    alignItems: 'center'
                }
            }, [
                // Primary selection
                React.createElement('div', {
                    key: 'primary-display',
                    style: {
                        textAlign: 'center',
                        padding: '15px',
                        borderRadius: '12px',
                        border: selectedDepartments.primary ? `2px solid ${selectedDepartments.primary.color}` : '2px dashed #ddd',
                        minWidth: '200px',
                        transition: 'all 0.3s ease',
                        opacity: selectionMode === 'primary' ? 1 : 0.7
                    }
                }, [
                    React.createElement('div', {
                        key: 'primary-label',
                        style: {
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: selectedDepartments.primary ? selectedDepartments.primary.color : '#999',
                            marginBottom: '8px'
                        }
                    }, '1st Preference'),
                    selectedDepartments.primary ? [
                        React.createElement('img', {
                            key: 'primary-icon',
                            src: selectedDepartments.primary.icon,
                            alt: selectedDepartments.primary.name,
                            style: {
                                width: '40px',
                                height: '40px',
                                objectFit: 'contain',
                                marginBottom: '8px'
                            }
                        }),
                        React.createElement('div', {
                            key: 'primary-name',
                            style: {
                                fontWeight: 'bold',
                                color: selectedDepartments.primary.color,
                                fontSize: '14px'
                            }
                        }, selectedDepartments.primary.name)
                    ] : React.createElement('div', {
                        style: { color: '#999', fontSize: '14px' }
                    }, '')
                ]),
                
                // Secondary selection
                React.createElement('div', {
                    key: 'secondary-display',
                    style: {
                        textAlign: 'center',
                        padding: '15px',
                        borderRadius: '12px',
                        border: selectedDepartments.secondary ? `2px solid ${selectedDepartments.secondary.color}` : '2px dashed #ddd',
                        minWidth: '200px',
                        transition: 'all 0.3s ease',
                        opacity: selectionMode === 'secondary' ? 1 : 0.7
                    }
                }, [
                    React.createElement('div', {
                        key: 'secondary-label',
                        style: {
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: selectedDepartments.secondary ? selectedDepartments.secondary.color : '#999',
                            marginBottom: '8px'
                        }
                    }, '2nd Preference'),
                    selectedDepartments.secondary ? [
                        React.createElement('img', {
                            key: 'secondary-icon',
                            src: selectedDepartments.secondary.icon,
                            alt: selectedDepartments.secondary.name,
                            style: {
                                width: '40px',
                                height: '40px',
                                objectFit: 'contain',
                                marginBottom: '8px'
                            }
                        }),
                        React.createElement('div', {
                            key: 'secondary-name',
                            style: {
                                fontWeight: 'bold',
                                color: selectedDepartments.secondary.color,
                                fontSize: '14px'
                            }
                        }, selectedDepartments.secondary.name)
                    ] : React.createElement('div', {
                        style: { color: '#999', fontSize: '14px' }
                    }, '')
                ])
            ])
        ]),

        // Current department indicator
        React.createElement('div', {
            key: 'current-indicator',
            style: {
                textAlign: 'center',
                marginBottom: '30px',
                minHeight: '60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
            }
        }, 
            React.createElement('p', {
                key: 'instruction',
                style: {
                    color: '#666',
                    fontSize: '1rem',
                    margin: '0'
                }
            }, `Select your ${selectionMode === 'primary' ? '1st' : '2nd'} preference by clicking a department below`)
        ),

        // Scrollable department list
        React.createElement('div', {
            key: 'scroll-container',
            ref: containerRef,
            style: {
                display: 'flex',
                overflowX: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#667eea rgba(255,255,255,0.2)',
                gap: '20px',
                padding: '20px 40px',
                cursor: 'grab',
                scrollSnapType: 'x mandatory',
                // Fade effect on edges
                maskImage: 'linear-gradient(90deg, transparent, black 20px, black calc(100% - 20px), transparent)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent, black 20px, black calc(100% - 20px), transparent)'
            },
            onMouseDown: (e) => e.currentTarget.style.cursor = 'grabbing',
            onMouseUp: (e) => e.currentTarget.style.cursor = 'grab',
            onMouseLeave: (e) => e.currentTarget.style.cursor = 'grab'
        }, 
            departments.map((dept, index) => {
                const isPrimary = selectedDepartments.primary?.id === dept.id;
                const isSecondary = selectedDepartments.secondary?.id === dept.id;
                const isSelected = isPrimary || isSecondary;
                
                return React.createElement('div', {
                    key: dept.id,
                    className: `department-card ${isSelected ? 'selected-department' : ''}`,
                    onClick: () => handleDepartmentClick(dept, index),
                    style: {
                        minWidth: '250px',
                        height: '220px',
                        background: dept.gradient,
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        scrollSnapAlign: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: isSelected 
                            ? `0 12px 30px ${dept.color}50, 0 0 0 3px ${dept.color}` 
                            : '0 6px 20px rgba(0,0,0,0.15)',
                        filter: isSelected ? 'brightness(1.1)' : 'brightness(1)'
                    },
                    onMouseEnter: (e) => {
                        if (!isSelected) {
                            e.currentTarget.style.transform = 'scale(1.02) translateY(-4px)';
                            e.currentTarget.style.boxShadow = `0 8px 25px ${dept.color}30`;
                        }
                    },
                    onMouseLeave: (e) => {
                        if (!isSelected) {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                        }
                    }
                }, [
                    React.createElement('img', {
                        key: 'icon',
                        src: dept.icon,
                        alt: dept.name,
                        style: {
                            width: '60px',
                            height: '60px',
                            objectFit: 'contain',
                            marginBottom: '15px',
                            transition: 'transform 0.3s ease',
                            filter: 'brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        },
                        onError: (e) => {
                            // Fallback to default icon if image fails to load
                            e.target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.textContent = '📁';
                            fallback.style.fontSize = '3rem';
                            fallback.style.marginBottom = '15px';
                            e.target.parentNode.insertBefore(fallback, e.target);
                        }
                    }),
                    React.createElement('h3', {
                        key: 'name',
                        style: {
                            margin: '0 0 12px 0',
                            fontSize: '1.4rem',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }
                    }, dept.name),
                    React.createElement('p', {
                        key: 'desc',
                        style: {
                            margin: '0',
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            padding: '0 15px',
                            opacity: '0.95',
                            lineHeight: '1.3'
                        }
                    }, dept.description),
                    // Selection indicators
                    isPrimary && React.createElement('div', {
                        key: 'primary-indicator',
                        style: {
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            width: '35px',
                            height: '35px',
                            background: 'rgba(255,255,255,0.9)',
                            color: dept.color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            animation: 'checkmark 0.5s ease'
                        }
                    }, '1st'),
                    isSecondary && React.createElement('div', {
                        key: 'secondary-indicator',
                        style: {
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            width: '35px',
                            height: '35px',
                            background: 'rgba(255,255,255,0.9)',
                            color: dept.color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            animation: 'checkmark 0.5s ease'
                        }
                    }, '2nd')
                ])
            })
        ),

        // Progress dots
        React.createElement('div', {
            key: 'progress-dots',
            style: {
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '20px'
            }
        },
            departments.map((_, index) => 
                React.createElement('div', {
                    key: index,
                    onClick: () => handleDepartmentClick(departments[index], index),
                    style: {
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: currentIndex === index ? '#667eea' : '#ddd',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: currentIndex === index ? 'scale(1.2)' : 'scale(1)'
                    }
                })
            )
        ),

        // Scroll hint
        (!selectedDepartments.primary && !selectedDepartments.secondary) && React.createElement('div', {
            key: 'scroll-hint',
            style: {
                textAlign: 'center',
                marginTop: '15px',
                color: '#666',
                fontSize: '0.9rem',
                opacity: '0.7',
                animation: 'fadeInUp 1s ease 0.5s both'
            }
        }, '← Scroll horizontally to explore departments →')
    ]);
}

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
        40%, 43% { transform: translate3d(0,-8px,0); }
        70% { transform: translate3d(0,-4px,0); }
        90% { transform: translate3d(0,-2px,0); }
    }
    
    @keyframes checkmark {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        100% { transform: scale(1) rotate(360deg); opacity: 1; }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 0.7; transform: translateY(0); }
    }
    
    /* Enhanced image styles */
    #animated-department-selector img {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    #animated-department-selector .department-card:hover img {
        transform: scale(1.1) rotate(3deg);
        filter: brightness(1.2) drop-shadow(0 4px 12px rgba(0,0,0,0.4)) !important;
    }
    
    #animated-department-selector .selected-department img {
        transform: scale(1.1);
        filter: brightness(1.3) drop-shadow(0 6px 16px rgba(0,0,0,0.3)) !important;
    }
    
    /* Image loading states */
    #animated-department-selector img {
        opacity: 0;
        animation: imageLoad 0.5s ease forwards;
    }
    
    @keyframes imageLoad {
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Mount the component
function mountAnimatedDepartmentSelector() {
    const container = document.getElementById('animated-department-selector');
    
    if (!container) {
        console.warn('AnimatedDepartmentSelector: Container not found');
        return;
    }
    
    if (window.ReactDOM) {
        ReactDOM.render(React.createElement(AnimatedDepartmentSelector), container);
        console.log('AnimatedDepartmentSelector: Mounted successfully');
    } else {
        console.warn('AnimatedDepartmentSelector: ReactDOM not available');
        createFallbackSelector(container);
    }
}

// Fallback selector without animations
function createFallbackSelector(container) {
    let selectedDepartments = { primary: null, secondary: null };
    let selectionMode = 'primary';
    
    container.innerHTML = `
        <div style="text-align: center; margin: 20px 0;">
            <h4>Choose Your Departments</h4>
            
            <!-- Mode Toggle -->
            <div style="margin: 20px 0;">
                <button id="primary-mode-btn" style="padding: 8px 16px; margin: 0 5px; border: none; border-radius: 20px; background: #667eea; color: white; cursor: pointer;">1st Preference</button>
                <button id="secondary-mode-btn" style="padding: 8px 16px; margin: 0 5px; border: none; border-radius: 20px; background: #f0f0f0; color: #333; cursor: pointer;">2nd Preference</button>
            </div>
            
            <!-- Selection Display -->
            <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0; flex-wrap: wrap;">
                <div id="primary-display" style="border: 2px dashed #ddd; padding: 15px; border-radius: 12px; min-width: 150px;">
                    <div style="font-size: 12px; font-weight: bold; color: #999; margin-bottom: 8px;">1st Preference</div>
                    <div id="primary-content" style="color: #999;">Click to select</div>
                </div>
                <div id="secondary-display" style="border: 2px dashed #ddd; padding: 15px; border-radius: 12px; min-width: 150px;">
                    <div style="font-size: 12px; font-weight: bold; color: #999; margin-bottom: 8px;">2nd Preference</div>
                    <div id="secondary-content" style="color: #999;">Click to select</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; max-width: 800px; margin: 20px auto;">
                ${departments.map(dept => `
                    <div onclick="selectDepartmentFallback('${dept.id}', '${dept.name}')" 
                         style="background: ${dept.gradient}; color: white; padding: 20px; border-radius: 10px; cursor: pointer; text-align: center; transition: transform 0.2s; border: 3px solid transparent;"
                         onmouseover="this.style.transform='scale(1.02)'"
                         onmouseout="this.style.transform='scale(1)'"
                         id="dept-card-${dept.id}">
                        <img src="${dept.icon}" alt="${dept.name}" style="width: 50px; height: 50px; object-fit: contain; margin-bottom: 10px; filter: brightness(1.1);" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div style="font-size: 2rem; margin-bottom: 10px; display: none;">📁</div>
                        <h3 style="margin: 0 0 5px 0;">${dept.name}</h3>
                        <p style="margin: 0; font-size: 0.8rem; opacity: 0.9;">${dept.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add global function to select department
    window.selectDepartmentFallback = function(id, name) {
        const dept = departments.find(d => d.id === id);
        if (!dept) return;
        
        if (selectionMode === 'primary') {
            // If clicking the same department that's already secondary, swap them
            if (selectedDepartments.secondary?.id === id) {
                selectedDepartments.primary = dept;
                selectedDepartments.secondary = selectedDepartments.primary;
            } else {
                selectedDepartments.primary = dept;
            }
        } else {
            // Don't allow same department for both preferences
            if (selectedDepartments.primary?.id === id) {
                alert('Please choose a different department for your second preference.');
                return;
            }
            selectedDepartments.secondary = dept;
        }
        
        updateFallbackDisplay();
        updateHiddenInputs();
    };
    
    // Mode toggle functionality
    document.getElementById('primary-mode-btn').onclick = function() {
        selectionMode = 'primary';
        document.getElementById('primary-mode-btn').style.background = '#667eea';
        document.getElementById('primary-mode-btn').style.color = 'white';
        document.getElementById('secondary-mode-btn').style.background = '#f0f0f0';
        document.getElementById('secondary-mode-btn').style.color = '#333';
    };
    
    document.getElementById('secondary-mode-btn').onclick = function() {
        selectionMode = 'secondary';
        document.getElementById('secondary-mode-btn').style.background = '#667eea';
        document.getElementById('secondary-mode-btn').style.color = 'white';
        document.getElementById('primary-mode-btn').style.background = '#f0f0f0';
        document.getElementById('primary-mode-btn').style.color = '#333';
    };
    
    function updateFallbackDisplay() {
        const primaryDisplay = document.getElementById('primary-display');
        const secondaryDisplay = document.getElementById('secondary-display');
        const primaryContent = document.getElementById('primary-content');
        const secondaryContent = document.getElementById('secondary-content');
        
        if (selectedDepartments.primary) {
            primaryDisplay.style.border = `2px solid ${selectedDepartments.primary.color}`;
            primaryContent.innerHTML = `
                <img src="${selectedDepartments.primary.icon}" style="width: 30px; height: 30px; margin-bottom: 5px;"><br>
                <strong style="color: ${selectedDepartments.primary.color};">${selectedDepartments.primary.name}</strong>
            `;
        } else {
            primaryDisplay.style.border = '2px dashed #ddd';
            primaryContent.innerHTML = 'Click to select';
        }
        
        if (selectedDepartments.secondary) {
            secondaryDisplay.style.border = `2px solid ${selectedDepartments.secondary.color}`;
            secondaryContent.innerHTML = `
                <img src="${selectedDepartments.secondary.icon}" style="width: 30px; height: 30px; margin-bottom: 5px;"><br>
                <strong style="color: ${selectedDepartments.secondary.color};">${selectedDepartments.secondary.name}</strong>
            `;
        } else {
            secondaryDisplay.style.border = '2px dashed #ddd';
            secondaryContent.innerHTML = 'Click to select';
        }
        
        // Update card indicators
        departments.forEach(dept => {
            const card = document.getElementById(`dept-card-${dept.id}`);
            if (card) {
                const isPrimary = selectedDepartments.primary?.id === dept.id;
                const isSecondary = selectedDepartments.secondary?.id === dept.id;
                
                if (isPrimary) {
                    card.style.border = `3px solid white`;
                    card.innerHTML = card.innerHTML.replace(/<div[^>]*class="indicator"[^>]*>.*?<\/div>/, '') + 
                                    '<div class="indicator" style="position: absolute; top: 10px; right: 10px; background: white; color: ' + dept.color + '; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">1st</div>';
                } else if (isSecondary) {
                    card.style.border = `3px solid white`;
                    card.innerHTML = card.innerHTML.replace(/<div[^>]*class="indicator"[^>]*>.*?<\/div>/, '') + 
                                    '<div class="indicator" style="position: absolute; top: 10px; right: 10px; background: white; color: ' + dept.color + '; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">2nd</div>';
                } else {
                    card.style.border = '3px solid transparent';
                    card.innerHTML = card.innerHTML.replace(/<div[^>]*class="indicator"[^>]*>.*?<\/div>/, '');
                }
            }
        });
    }
    
    function updateHiddenInputs() {
        const primaryInput = document.getElementById('department-primary');
        const secondaryInput = document.getElementById('department-secondary');
        
        if (primaryInput && selectedDepartments.primary) {
            primaryInput.value = selectedDepartments.primary.id;
            const event = new Event('change', { bubbles: true });
            primaryInput.dispatchEvent(event);
        }
        
        if (secondaryInput && selectedDepartments.secondary) {
            secondaryInput.value = selectedDepartments.secondary.id;
            const event = new Event('change', { bubbles: true });
            secondaryInput.dispatchEvent(event);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAnimatedDepartmentSelector);
} else {
    setTimeout(mountAnimatedDepartmentSelector, 100); // Small delay to ensure React is loaded
}

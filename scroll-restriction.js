/**
 * Scroll Restriction Fix
 * This script addresses issues with scrolling, particularly around the footer area
 * and form sections, ensuring smooth scrolling throughout the page.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the locomotive scroll instance
    const locoScroll = window.locoScroll;
    
    if (!locoScroll) {
        console.warn('⚠️ LocomotiveScroll instance not found. Scroll fixes not applied.');
        return;
    }
    
    // Fix for navigation scrolling issue
    function fixNavigationScrolling() {
        // Ensure navigation links use locoScroll for smooth scrolling
        // without restricting scrolling above the target element
        document.querySelectorAll('#nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement && locoScroll) {
                    e.preventDefault();
                    
                    // Use locoScroll to scroll to the target while maintaining scrollability
                    locoScroll.scrollTo(targetElement);
                }
            });
        });
    }
    
    // Fix for footer scrolling issue
    function fixFooterScrolling() {
        const footer = document.getElementById('page5');
        const formSection = document.getElementById('page4');
        
        if (!footer || !formSection) {
            console.warn('⚠️ Required page sections not found for scroll fix.');
            return;
        }
        
        // Ensure LocomotiveScroll correctly calculates scrollable area
        function updateScrollableArea() {
            // Force locomotive scroll to recalculate limits
            locoScroll.update();
            
            // Get the document height including all sections
            const docHeight = document.body.scrollHeight;
            
            // Set data attribute to help with scroll calculations
            document.body.setAttribute('data-scroll-height', docHeight);
            
            // Make sure the main container has proper height
            const main = document.getElementById('main');
            if (main) {
                // Ensure main container has enough height to include all content
                main.style.minHeight = docHeight + 'px';
            }
        }
        
        // Update on form visibility change
        function checkFormVisibility() {
            const formContainer = document.getElementById('recruitment-form-container');
            const authOverlay = document.getElementById('auth-overlay');
            
            // Form visibility has changed, update scrollable area
            if (formContainer && authOverlay) {
                if (formContainer.style.display !== 'none' || authOverlay.style.display !== 'none') {
                    setTimeout(updateScrollableArea, 300); // Delay to allow DOM updates
                } else {
                    setTimeout(updateScrollableArea, 300);
                }
            }
        }
        
        // Initial update
        updateScrollableArea();
        
        // Listen for form visibility changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style') {
                    checkFormVisibility();
                }
            });
        });
        
        // Observe auth overlay and form container for style changes
        const formContainer = document.getElementById('recruitment-form-container');
        const authOverlay = document.getElementById('auth-overlay');
        
        if (formContainer) {
            observer.observe(formContainer, { attributes: true });
        }
        
        if (authOverlay) {
            observer.observe(authOverlay, { attributes: true });
        }
        
        // Listen for window resize to update scrollable area
        window.addEventListener('resize', updateScrollableArea);
        
        // Fix for users who are stuck in the footer area
        footer.addEventListener('mousewheel', function(e) {
            // If user tries to scroll up but is stuck
            if (e.deltaY < 0) {
                // Manually scroll to form section when user tries to scroll up from footer
                locoScroll.scrollTo(formSection);
            }
        });
        
        // Alternative for touch devices
        let touchStartY = 0;
        
        footer.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        footer.addEventListener('touchmove', function(e) {
            const touchY = e.touches[0].clientY;
            const deltaY = touchY - touchStartY;
            
            // If user is swiping up
            if (deltaY > 30) {
                // Manually scroll to form section
                locoScroll.scrollTo(formSection);
            }
        }, { passive: true });
    }
    
    // Initialize the fix
    fixFooterScrolling();
    fixNavigationScrolling();
    
    // Update locomotive scroll on auth state change
    window.addEventListener('firebaseLoaded', function() {
        // Update scroll when authentication state changes
        window.firebase.onAuthStateChanged(window.firebase.auth, function() {
            setTimeout(function() {
                if (window.locoScroll) {
                    window.locoScroll.update();
                }
            }, 500);
        });
    });
    
    // Add a global method to force scroll update
    window.updatePageScroll = function() {
        if (window.locoScroll) {
            window.locoScroll.update();
        }
    };
});

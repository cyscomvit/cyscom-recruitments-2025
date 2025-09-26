document.addEventListener('DOMContentLoaded', function () {
    // Get reference to the locomotive scroll instance
    const locoScroll = window.locoScroll;

    if (!locoScroll) {
        console.warn('⚠️ LocomotiveScroll instance not found. Scroll fixes not applied.');
        return;
    }

    // Fix for navigation scrolling issue
    function fixNavigationScrolling() {
        // Ensure navigation links use locoScroll for smooth scrolling
        document.querySelectorAll('#nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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
                main.style.minHeight = docHeight + 'px';
            }
        }

        // Update on form visibility change
        function checkFormVisibility() {
            const formContainer = document.getElementById('recruitment-form-container');
            const authOverlay = document.getElementById('auth-overlay');

            if (formContainer && authOverlay) {
                setTimeout(updateScrollableArea, 300); // Delay to allow DOM updates
            }
        }

        // Initial update
        updateScrollableArea();

        // Listen for form visibility changes
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'style') {
                    checkFormVisibility();
                }
            });
        });

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
        footer.addEventListener('mousewheel', function (e) {
            if (e.deltaY < 0) {
                locoScroll.scrollTo(formSection);
            }
        });

        // Alternative for touch devices
        let touchStartY = 0;

        footer.addEventListener('touchstart', function (e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        footer.addEventListener('touchmove', function (e) {
            const touchY = e.touches[0].clientY;
            const deltaY = touchY - touchStartY;

            if (deltaY > 30) {
                locoScroll.scrollTo(formSection);
            }
        }, { passive: true });
    }

    // Initialize the fix
    fixFooterScrolling();
    fixNavigationScrolling();

    // Update locomotive scroll on auth state change
    window.addEventListener('firebaseLoaded', function () {
        window.firebase.onAuthStateChanged(window.firebase.auth, function () {
            setTimeout(function () {
                if (window.locoScroll) {
                    window.locoScroll.update();
                }
            }, 500);
        });
    });

    // Add a global method to force scroll update
    window.updatePageScroll = function () {
        if (window.locoScroll) {
            window.locoScroll.update();
        }
    };
});

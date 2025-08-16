function locomotiveAnimations() {
    gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

// Check if it's a mobile device
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// Only initialize Locomotive Scroll on non-mobile devices
const locoScroll = !isMobile ? new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
    multiplier: 1,
    lerp: 0.05,
    scrollFromAnywhere: true,
    smartphone: {
        smooth: false
    },
    tablet: {
        smooth: false
    }
}) : null;

// Make locomotive scroll instance globally available for navbar behavior
window.locoScroll = locoScroll;

if (locoScroll) {
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        }, // we don't have to define a scrollLeft because we're only scrolling vertically.
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });
} else {
    // On mobile, use default scroll behavior
    ScrollTrigger.defaults({ scroller: window });
}





// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

ScrollTrigger.refresh();

}
locomotiveAnimations();

function navbarAnimation() {
    // Disabled to prevent conflict with CSS-based navbar hide/show behavior
    // The navbar visibility is now controlled by CSS classes in index.html
    /*
    gsap.to("#nav-part1 svg", {
        transform: "translateY(-100%)",
        scrollTrigger: {
            trigger: "#page1",
            scroller: "#main",
            start: "top 0%",
            end: "top -5%",
            scrub: true,
            // markers:true
        }
    })
    gsap.to("#nav-part2 #links", {
        transform: "translateY(-100%)",
        opacity: 0,
        scrollTrigger: {
            trigger: "#page1",
            scroller: "#main",
            start: "top 0",
            end: "top -5%",
            scrub: true,
        }
    })
    */
}
navbarAnimation();

function videoconAnimation() {
    let videocon = document.querySelector("#video-container");
    let playbtn = document.querySelector("#play");

    videocon.addEventListener("mouseenter", function () {
        gsap.to(playbtn, {
            scale: 1,
            opacity: 1
        })
    })

    videocon.addEventListener("mouseleave", function () {
        gsap.to(playbtn, {
            scale: 0,
            opacity: 0
        })
    })
    videocon.addEventListener("mousemove", function (dets) {
        gsap.to(playbtn, {
            left: dets.x-85,
            top: dets.y-80,
            
        })
    })
}
videoconAnimation();

function loadingAnimation() {
    gsap.from("#page1 h1", {
        y: 100,
        opacity: 0,
        delay:0.5,
        duration: 0.9,
        stagger: 0.3
    })
    gsap.from("#page1 #video-container", {
        scale: 0.9,
        opacity: 0,
        delay:1.3,
        duration: 0.5,
    })
}
loadingAnimation();

function cursorAnimation() {
    document.addEventListener("mousemove", function(dets){
        gsap.to("#cursor", {
            left: dets.x,
            top: dets.y,
        })
    })
    
    document.querySelectorAll(".child").forEach(function(elem) {
        elem.addEventListener("mouseenter", function() {
            const cursor = document.querySelector("#cursor");
            const bgColor = elem.getAttribute("data-color");
    
            gsap.to(cursor, {
                backgroundColor: bgColor,
                transform: 'translate(-50%,-50%) scale(1)'
            });
            
        });
        elem.addEventListener("mouseleave", function() {
            const cursor = document.querySelector("#cursor");
    
            gsap.to(cursor, {
                backgroundColor: 'transparent',
                transform: 'translate(-50%,-50%) scale(0)'
            });
        });
    })
}
cursorAnimation();

// TiltedCard Component for Vanilla JS with GSAP
class TiltedCard {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      scaleOnHover: 1.1,
      rotateAmplitude: 14,
      showTooltip: true,
      ...options
    };
    
    this.init();
  }

  init() {
    this.setupElement();
    this.bindEvents();
  }

  setupElement() {
    this.element.style.perspective = '800px';
    this.element.style.transformStyle = 'preserve-3d';
    
    const img = this.element.querySelector('img');
    if (img) {
      img.style.borderRadius = '15px';
      img.style.willChange = 'transform';
      img.style.transform = 'translateZ(0)';
    }
  }

  bindEvents() {
    this.element.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.element.addEventListener('mouseenter', () => this.handleMouseEnter());
    this.element.addEventListener('mouseleave', () => this.handleMouseLeave());
  }

  handleMouseMove(e) {
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;
    
    const rotateX = (offsetY / (rect.height / 2)) * -this.options.rotateAmplitude;
    const rotateY = (offsetX / (rect.width / 2)) * this.options.rotateAmplitude;
    
    if (typeof gsap !== 'undefined') {
      gsap.to(this.element, {
        duration: 0.1,
        rotateX: rotateX,
        rotateY: rotateY,
        ease: "power2.out"
      });
    } else {
      this.element.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  }

  handleMouseEnter() {
    if (typeof gsap !== 'undefined') {
      gsap.to(this.element, {
        duration: 0.3,
        scale: this.options.scaleOnHover,
        ease: "power2.out"
      });
    } else {
      this.element.style.transition = 'transform 0.3s ease';
      this.element.style.transform += ` scale(${this.options.scaleOnHover})`;
    }
  }

  handleMouseLeave() {
    if (typeof gsap !== 'undefined') {
      gsap.to(this.element, {
        duration: 0.3,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        ease: "power2.out"
      });
    } else {
      this.element.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }
}

// Initialize tilted cards when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for React component to render
  setTimeout(() => {
    const childElements = document.querySelectorAll('#page3 .child');
    childElements.forEach(child => {
      new TiltedCard(child, {
        scaleOnHover: 1.05,
        rotateAmplitude: 12,
      });
    });
  }, 100);
});

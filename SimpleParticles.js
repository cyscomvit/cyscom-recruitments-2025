// Simplified Canvas2D Particles Component
const { useEffect, useRef } = React;

const Particles = ({
  particleCount = 100,
  speed = 0.5,
  particleColors = ['#ffffff', '#e0e6ff', '#b8c5ff'],
  size = 2,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * size + 1,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          opacity: Math.random() * 0.8 + 0.2,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    };

    initParticles();

    // Mouse move handler
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = (time) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.x += dx * force * 0.01;
          particle.y += dy * force * 0.01;
        }

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        if (particle.y > canvas.offsetHeight) particle.y = 0;

        // Pulsing effect
        particle.pulsePhase += 0.02;
        const pulse = Math.sin(particle.pulsePhase) * 0.5 + 0.5;
        const currentOpacity = particle.opacity * (0.3 + pulse * 0.7);

        // Draw particle
        ctx.save();
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.restore();

        // Connect nearby particles
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.save();
            ctx.globalAlpha = (80 - distance) / 80 * 0.1;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, speed, size]);

  return React.createElement('canvas', {
    ref: canvasRef,
    className: `particles-canvas ${className}`,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    }
  });
};

// Make it globally available
window.Particles = Particles;

// GlitchText React Component
const GlitchText = ({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = '',
}) => {
  const inlineStyles = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 red' : 'none',
    '--before-shadow': enableShadows ? '5px 0 cyan' : 'none',
  };

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';

  return React.createElement('div', {
    className: `glitch ${hoverClass} ${className}`.trim(),
    style: inlineStyles,
    'data-text': children
  }, children);
};

// Page3 Component with GlitchText
const Page3Component = () => {
  return React.createElement('div', { id: 'page3' }, 
    React.createElement('div', { className: 'child', id: 'child1', 'data-color': '#D4D0D3' },
      React.createElement('img', { src: 'Images/Eve1.png', alt: '' }),
      React.createElement('div', { className: 'childInfo' },
        React.createElement(GlitchText, { 
          speed: 0.8, 
          enableShadows: true, 
          enableOnHover: true, 
          className: 'event-title' 
        }, 'Hack Overflow'),
        React.createElement(GlitchText, { 
          speed: 1.2, 
          enableShadows: true, 
          enableOnHover: true, 
          className: 'event-year' 
        }, '2022')
      )
    ),
    React.createElement('div', { className: 'child', id: 'child2', 'data-color': '#E6DFD7' },
      React.createElement('img', { src: 'Images/Eve2.png', alt: '' }),
      React.createElement('div', { className: 'childInfo' },
        React.createElement(GlitchText, { 
          speed: 1.0, 
          enableShadows: true, 
          enableOnHover: true, 
          className: 'event-title' 
        }, 'Code & Conquer'),
        React.createElement(GlitchText, { 
          speed: 1.5, 
          enableShadows: true, 
          enableOnHover: true, 
          className: 'event-year' 
        }, '2024')
      )
    ),
    React.createElement('div', { className: 'child', id: 'child3', 'data-color': '#E6DFD7' },
      React.createElement('img', { src: 'Images/Eve3.png', alt: '' }),
      React.createElement('div', { className: 'childInfo' },
        React.createElement(GlitchText, { 
          speed: 0.6, 
          enableShadows: true, 
          enableOnHover: true, 
          className: 'event-title' 
        }, 'V-Medithon'),
        React.createElement(GlitchText, { 
          speed: 1.8, 
          enableShadows: true, 
          enableOnHover: true, 
          className: 'event-year' 
        }, '2024')
      )
    ),
    React.createElement('div', { className: 'child', id: 'child4', 'data-color': '#B4D5B6' },
      React.createElement('img', { src: 'Images/Eve4.png', alt: '' }),
      React.createElement('div', { className: 'childInfo' },
        React.createElement(GlitchText, { 
          speed: 1.3, 
          enableShadows: true, 
          enableOnHover: true, 
          className: 'event-title' 
        }, 'Zypher CTF'),
        React.createElement(GlitchText, { 
          speed: 0.9, 
          enableShadows: true, 
          enableOnHover: true, 
          className: 'event-year' 
        }, '2023')
      )
    )
  );
};

// Render the component when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Wait for React to be loaded
  if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
    const page3Container = document.getElementById('page3');
    if (page3Container) {
      // Replace the existing page3 content with React component
      ReactDOM.render(React.createElement(Page3Component), page3Container);
    }
  }
});

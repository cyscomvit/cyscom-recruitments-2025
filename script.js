// Recruitment Results Portal - JavaScript
// Hacker/Terminal Style Implementation

class RecruitmentPortal {
    constructor() {
        this.logoClickCount = 0;
        this.isResultsVisible = false;
        this.typewriterSpeed = 50;
        this.currentDepartment = null;
        
        // Sample recruitment data with new simplified commands
        this.recruitmentData = {
            'technical': [
                "Shaleen Garg", "Harish R", "Naresh S", "Akshay Katti", "Hareekshith AS",
                "Abhay Krishna", "Anayy Jhawar", "Yashwant gokul p", "Sharon R", "S S Kishore Kumar",
                "Sagnik Sen", "Nekkanti Aishani", "Avi Dhandhania", "Gaurish", "Vivin Arya",
                "Oviya S", "Sahran Gilani", "Shivanshu Singh", "Ishan Nagpure", "Daniyyel Franx",
                "Dhrubajyoti Paul", "Sibhi S", "Uthraa R", "Abhimantr Singh", "Rithvik Sundar",
                "Riya Mishra", "Shivangi Singh", "Shanil Singh", "Aditi Sahu", "Ahaan Pant",
                "Tanmay Khanna", "Rajat Nahata"
            ],
            'design': [
                "A N Srija", "Dhrubajyoti Paul", "Rose Cyriac", "Sreelakshmi Viswam", "Saksham Kaushish",
                "Aditi Sahu", "Sweety Singh", "Ahaan Pant", "Gayathridevi S", "Rajat Nahata",
                "Preeti BR", "Rangon Saha", "Harshita Das", "Sanjana Sujil"
            ],
            'dev': [
                "Adish Vipin", "Parth Mishra", "Vardaa Maheshwari", "Akshay Katti", "Harsh Sharma", 
                "Monish Dasari", "Shresth Sahay", "Sarthak Shinde", "Anayy Jhawar", "Udarsh Goyal", 
                "Rohit Anish", "Avinash Jeevan", "Ishan Nagpure", "Daniyyel Franx", "Maya V S", 
                "Hari Padmesh Kanagaraj", "Vishal Prabhu", "Ansh Mittal", "Kritika Kumari", 
                "Saras Singhal", "Prateek Gogia", "Srijan Tiwari", "Priyadharshini S", 
                "Rushil Goyal", "Ram Krishna Subbaraman"
            ],
            'em': [
                "Shivam Singh", "Nekkanti Aishani", "Tanishi Srivastava", "Joeliyn Calista", "Srishti Swaroop",
                "Gitika M", "Deepakshi Mathur", "Roshan Plato", "Riya Mishra", "Saras Singhal",
                "Vrishti Dani", "Thipthi Shree V", "Jayasriram S", "Goyam Jain", "Rucheera Tamaskar",
                "P Vikram Kishore", "Keshav Sai", "Kaushik Murudkar", "Chandra K", "Revathi Rao Meka",
                "Anusha Nigam", "Samyuktha Chowdary", "Kritika Kumari", "Bhuvanesh Jatla", "Sanjhana Srivatsan",
                "Divya Dharshini", "Nivedita S", "Joon Mukherjee", "Chinmay Singh", "Godwin K S", "Vatshal Pandey"
            ],
            'sm': [
                "Shubh Kothari", "Rohit Anish", "Shree Devi", "Shivangi Suman",
                "Ardhra Arunkumar", "Joshita K", "Siddharth S", "Shivani Pallath", "Rucheera Tamaskar",
                "Yukti Kapoor", "Joshitha A", "Shanil Singh","Judith Igdaliah Ebenezar"
            ],
            'content': [
                "Gitika M", "Sugeeth Jayaraj S A", "Abhimantr Singh", "UTKARSH RAJ", "Uthraa R",
                "Yokash H", "Vardaa Maheshwari", "Abdul Rahman", "Parth Mishra",
                "Pragati Sunil", "Revathi Rao Meka", "Kaviyavarshini Natarajan"
            ]
        };

        this.init();
    }

    init() {
        this.initializeMatrix();
        this.initializeTypewriter();
        this.initializeTerminalInterface();
        this.initializeBackButton();
        this.initializeEasterEgg();
        this.addSoundEffects();
        this.startTerminalLog();
        this.initializeKeyboardNavigation();
    }

    // Matrix Rain Animation
    initializeMatrix() {
        const canvas = document.getElementById('matrix-bg');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Matrix characters
        const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = [];

        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * canvas.height / fontSize;
        }

        const drawMatrix = () => {
            // Fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set text properties
            ctx.fillStyle = '#00ff00';
            ctx.font = `${fontSize}px monospace`;

            // Draw characters
            for (let i = 0; i < drops.length; i++) {
                const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                
                ctx.fillText(char, x, y);

                // Reset drop when it reaches bottom
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        // Start animation
        setInterval(drawMatrix, 50);
    }

    // Typewriter Effect
    async typeWriter(element, text, speed = this.typewriterSpeed) {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text.charAt(i);
            await this.sleep(speed);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ASCII Art Animation
    async initializeTypewriter() {
        const asciiArt = `
 ██████╗██╗   ██╗███████╗ ██████╗ ██████╗ ███╗   ███╗
██╔════╝╚██╗ ██╔╝██╔════╝██╔════╝██╔═══██╗████╗ ████║
██║      ╚████╔╝ ███████╗██║     ██║   ██║██╔████╔██║
██║       ╚██╔╝  ╚════██║██║     ██║   ██║██║╚██╔╝██║
╚██████╗   ██║   ███████║╚██████╗╚██████╔╝██║ ╚═╝ ██║
 ╚═════╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝
        `;

        const recruitmentText = '>> Recruitment results 2025';

        // Animate ASCII art
        await this.sleep(500);
        this.typeWriter(document.getElementById('ascii-art'), asciiArt, 10);
        
        // Animate recruitment results text with typing effect
        await this.sleep(2000);
        await this.typeWriter(document.getElementById('typewriter-recruitment'), recruitmentText, 100);
    }

    // Terminal Interface
    initializeTerminalInterface() {
        const terminalInput = document.getElementById('terminal-input');
        const terminalOutput = document.getElementById('terminal-output');
        
        // Handle terminal commands
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.toLowerCase().trim();
                this.processTerminalCommand(command, terminalOutput);
                terminalInput.value = '';
                this.playSound('select');
            }
        });

        // Focus when clicking directly on the input or terminal interface
        terminalInput.addEventListener('click', () => {
            terminalInput.focus();
        });
        
        document.querySelector('.terminal-interface').addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // Process Terminal Commands
    async processTerminalCommand(command, output) {
        const commandLine = document.createElement('div');
        commandLine.className = 'output-line';
        commandLine.innerHTML = `<span style="color: #00ff99;">guest@localhost:~$ </span><span style="color: #f5e642;">${command}</span>`;
        output.appendChild(commandLine);

        // Process different commands
        switch(command.toLowerCase().trim()) {
            case 'help':
                this.addOutputLine(output, 'Available commands: technical, design, dev, em, sm, content, banner', 'output-line');
                break;

            case 'clear':
                setTimeout(() => {
                    output.innerHTML = `<div class="output-line help-line">Type 'help' to see list of available commands.</div>`;
                }, 100);
                return;

            case 'technical':
                await this.showDepartmentResults('technical', '>> Accessing Technical Department Results...', output);
                break;

            case 'design':
                await this.showDepartmentResults('design', '>> Accessing Design Department Results...', output);
                break;

            case 'dev':
                await this.showDepartmentResults('dev', '>> Accessing Web Development Team Results...', output);
                break;

            case 'em':
                await this.showDepartmentResults('em', '>> Accessing Event Management Results...', output);
                break;

            case 'sm':
                await this.showDepartmentResults('sm', '>> Accessing Social Media Team Results...', output);
                break;

            case 'content':
                await this.showDepartmentResults('content', '>> Accessing Content Team Results...', output);
                break;

            case 'banner':
                this.addOutputLine(output, '█████████████████████████████████████', 'output-line');
                this.addOutputLine(output, '   RECRUITMENT RESULTS PORTAL 2025   ', 'output-line');
                this.addOutputLine(output, '█████████████████████████████████████', 'output-line');
                break;

            default:
                this.addOutputLine(output, "command not found: try 'help'", 'output-line');
                break;
        }

        // Scroll to bottom of terminal output only
        setTimeout(() => {
            output.scrollTop = output.scrollHeight;
        }, 50);
    }

    // Helper method to add output lines
    addOutputLine(output, text, className = 'output-line') {
        const line = document.createElement('div');
        line.className = className;
        line.textContent = text;
        output.appendChild(line);
    }

    // Show Department Results in Terminal
    async showDepartmentResults(department, headerText, output) {
        // Add header
        this.addOutputLine(output, headerText, 'system-line');
        this.addOutputLine(output, '', 'output-line'); // Empty line for spacing
        
        // Add candidates in terminal ls-like format
        const candidates = this.recruitmentData[department];
        if (candidates) {
            const isMobile = window.innerWidth <= 768;
            const columnsPerRow = isMobile ? 1 : 4;
            
            // Process candidates in rows
            for (let i = 0; i < candidates.length; i += columnsPerRow) {
                await this.sleep(150); // Animation delay
                
                if (isMobile) {
                    // Mobile: single column
                    this.addOutputLine(output, candidates[i], 'candidate-terminal-line');
                } else {
                    // Desktop: create row with multiple columns
                    const row = candidates.slice(i, i + columnsPerRow);
                    const paddedRow = row.map(name => name.padEnd(18, ' ')).join('   ');
                    this.addOutputLine(output, paddedRow, 'candidate-terminal-line');
                }
                
                // Auto-scroll to keep content visible
                setTimeout(() => {
                    output.scrollTop = output.scrollHeight;
                }, 10);
            }
        }
    }

    // Back Button
    initializeBackButton() {
        const backBtn = document.getElementById('back-btn');
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showDepartmentsMenu();
                this.playSound('back');
            });
        }
    }

    // Show Departments Menu (for back button compatibility)
    showDepartmentsMenu() {
        // Focus back to terminal input
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.focus();
        }
    }

    // Easter Egg - Logo Click Counter
    initializeEasterEgg() {
        const logo = document.querySelector('.main-title');
        
        logo.addEventListener('click', () => {
            this.logoClickCount++;
            
            if (this.logoClickCount === 3) {
                this.triggerASCIIFireworks();
                this.logoClickCount = 0; // Reset counter
            }
        });
    }

    // ASCII Fireworks Animation
    triggerASCIIFireworks() {
        const fireworksContainer = document.createElement('div');
        fireworksContainer.className = 'fireworks';
        document.body.appendChild(fireworksContainer);

        const fireworkSymbols = ['★', '☆', '✦', '✧', '⬟', '◇', '◆', '●', '○'];
        const colors = ['#00ff00', '#00cccc', '#ffff00', '#ff6600', '#ff00ff'];

        // Create multiple fireworks
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.textContent = fireworkSymbols[Math.floor(Math.random() * fireworkSymbols.length)];
                firework.style.color = colors[Math.floor(Math.random() * colors.length)];
                firework.style.left = Math.random() * window.innerWidth + 'px';
                firework.style.top = Math.random() * window.innerHeight + 'px';
                
                fireworksContainer.appendChild(firework);

                // Remove firework after animation
                setTimeout(() => {
                    firework.remove();
                }, 2000);
            }, i * 200);
        }

        // Remove container after all animations
        setTimeout(() => {
            fireworksContainer.remove();
        }, 5000);

        this.playSound('fireworks');
    }

    // Sound Effects (Web Audio API)
    addSoundEffects() {
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.sounds = {
            hover: () => this.generateBeep(800, 0.1, 0.1),
            select: () => this.generateBeep(1200, 0.2, 0.2),
            reveal: () => this.generateBeep(600, 0.15, 0.1),
            back: () => this.generateBeep(400, 0.3, 0.2),
            fireworks: () => this.generateFireworksSound()
        };
    }

    generateBeep(frequency, duration, volume) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    generateFireworksSound() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.generateBeep(Math.random() * 800 + 400, 0.3, 0.3);
            }, i * 100);
        }
    }

    playSound(soundName) {
        try {
            if (this.sounds[soundName]) {
                this.sounds[soundName]();
            }
        } catch (error) {
            // Silently handle audio errors
            console.log('Audio not available');
        }
    }

    // Terminal Log Animation
    startTerminalLog() {
        const logLines = document.querySelectorAll('.log-line');
        
        logLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '0';
                line.style.transform = 'translateX(-20px)';
                line.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateX(0)';
                }, 100);
            }, index * 500 + 3000); // Start after initial animations
        });
    }

    // Keyboard Navigation
    initializeKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isResultsVisible && e.key === 'Escape') {
                this.showDepartmentsMenu();
                return;
            }
        });
    }
}

// Initialize the portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portal = new RecruitmentPortal();
    
    // Add some additional interactive elements
    document.addEventListener('mousemove', (e) => {
        // Subtle cursor trail effect
        if (Math.random() < 0.1) {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: #00ff00;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                pointer-events: none;
                z-index: 1000;
                opacity: 0.7;
                transition: opacity 1s ease;
            `;
            document.body.appendChild(trail);
            
            setTimeout(() => {
                trail.style.opacity = '0';
                setTimeout(() => trail.remove(), 1000);
            }, 100);
        }
    });

    // Add random terminal glitch effects
    setInterval(() => {
        if (Math.random() < 0.05) { // 5% chance every 2 seconds
            const glitchElements = document.querySelectorAll('.terminal-window, .terminal-footer');
            const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
            
            randomElement.style.animation = 'glitch 0.3s ease-in-out';
            setTimeout(() => {
                randomElement.style.animation = '';
            }, 300);
        }
    }, 2000);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

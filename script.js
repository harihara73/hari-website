// Initialize AOS Animations
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-out-cubic',
    });

    // Animate Counters
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };

            // Observer to start animation when in view
            const observer = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting) {
                    updateCount();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    };
    
    animateCounters();

    // Magnetic Button Effect
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });
        
        btn.addEventListener('mouseout', function(e) {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .project-card, .service-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(0, 240, 255, 0.05)';
                cursorOutline.style.borderColor = 'rgba(0, 240, 255, 0.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorOutline.style.borderColor = 'rgba(138, 43, 226, 0.5)';
            });
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Toggle Nav
            navLinks.classList.toggle('nav-active');
            document.body.classList.toggle('no-scroll');

            // Animate Links
            navItems.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            menuToggle.classList.toggle('toggle');
        });

        // Close menu when clicking on a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                menuToggle.classList.remove('toggle');
                document.body.classList.remove('no-scroll');
                navItems.forEach(link => link.style.animation = '');
            });
        });
    }

    // Escape Logo Interaction
    const heroLogo = document.querySelector('.hero-logo');
    const logoShifter = document.querySelector('.logo-shifter');
    
    if (heroLogo && logoShifter) {
        let currentCorner = -1;
        let clickCount = 0;
        
        heroLogo.addEventListener('click', () => {
            clickCount++;
            
            if (clickCount % 4 === 0) {
                // Return to middle on 4th click
                logoShifter.style.transform = `translate(0, 0) scale(1) rotate(0deg)`;
                currentCorner = -1;
            } else {
                // Move to corners
                const offset = 110; 
                const positions = [
                    { x: -offset, y: -offset }, // Top Left
                    { x: offset, y: -offset },  // Top Right
                    { x: offset, y: offset },   // Bottom Right
                    { x: -offset, y: offset }   // Bottom Left
                ];

                let newCorner;
                do {
                    newCorner = Math.floor(Math.random() * 4);
                } while (newCorner === currentCorner);
                
                currentCorner = newCorner;
                const pos = positions[currentCorner];

                logoShifter.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(0.9) rotate(${Math.random() * 40 - 20}deg)`;
            }
        });
    }

    // Initialize Particles.js
    if (window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 40,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": ["#00f0ff", "#8a2be2", "#ffffff"] },
                "shape": { "type": "circle" },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": { "enable": false }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.1,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }
});

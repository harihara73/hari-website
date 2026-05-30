// Initialize AOS Animations
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true,
        offset: 50,
        duration: 700,
        easing: 'ease-out-cubic',
    });

    // ── Counter Animation (requestAnimationFrame, no DOM read in loop) ──────────
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // ms
        let startTime = null;
        let animating = false;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = target;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animating) {
                animating = true;
                requestAnimationFrame(step);
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        observer.observe(counter);
    });

    // ── Magnetic Button Effect (cache rect, avoid layout thrash) ────────────────
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        let rect = btn.getBoundingClientRect();

        // Update rect only on resize (not every mousemove)
        const updateRect = () => { rect = btn.getBoundingClientRect(); };
        window.addEventListener('resize', updateRect, { passive: true });

        btn.addEventListener('mousemove', (e) => {
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
        }, { passive: true });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            // Refresh rect after leaving
            updateRect();
        });
    });

    // ── Custom Cursor (rAF-based, GPU-composited via transform) ─────────────────
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        let rafId = null;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly via transform (GPU layer)
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

            if (!rafId) {
                rafId = requestAnimationFrame(animateOutline);
            }
        }, { passive: true });

        const lerpFactor = 0.18;

        function animateOutline() {
            outlineX += (mouseX - outlineX) * lerpFactor;
            outlineY += (mouseY - outlineY) * lerpFactor;

            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;

            const dx = mouseX - outlineX;
            const dy = mouseY - outlineY;
            // Keep looping only while cursor is still moving
            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                rafId = requestAnimationFrame(animateOutline);
            } else {
                rafId = null;
            }
        }

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .project-card, .service-card, .pricing-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hover');
            });
        });
    }

    // ── Mobile Menu Toggle ───────────────────────────────────────────────────────
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            document.body.classList.toggle('no-scroll');
            menuToggle.classList.toggle('toggle');

            navItems.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                menuToggle.classList.remove('toggle');
                document.body.classList.remove('no-scroll');
                navItems.forEach(link => link.style.animation = '');
            });
        });
    }

    // ── Hero Logo Escape Interaction ─────────────────────────────────────────────
    const heroLogo = document.querySelector('.hero-logo');
    const logoShifter = document.querySelector('.logo-shifter');

    if (heroLogo && logoShifter) {
        let currentCorner = -1;
        let clickCount = 0;

        heroLogo.addEventListener('click', () => {
            clickCount++;

            if (clickCount % 4 === 0) {
                logoShifter.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
                currentCorner = -1;
            } else {
                const offset = 110;
                const positions = [
                    { x: -offset, y: -offset },
                    { x: offset, y: -offset },
                    { x: offset, y: offset },
                    { x: -offset, y: offset }
                ];

                let newCorner;
                do { newCorner = Math.floor(Math.random() * 4); }
                while (newCorner === currentCorner);

                currentCorner = newCorner;
                const pos = positions[currentCorner];
                logoShifter.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(0.9) rotate(${Math.random() * 40 - 20}deg)`;
            }
        });
    }

    // ── Particles.js ────────────────────────────────────────────────────────────
    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 30, density: { enable: true, value_area: 900 } },
                color: { value: ['#C9A84C', '#E8D16A', '#1A1A2E'] },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.18,
                    random: true,
                    anim: { enable: false }
                },
                size: {
                    value: 2.5,
                    random: true,
                    anim: { enable: false }
                },
                line_linked: {
                    enable: true,
                    distance: 140,
                    color: '#C9A84C',
                    opacity: 0.07,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 0.7,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: false },
                    resize: true
                },
                modes: {
                    grab: { distance: 120, line_linked: { opacity: 0.35 } }
                }
            },
            retina_detect: false
        });
    }
});

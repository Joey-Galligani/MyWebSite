/**
 * Main JavaScript file for Joey Galligani's portfolio website.
 * Handles navigation, animations, and interactive elements.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initCursorGlow();
    initCustomCursor();
    initScrollProgress();
    initSplitText();
    initMagneticButtons();
    initTiltCards();
    initHeroParallax();
    initContactForm();
    initAnimations();
    initLanguageSwitcher();
});

/**
 * Initialize navigation functionality including mobile menu toggle
 * and smooth scrolling for anchor links.
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll-triggered effects and animations
 * using Intersection Observer API.
 */
function initScrollEffects() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const targets = document.querySelectorAll(
        '.skill-card, .timeline-item, .education-item, .highlight, .contact-method, .section-header, .section-title, .about-text > *, .education'
    );
    targets.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s var(--easing-out, ease), transform 0.8s var(--easing-out, ease);
        }
        .reveal.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 80}ms`;
    });

    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 120}ms`;
    });

    document.querySelectorAll('.education-item, .highlight, .contact-method').forEach((item, index) => {
        item.style.transitionDelay = `${index * 80}ms`;
    });
}

/**
 * Initialize the cursor glow effect that follows the mouse pointer.
 */
function initCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.opacity = '0.15';
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }
}

/**
 * Initialize contact form handling with validation
 * and submission feedback.
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `
            <span>Ouverture de votre messagerie...</span>
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32">
                    <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 400));

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const mailtoLink = `mailto:galliganijoey@gmail.com?subject=${encodeURIComponent(data.subject || 'Contact depuis le site')}&body=${encodeURIComponent(
            `Nom: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
        )}`;
        
        window.location.href = mailtoLink;
        
        submitBtn.innerHTML = `
            <span>Votre messagerie va s'ouvrir</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 6l-10 7L2 6"/>
            </svg>
        `;
        submitBtn.style.background = 'var(--color-primary)';

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            form.reset();
        }, 3000);
    });

    form.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

/**
 * Initialize additional animations for interactive elements.
 */
function initAnimations() {
    const terminalLines = document.querySelectorAll('.terminal-line, .terminal-output');
    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-10px)';
        line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        line.style.transitionDelay = `${index * 0.2}s`;
    });

    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lines = entry.target.querySelectorAll('.terminal-line, .terminal-output');
                lines.forEach(line => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateX(0)';
                });
            }
        });
    }, { threshold: 0.3 });

    const terminal = document.querySelector('.terminal');
    if (terminal) {
        terminalObserver.observe(terminal);
    }

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });

}

/**
 * Utility function to check if element is in viewport.
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Custom cursor with smooth follower ring and dot, plus hover state
 * on interactive elements. Falls back gracefully on touch devices.
 */
function initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function animate() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
    }
    animate();

    const hoverables = 'a, button, .skill-card, .timeline-content, .education-item, .contact-method, .marquee-item, .terminal, [data-tilt]';
    document.querySelectorAll(hoverables).forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
    });
}

/**
 * Update the top scroll progress bar based on current scroll position.
 */
function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress span');
    if (!bar) return;

    let ticking = false;
    function update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
    update();
}

/**
 * Split text nodes marked with `data-split` into per-character spans
 * to enable staggered reveal animations.
 */
function initSplitText() {
    document.querySelectorAll('[data-split]').forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        const chars = Array.from(text);
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.className = char === ' ' ? 'char char--space' : 'char';
            span.style.setProperty('--char-index', index);
            span.textContent = char === ' ' ? '\u00A0' : char;
            el.appendChild(span);
        });
    });
}

/**
 * Add a subtle magnetic pull effect on hover for elements with
 * `data-magnetic`. The element follows the cursor with a small offset.
 */
function initMagneticButtons() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const strength = 0.25;
    const elements = document.querySelectorAll('[data-magnetic]');

    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

/**
 * Tilt 3D effect on cards marked with `data-tilt`. Also drives a
 * dynamic radial highlight that follows the mouse position.
 */
function initTiltCards() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const maxTilt = 6;
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const px = x / rect.width;
            const py = y / rect.height;
            const rotateY = (px - 0.5) * (maxTilt * 2);
            const rotateX = (0.5 - py) * (maxTilt * 2);
            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/**
 * Subtle parallax movement on hero aurora blobs based on cursor and
 * scroll position. Disabled on touch devices for performance.
 */
function initHeroParallax() {
    const auroras = document.querySelectorAll('.aurora');
    if (auroras.length === 0) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    if (window.matchMedia('(pointer: fine)').matches) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            auroras.forEach((aurora, i) => {
                const depth = (i + 1) * 20;
                aurora.style.translate = `${x * depth}px ${y * depth}px`;
            });
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroVisual = document.querySelector('.hero-visual');
                if (heroVisual && scrollY < window.innerHeight) {
                    heroVisual.style.transform = `translateY(${scrollY * 0.12}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Initialize language switcher functionality.
 * Handles FR/EN translations with localStorage persistence.
 */
function initLanguageSwitcher() {
    const langSwitch = document.getElementById('langSwitch');
    const langCurrent = langSwitch?.querySelector('.lang-switch-current');
    
    if (!langSwitch || !langCurrent) return;
    
    // Get saved language or default to French
    let currentLang = localStorage.getItem('site-lang') || 'fr';
    
    // Apply saved language on load
    applyTranslations(currentLang);
    updateLangButton(currentLang);
    
    // Handle language switch
    langSwitch.addEventListener('click', () => {
        currentLang = currentLang === 'fr' ? 'en' : 'fr';
        localStorage.setItem('site-lang', currentLang);
        applyTranslations(currentLang);
        updateLangButton(currentLang);
    });
    
    function updateLangButton(lang) {
        langCurrent.textContent = lang.toUpperCase();
        document.documentElement.lang = lang;
    }
    
    function applyTranslations(lang) {
        if (typeof translations === 'undefined') {
            console.warn('Translations not loaded');
            return;
        }
        
        const trans = translations[lang];
        if (!trans) return;
        
        // Apply text translations
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (trans[key]) {
                el.textContent = trans[key];
            }
        });
        
        // Apply HTML translations (for elements with <br>, <li>, <strong>, etc.)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (trans[key]) {
                el.innerHTML = trans[key];
            }
        });
    }
}

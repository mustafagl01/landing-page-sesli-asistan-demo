// ===== Mobile Detection =====
const isMobile = window.innerWidth < 768;

// ===== Mouse Spotlight Effect (Desktop Only) =====
const spotlight = document.getElementById('spotlight');
let mouseX = 0, mouseY = 0;
let spotlightX = 0, spotlightY = 0;

if (!isMobile && spotlight) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update CSS variables for card hover effects
        document.querySelectorAll('.glass-card, .feature-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // Smooth spotlight animation
    function animateSpotlight() {
        spotlightX += (mouseX - spotlightX) * 0.1;
        spotlightY += (mouseY - spotlightY) * 0.1;

        spotlight.style.left = `${spotlightX}px`;
        spotlight.style.top = `${spotlightY}px`;

        requestAnimationFrame(animateSpotlight);
    }

    animateSpotlight();
} else if (spotlight) {
    spotlight.style.display = 'none';
}

// ===== Particle System - ENHANCED =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let connections = [];

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
});

// Particle class with enhanced effects
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.color = this.getRandomColor();
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    getRandomColor() {
        const colors = [
            '6, 182, 212',  // turquoise
            '59, 130, 246', // blue
            '139, 92, 246', // purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(time) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Pulse effect
        this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.2;

        // Mouse interaction - stronger effect (Desktop only)
        if (!isMobile && mouseX !== 0 && mouseY !== 0) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                const force = (200 - distance) / 200;
                const angle = Math.atan2(dy, dx);

                this.x -= Math.cos(angle) * force * 3;
                this.y -= Math.sin(angle) * force * 3;

                // Increase size and glow near mouse
                this.currentSize = this.size + force * 3;
                this.currentOpacity += force * 0.3;
            } else {
                this.currentSize = this.size;
            }
        } else {
            this.currentSize = this.size;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, this.currentOpacity)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowColor = `rgba(${this.color}, 0.5)`;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Create particles
function createParticles() {
    particles = [];
    // Mobile: fewer particles for better performance
    const particleCount = isMobile
        ? Math.min(50, Math.floor((canvas.width * canvas.height) / 25000))
        : Math.min(150, Math.floor((canvas.width * canvas.height) / 12000));

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

createParticles();

// Draw connecting lines with gradient
function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const opacity = (150 - distance) / 150 * 0.25;
                const gradient = ctx.createLinearGradient(
                    particles[i].x, particles[i].y,
                    particles[j].x, particles[j].y
                );
                gradient.addColorStop(0, `rgba(${particles[i].color}, ${opacity})`);
                gradient.addColorStop(1, `rgba(${particles[j].color}, ${opacity})`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Draw lines to mouse with glow effect
        if (mouseX !== 0 && mouseY !== 0) {
            const dx = particles[i].x - mouseX;
            const dy = particles[i].y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                const opacity = (200 - distance) / 200 * 0.4;

                ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                ctx.lineWidth = 2;
                ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }
}

// Animation loop with time
let startTime = Date.now();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const time = (Date.now() - startTime) / 1000;

    particles.forEach(particle => {
        particle.update(time);
        particle.draw();
    });

    drawLines();
    requestAnimationFrame(animate);
}

animate();

// ===== Header Scroll Effect =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== Count-up Animation - ENHANCED =====
function animateCountUp(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2500;
    const startTime = Date.now();
    const startValue = 0;

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

        element.textContent = currentValue;

        // Add glow pulse during animation
        if (progress < 1) {
            element.style.textShadow = `0 0 ${30 + progress * 30}px rgba(6, 182, 212, ${0.5 + progress * 0.5})`;
            requestAnimationFrame(update);
        } else {
            element.style.textShadow = '0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(6, 182, 212, 0.5)';
        }
    }

    update();
}

// ===== Scroll Animations - ENHANCED =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
                entry.target.classList.add('animate');

                // Trigger count-up animations
                if (entry.target.classList.contains('count-up')) {
                    animateCountUp(entry.target);
                }
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

// Start count-up animations for hero section on page load
setTimeout(() => {
    document.querySelectorAll('.hero .count-up').forEach((el, index) => {
        setTimeout(() => {
            animateCountUp(el);
        }, index * 200);
    });
}, 600);

// ===== Form Submission =====
const form = document.getElementById('demoForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = form.querySelector('.btn-submit');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        timestamp: new Date().toISOString(),
        source: 'landing_page'
    };

    try {
        // Send to n8n webhook
        const response = await fetch('https://nt3ys1ml.rpcd.host/webhook/6a7c3c99-b1fb-4483-bcba-18bdcdfad599', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Track lead event
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'Demo Talep',
                    content_category: formData.service
                });
            }

            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';

            // Trigger enhanced confetti
            createSuperConfetti();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        btnText.style.display = 'inline-flex';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// ===== Super Confetti Animation =====
function createSuperConfetti() {
    const confettiCount = 150;
    const confettiElements = [];
    const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 12 + 6;

        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: 50%;
            top: 50%;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
        `;
        document.body.appendChild(confetti);

        confettiElements.push({
            element: confetti,
            x: 0,
            y: 0,
            vx: (Math.random() - 0.5) * 35,
            vy: (Math.random() - 1) * 35 - 10,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            gravity: 0.5,
            friction: 0.99
        });
    }

    let animationFrame;
    let startTime = Date.now();

    function animateConfetti() {
        const elapsed = Date.now() - startTime;

        if (elapsed > 4000) {
            confettiElements.forEach(c => c.element.remove());
            return;
        }

        confettiElements.forEach(confetti => {
            confetti.x += confetti.vx;
            confetti.y += confetti.vy;
            confetti.vy += confetti.gravity;
            confetti.vx *= confetti.friction;
            confetti.vy *= confetti.friction;
            confetti.rotation += confetti.rotationSpeed;

            const scale = 1 - (elapsed / 4000) * 0.5;
            const opacity = 1 - (elapsed / 4000);

            confetti.element.style.transform = `
                translate(${confetti.x}px, ${confetti.y}px)
                rotate(${confetti.rotation}deg)
                scale(${scale})
            `;
            confetti.element.style.opacity = opacity;
        });

        animationFrame = requestAnimationFrame(animateConfetti);
    }

    animateConfetti();
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Animate hero cards on load with stagger
    document.querySelectorAll('.glass-card').forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate');
        }, 400 + index * 150);
    });

    // Add parallax effect to hero image (Desktop only)
    const heroImage = document.querySelector('.floating-image');
    if (heroImage && !isMobile) {
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
            heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    // Add entrance animation for stats
    const countUps = document.querySelectorAll('.count-up');
    countUps.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.5)';
    });

    setTimeout(() => {
        countUps.forEach(el => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
        });
    }, 500);
});

// ===== Magnetic Button Effect (Desktop only) =====
if (!isMobile) {
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// ===== Input Focus Glow Effect =====
document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Reduce particle count when tab is hidden
        particles = particles.slice(0, 20);
    } else {
        createParticles();
    }
});

const demoForm = document.getElementById('demoForm');
const successMessage = document.getElementById('successMessage');
const positionWarning = document.getElementById('positionWarning');
const startLiveTestButton = document.getElementById('start-live-test');
const liveTestWebhookUrl = 'https://nt3ys1ml.rpcd.host/webhook/6a7c3c99-b1fb-4483-bcba-18bdcdfad599';

function safeFbq(...args) {
    if (typeof window.fbq === 'function') {
        window.fbq(...args);
    }
}

if (startLiveTestButton) {
    startLiveTestButton.addEventListener('click', () => {
        safeFbq('trackCustom', 'StartLiveTest');
    });
}

if (demoForm) {
    demoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const isValid = demoForm.checkValidity();
        if (!isValid) {
            demoForm.reportValidity();
            return;
        }

        const positionValue = document.getElementById('position').value;

        if (positionValue === 'Diğer') {
            positionWarning.textContent = 'Sistem klinik sahipleri/yöneticiler için optimize edilmiştir.';
            positionWarning.hidden = false;
        } else {
            positionWarning.hidden = true;
            positionWarning.textContent = '';
        }

        safeFbq('track', 'Lead');

        const data = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            clinic: document.getElementById('clinic').value,
            position: positionValue,
            monthlyLeads: document.getElementById('monthlyLeads').value
        };

        try {
            await fetch(liveTestWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                mode: 'no-cors'
            });
        } catch (error) {
            console.error('Webhook gönderimi başarısız oldu:', error);
        }

        successMessage.textContent = 'Birkaç saniye içerisinde asistanımız sizi arayacaktır. Lütfen telefonunuzu kontrol ediniz.';
        successMessage.hidden = false;

        demoForm.reset();
    });
}

/* Güncellenen dosyalar: index.html, style.css, script.js | Eklenen ana bölümler: responsive hero (<picture>), eleme bloğu, 4 ikonlu özellikler bölümü, lead kalitesi odaklı demo formu, Meta Pixel + event bağları. */

// Initialize AOS Animations
document.addEventListener('DOMContentLoaded', function () {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    // Initialize Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#2f80ff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#2f80ff",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": { "enable": true, "speed": 2 }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": { "enable": true, "mode": ["grab", "repulse"] },
                    "onclick": { "enable": true, "mode": "push" }
                },
                "modes": {
                    "grab": { "distance": 200, "line_linked": { "opacity": 0.5 } },
                    "repulse": { "distance": 150, "duration": 0.4 }
                }
            },
            "retina_detect": true
        });
    }
});

// Calling Overlay Logic
function closeOverlay() {
    const overlay = document.getElementById('callingOverlay');
    if (overlay) overlay.classList.remove('active');
}

// Lock Screen Logic
function unlockPhone() {
    const lockScreen = document.getElementById('lockScreen');
    if (lockScreen) {
        lockScreen.classList.add('unlocked');
    }
}

// Update Clock (Fixed for Demo Scenario: 03:14 AM)
function updateClock() {
    const timeString = "03:14";

    const clockTime = document.getElementById('clockTime');
    const clockDate = document.getElementById('clockDate');

    if (clockTime) clockTime.textContent = timeString;

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const demoDate = new Date(); // Keeping current date but can be hardcoded too
    if (clockDate) clockDate.textContent = demoDate.toLocaleDateString('tr-TR', options);
}

// Flashlight Logic
let isFlashlightOn = false;
const spotlight = document.getElementById('spotlight');

function toggleFlashlight(e) {
    if (e) e.stopPropagation();
    isFlashlightOn = !isFlashlightOn;

    document.body.classList.toggle('flashlight-on', isFlashlightOn);

    // Sync all flashlight buttons
    const buttons = [document.getElementById('lockFlashlight'), document.getElementById('homeFlashlight')];
    buttons.forEach(btn => {
        if (btn) btn.classList.toggle('active', isFlashlightOn);
    });
}

// Mouse Follow for Spotlight
document.addEventListener('mousemove', (e) => {
    if (!isFlashlightOn) return;
    const x = e.clientX;
    const y = e.clientY;
    spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, transparent 150px, rgba(0, 0, 0, 0.9) 350px)`;
});

// Run clock immediately and every minute
updateClock();
setInterval(updateClock, 60000);

if (demoForm) {
    demoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const isValid = demoForm.checkValidity();
        if (!isValid) {
            demoForm.reportValidity();
            return;
        }

        // Show Calling Overlay instantly
        const overlay = document.getElementById('callingOverlay');
        if (overlay) overlay.classList.add('active');

        const positionValue = document.getElementById('position').value;

        if (positionValue === 'Diğer') {
            positionWarning.textContent = 'Sistem klinik sahipleri/yöneticiler için optimize edilmiştir.';
            positionWarning.hidden = false;
        } else {
            positionWarning.hidden = true;
            positionWarning.textContent = '';
        }

        safeFbq('track', 'Lead');

        const data = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            clinic: document.getElementById('clinic').value,
            position: positionValue,
            monthlyLeads: document.getElementById('monthlyLeads').value
        };

        try {
            await fetch(liveTestWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                mode: 'no-cors'
            });
        } catch (error) {
            console.error('Webhook gönderimi başarısız oldu:', error);
        }

        successMessage.textContent = 'Birkaç saniye içerisinde asistanımız sizi arayacaktır. Lütfen telefonunuzu kontrol ediniz.';
        successMessage.hidden = false;

        demoForm.reset();
    });
}


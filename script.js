const demoForm = document.getElementById('demoForm');
const successMessage = document.getElementById('successMessage');
const positionWarning = document.getElementById('positionWarning');
const startLiveTestButton = document.getElementById('start-live-test');

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
    demoForm.addEventListener('submit', (event) => {
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

        successMessage.textContent = 'Teşekkürler! Talebiniz başarıyla alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.';
        successMessage.hidden = false;

        demoForm.reset();
    });
}

/* Güncellenen dosyalar: index.html, style.css, script.js | Eklenen ana bölümler: responsive hero (<picture>), eleme bloğu, 4 ikonlu özellikler bölümü, lead kalitesi odaklı demo formu, Meta Pixel + event bağları. */

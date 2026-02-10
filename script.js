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

        const payload = {
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
                body: JSON.stringify(payload),
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

// Contact form handling with Formspree
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(contactForm);
                
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showMessage('success', 'Message sent successfully! I\'ll get back to you soon.');
                    contactForm.reset();
                } else {
                    showMessage('error', 'Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('error', 'An error occurred. Please try again later or email directly.');
            }
        });
    }
    
    function showMessage(type, message) {
        formMessage.className = `form-message ${type}`;
        formMessage.textContent = message;
        
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
});

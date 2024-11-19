// Configure the contact form
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Get Formspree ID from config
    if (!config || !config.formspreeId) {
        console.error('Formspree ID not configured');
        return;
    }

    // Set up the form
    contactForm.setAttribute('action', `https://formspree.io/f/${config.formspreeId}`);
    contactForm.setAttribute('method', 'POST');
    
    // Add form submission handling
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const response = await fetch(`https://formspree.io/f/${config.formspreeId}`, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('Message sent successfully!');
                this.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was a problem sending your message. Please try again.');
        }
    });

    // Smooth scrolling functionality
    if (window.location.hash === '#contact') {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    document.querySelectorAll('a[href="#contact"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

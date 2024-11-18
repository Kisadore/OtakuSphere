// Load environment variables
// const formspreeId = 'xdkodezd';
const formspreeId = import.meta.env.VITE_FORMSPREE_ID;

// Configure the contact form
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    // Get the Formspree ID from environment variables
    const formspreeId = import.meta.env.VITE_FORMSPREE_ID;

    if (!formspreeId) {
        console.error('Formspree ID is not configured in environment variables');
        return;
    }

    if (contactForm) {
        // Set the form action URL and method
        contactForm.setAttribute('action', `https://formspree.io/f/${formspreeId}`);
        contactForm.setAttribute('method', 'POST');
        
        // Add form submission handling
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
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
    }

    // Check if the URL has a hash
    if (window.location.hash === '#contact') {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            // Smooth scroll to contact section
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Handle internal links to contact section
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

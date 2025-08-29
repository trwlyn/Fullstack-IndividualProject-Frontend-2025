// API URLs - update with your Azure deployed backend URL
const API_BASE_URL = 'https://your-azure-container-app-name.azurecontainerapps.io/api';

document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const form = document.getElementById('contactForm');
    
    // Form submission handler
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Validate form
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }
            
            // Disable submit button to prevent multiple submissions
            const submitButton = document.getElementById('submitBtn');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            
            // Get form data
            const name = document.getElementById('clientName').value;
            const email = document.getElementById('clientEmail').value;
            const phone = document.getElementById('clientPhone').value;
            const selectedPackage = document.getElementById('selectedPackage').value;
            const message = document.getElementById('clientMessage').value;
            const subscribeNewsletter = document.getElementById('newsletter').checked;
            
            // Create subject line from the selected package
            const packageText = document.getElementById('selectedPackage').options[document.getElementById('selectedPackage').selectedIndex].text;
            const subject = `Inquiry about ${packageText}`;
            
            // Prepare message with all details
            const fullMessage = `
Package: ${packageText}
Phone: ${phone || 'Not provided'}

Message:
${message || 'No additional message provided.'}
            `;
            
            try {
                // Send contact form data
                const contactResponse = await fetch(`${API_BASE_URL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        message: fullMessage
                    })
                });
                
                if (!contactResponse.ok) {
                    const errorData = await contactResponse.json().catch(() => null);
                    throw new Error(errorData?.detail || 'Failed to submit contact form');
                }
                
                // If user subscribed to newsletter, send that request too
                if (subscribeNewsletter) {
                    const newsletterResponse = await fetch(`${API_BASE_URL}/newsletter-subscribe`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(email)
                    });
                    
                    if (!newsletterResponse.ok) {
                        console.warn('Newsletter subscription failed, but contact form was submitted');
                    }
                }
                
                // Show success modal
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
                
                // Reset form
                form.reset();
                form.classList.remove('was-validated');
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert(`There was an error submitting your form: ${error.message}. Please try again later.`);
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Inquiry';
            }
        });
    }
});

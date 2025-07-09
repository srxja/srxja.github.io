document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const introContainer = document.getElementById('intro-text-container');
    const formContainer = document.getElementById('contact-form-container');
    const confirmationMessage = document.getElementById('confirmation-message');

    if (!form || !introContainer || !formContainer || !confirmationMessage) {
        console.error('One or more contact page elements are missing. Check IDs.');
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const sendButton = form.querySelector('.send-btn');
        sendButton.disabled = true;
        sendButton.textContent = 'Sending...';

        const formData = new FormData(form);
        const action = form.getAttribute('action');

        fetch(action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                // --- THE ANIMATION SEQUENCE ---

                // 1. Hide the "Hit Me Up!" intro text
                introContainer.classList.add('fade-out');
                
                // 2. Hide the form itself
                formContainer.classList.add('fade-out');

                // 3. After the fade-out is complete, show the confirmation
                setTimeout(() => {
                    // Use 'display: none' to remove the form from the layout
                    introContainer.style.display = 'none';
                    formContainer.style.display = 'none';

                    // Make the confirmation message visible
                    confirmationMessage.classList.remove('hidden');
                    // Add a slight delay before triggering the fade-in for a smoother effect
                    setTimeout(() => {
                      confirmationMessage.classList.add('visible');
                    }, 50);

                }, 500); // This duration matches the CSS transition

            } else {
                // Handle submission error
                response.json().then(data => {
                    alert('There was a problem. Please try again.');
                });
                // Re-enable the form
                sendButton.disabled = false;
                sendButton.textContent = 'Send Message';
            }
        }).catch(error => {
            // Handle network error
            alert('A network error occurred. Please check your connection and try again.');
            sendButton.disabled = false;
            sendButton.textContent = 'Send Message';
        });
    });
});

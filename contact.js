document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const formContainer = document.getElementById('contact-form-container');
    const confirmationMessage = document.getElementById('confirmation-message');

    // Make sure all elements exist before proceeding
    if (!form || !formContainer || !confirmationMessage) {
        console.error('Form elements not found. Check your contact.html IDs.');
        return;
    }

    form.addEventListener('submit', function(e) {
        // Prevent the default form submission which reloads the page
        e.preventDefault();

        // --- Phase 1: The Wind-Up (The Shine) ---
        const sendButton = form.querySelector('.send-btn');
        sendButton.disabled = true; // Disable the button
        sendButton.textContent = 'Sending...'; // Change button text
        formContainer.classList.add('glowing'); // Start the glow animation

        // Get the form data
        const formData = new FormData(form);
        const action = form.getAttribute('action');

        // Send the data to Formspree using fetch
        fetch(action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // --- Phase 2: The Climax (The Explosion) ---
                // Trigger the explosion by adding the 'exploding' class
                formContainer.classList.add('exploding');

                // Wait for the explosion animation to finish
                setTimeout(() => {
                    // Hide the form container completely
                    formContainer.classList.add('hidden');

                    // --- Phase 3: The Aftermath (The Regeneration) ---
                    // Show the confirmation message
                    confirmationMessage.classList.remove('hidden');
                }, 300); // This timeout should match the CSS transition duration

            } else {
                // If something went wrong with Formspree
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Oops! There was a problem submitting your form.');
                    }
                    // Re-enable the form if there was an error
                    formContainer.classList.remove('glowing');
                    sendButton.disabled = false;
                    sendButton.textContent = 'Send Message';
                });
            }
        }).catch(error => {
            // Handle network errors
            alert('Oops! There was a network error.');
            formContainer.classList.remove('glowing');
            sendButton.disabled = false;
            sendButton.textContent = 'Send Message';
        });
    });
});

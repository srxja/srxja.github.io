document.addEventListener('DOMContentLoaded', () => {
    const headline = document.getElementById('typing-headline');
    if (!headline) return; // Exit if the element isn't on this page

    const textToType = "Welcome.";
    let i = 0;
    const typingSpeed = 150; // Milliseconds per character

    function typeWriter() {
        if (i < textToType.length) {
            headline.innerHTML += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            // Add a class to the headline when typing is done to have a solid cursor
            headline.classList.add('typing-done');
        }
    }

    // Clear the headline and start the animation
    headline.innerHTML = '';
    typeWriter();
});

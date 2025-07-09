document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillPills = document.querySelectorAll('.skill-pill');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            // Check if the button clicked is already the active one
            const isAlreadyActive = button.classList.contains('active');

            // First, remove the 'active' class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // --- THE NEW TOGGLE LOGIC ---
            if (isAlreadyActive) {
                // If it was already active, we are toggling it OFF.
                // Show all pills.
                skillPills.forEach(pill => pill.classList.remove('hide'));
            } else {
                // If it was not active, we are toggling it ON.
                // Add 'active' class to the clicked button.
                button.classList.add('active');
                
                // And filter the pills.
                skillPills.forEach(pill => {
                    const category = pill.dataset.category;
                    if (category === filter) {
                        pill.classList.remove('hide'); // Show this pill
                    } else {
                        pill.classList.add('hide'); // Hide others
                    }
                });
            }
        });
    });
});

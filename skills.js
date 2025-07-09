document.addEventListener('DOMContentLoaded', () => {
    // Select all filter buttons and skill pills
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillPills = document.querySelectorAll('.skill-pill');

    // Add click event listener to each button
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the filter category from the button's data-filter attribute
            const filter = button.dataset.filter;

            // --- Update Active Button State ---
            // Remove 'active' class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            button.classList.add('active');

            // --- Filter the Skill Pills ---
            skillPills.forEach(pill => {
                const category = pill.dataset.category;

                // If the filter is 'all' or the pill's category matches the filter
                if (filter === 'all' || category === filter) {
                    pill.classList.remove('hide'); // Show the pill
                } else {
                    pill.classList.add('hide'); // Hide the pill
                }
            });
        });
    });
});

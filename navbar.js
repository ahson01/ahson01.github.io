document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    const menuLinks = menu.querySelectorAll('a'); // Get all anchor links inside the menu

    // Set initial state
    menu.style.opacity = '0';
    menu.classList.add('hidden');

    function toggleMenu() {
        if (window.innerWidth > 800) return; // Disable on larger screens

        if (menu.classList.contains('hidden')) {
            // Show menu first
            menu.classList.remove('hidden');

            // Delay showing links slightly after opacity transition starts
            setTimeout(() => {
                menu.style.opacity = '1';
                menu.classList.add('animate-fade-to-grey');

                // Show all links immediately after the menu starts appearing
                menuLinks.forEach(link => link.style.visibility = 'visible');
            }, 10);
        } else {
            // Hide links immediately
            menuLinks.forEach(link => link.style.visibility = 'hidden');

            // Fade out menu
            menu.style.opacity = '0';
            menu.classList.remove('animate-fade-to-grey');

            setTimeout(() => {
                menu.classList.add('hidden');
            }, 300); // Wait 300ms before applying hidden
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Handle screen resizing
    window.addEventListener('resize', function () {
        if (window.innerWidth > 800) {
            // Ensure menu is visible on large screens
            menu.style.opacity = '';
            menu.classList.remove('hidden', 'animate-fade-to-grey');
            menuLinks.forEach(link => link.style.visibility = 'visible');
        } else {
            // Reset for mobile screens
            menu.style.opacity = '0';
            menu.classList.add('hidden');
            menuLinks.forEach(link => link.style.visibility = 'hidden');
        }
    });
});

// Select hamburger button and navigation bar
const hamburger = document.querySelector('.hamburger');
const navBar = document.querySelector('.nav-bar');

// Add click event listener to the hamburger button
hamburger.addEventListener('click', () => {
    navBar.classList.toggle('show'); // Toggles visibility of the navbar
});

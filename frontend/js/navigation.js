/**
 * ==========================================================
 * AEGIS-X Navigation
 * ==========================================================
 */

const links = document.querySelectorAll(".sidebar nav a");
const pages = document.querySelectorAll(".page");

links.forEach(link => {

    link.addEventListener("click", (e) => {

        e.preventDefault();

        // Active sidebar
        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        // Hide all pages
        pages.forEach(page => {

            page.classList.remove("active-page");

        });

        // Show selected page
        document
            .getElementById(link.dataset.page)
            .classList.add("active-page");

    });

});
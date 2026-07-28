/**
 * ==========================================================
 * AEGIS-X Theme Manager
 * ==========================================================
 */

const body = document.body;

const themeSwitch = document.getElementById("themeToggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {

    body.classList.add("light-mode");
    themeSwitch.checked = false;

} else {

    body.classList.remove("light-mode");
    themeSwitch.checked = true;

}

// Toggle theme
themeSwitch.addEventListener("change", () => {

    if (themeSwitch.checked) {

        body.classList.remove("light-mode");
        localStorage.setItem("theme", "dark");

    } else {

        body.classList.add("light-mode");
        localStorage.setItem("theme", "light");

    }

});
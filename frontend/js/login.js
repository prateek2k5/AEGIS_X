const API = "https://aegis-x-nibr.onrender.com";

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const errorMessage = document.getElementById("errorMessage");

// Agar pehle se login hai to direct dashboard
if (localStorage.getItem("token")) {
    window.location.href = "index.html";
}

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    errorMessage.innerText = "";

    loginBtn.disabled = true;
    loginBtn.innerText = "Logging in...";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${API}/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("username", data.username);

            window.location.href = "index.html";

        }
        else {

            errorMessage.innerText =
                data.detail || "Invalid Username or Password";

        }

    }
    catch (err) {

        errorMessage.innerText =
            "Unable to connect to server.";

    }

    loginBtn.disabled = false;
    loginBtn.innerText = "Login";

});
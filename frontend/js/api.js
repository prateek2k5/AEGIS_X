/**
 * ==========================================================
 * File        : api.js
 * Project     : AEGIS-X
 * Module      : API Layer
 *
 * Description :
 * Handles all communication with FastAPI backend.
 * ==========================================================
 */

const BASE_URL = "https://aegis-x-nibr.onrender.com";
/**
 * Generic GET request helper
 */
async function getData(endpoint) {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";

        return null;

    }

    try {

        const response = await fetch(`${BASE_URL}${endpoint}`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        // Token invalid ya expire
        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("username");

            window.location.href = "login.html";

            return null;

        }

        if (!response.ok) {

            throw new Error(`HTTP ${response.status}`);

        }

        return await response.json();

    } catch (error) {

        console.error("API Error :", error);

        return null;

    }

}

// ==========================================================
// Dashboard API
// ==========================================================

export async function getDashboard() {

    return await getData("/dashboard");

}
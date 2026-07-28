/**
 * ==========================================================
 * File        : alerts.js
 * Project     : AEGIS-X
 *
 * Description :
 * Fetches and displays recent security alerts.
 * ==========================================================
 */

const API = "https://aegis-x-nibr.onrender.com";

/**
 * Load recent alerts from backend
 */
export async function loadAlerts() {

    try {

        const response = await fetch(`${API}/alerts`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const alerts = await response.json();

        const container = document.getElementById("alertHistory");

        if (!container) return;

        container.innerHTML = "";

        if (alerts.length === 0) {

            container.innerHTML = `
                <p style="text-align:center; color:#9db2ce;">
                    No security alerts detected.
                </p>
            `;

            return;
        }

        alerts.forEach(alert => {

            let icon = "🟢";
            let borderColor = "#38d996";

            if (alert.risk === "MEDIUM") {
                icon = "🟠";
                borderColor = "#ffb347";
            }

            if (alert.risk === "HIGH") {
                icon = "🔴";
                borderColor = "#ff4d4d";
            }

            container.innerHTML += `
                <div class="alert-item"
                     style="border-left:4px solid ${borderColor};">

                    <div class="alert-time">
                        ${alert.time}
                    </div>

                    <div class="alert-risk">
                        ${icon} ${alert.risk}
                    </div>

                    <div class="alert-name">
                        ${alert.name}
                    </div>

                </div>
            `;

        });

    }

    catch (error) {

        console.error("Alert Load Error :", error);

    }

}
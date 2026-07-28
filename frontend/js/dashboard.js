/**
 * ==========================================================
 * File        : dashboard.js
 * Project     : AEGIS-X
 *
 * Description :
 * Updates dashboard using backend APIs.
 * ==========================================================
 */
import { getDashboard } from "./api.js";
import { updateChart } from "./chart.js";
import { loadAlerts } from "./alerts.js";
import { updateHealth } from "./health.js";
import { showToast } from "./toast.js";

function showError(title, message){

    const modal = document.getElementById("errorModal");

    if(!modal) return;

    document.getElementById("errorTitle").innerText = title;
    document.getElementById("errorMessage").innerText = message;

    modal.classList.add("show");
}

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

}

let lastToastPID = null;
async function loadAuditLogs() {

    try {

        const token = localStorage.getItem("token");
        const response = await fetch("https://aegis-x-nibr.onrender.com",
             {
            method: "POST",
            headers: {
                 Authorization: `Bearer ${token}`
                }
            });

        const data = await response.json();

        const container = document.getElementById("auditLogs");

        if (!container) return;

        container.innerHTML = "";

        if (data.logs.length === 0) {

            container.innerHTML = "<p>No audit logs available.</p>";

            return;

        }

        data.logs.forEach(log => {

            container.innerHTML += `
                <div class="audit-item">
                    ${log}
                </div>
            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}
async function updateDashboard() {

    let dashboard;

try{

    dashboard = await getDashboard();

}catch(err){

    showError(
        "⚠ Backend Offline",
        "Unable to connect to FastAPI server.\n\nPlease start the backend and try again."
    );

    return;
}

if(!dashboard) return;
    if (!dashboard) return;

    const cpu = dashboard.cpu;
    const memory = dashboard.memory;
    const disk = dashboard.disk;
    const processes = dashboard.processes;
    const network = dashboard.network;

    let high = 0;
    let medium = 0;

    processes.forEach(p => {
        if (p.risk === "HIGH") high++;
        if (p.risk === "MEDIUM") medium++;
    });

    const riskScore = Math.min(
        100,
        Math.round(
            cpu.cpu_usage_percent * 0.35 +
            memory.usage_percent * 0.25 +
            disk.usage_percent * 0.15 +
            high * 12 +
            medium * 5
        )
    );

    let threat = "LOW";

    if (riskScore >= 80)
        threat = "CRITICAL";
    else if (riskScore >= 60)
        threat = "HIGH";
    else if (riskScore >= 40)
        threat = "MEDIUM";

    const confidence = Math.min(
        99,
        70 + high * 8 + medium * 3
    );

    const incidents = high + medium;

    if (cpu) {
        document.getElementById("cpuUsage").innerText =
            cpu.cpu_usage_percent + "%";

        document.getElementById("cpuBar").style.width =
            cpu.cpu_usage_percent + "%";
    }

    if (memory) {
        document.getElementById("memoryUsage").innerText =
            memory.usage_percent + "%";

        document.getElementById("memoryBar").style.width =
            memory.usage_percent + "%";
    }

    if (disk) {
        document.getElementById("diskUsage").innerText =
            disk.usage_percent + "%";

        document.getElementById("diskBar").style.width =
            disk.usage_percent + "%";
    }

    if (network) {
        document.getElementById("networkUsage").innerText =
            `${network.bytes_sent_mb.toFixed(1)} ↑ / ${network.bytes_received_mb.toFixed(1)} ↓`;
        document.getElementById("riskScore").innerText =
        riskScore + " / 100";
    }
    document.getElementById("threatLevel").innerText =
        threat;

    document.getElementById("aiConfidence").innerText =
        confidence + "%";

    document.getElementById("activeIncidents").innerText =
        incidents;

    /* ==========================================================
       Threat Level Color
    ========================================================== */

    const threatElement = document.getElementById("threatLevel");

    if (threat === "LOW") {
        threatElement.style.color = "#22c55e";   // Green
    }
    else if (threat === "MEDIUM") {
        threatElement.style.color = "#eab308";   // Yellow
    }
    else if (threat === "HIGH") {
        threatElement.style.color = "#f97316";   // Orange
    }
    else {
        threatElement.style.color = "#ef4444";   // Red
    }
   
    loadProcesses(processes,confidence);
    await loadAuditLogs();
    updateChart(cpu.cpu_usage_percent);
    updateHealth(cpu, memory, disk, processes);
    loadAlerts();

    /* Last Refresh Time */
    document.getElementById("lastUpdated").innerText =
        "Last Updated: " + new Date().toLocaleTimeString("en-IN");
}

/* ==========================================================
   Logged-in User
========================================================== */

const username = localStorage.getItem("username") || "Admin";

const usernameElement = document.getElementById("usernameDisplay");

if (usernameElement) {
    usernameElement.textContent = username;
}

updateDashboard();
/**
 * Load running processes from backend
 */
function loadProcesses(processes, confidence) {

    const tbody = document.querySelector("#processTable tbody");
    const incidentContainer = document.getElementById("incidentContainer");

    tbody.innerHTML = "";
    incidentContainer.innerHTML = "";

    let highestRisk = null;
    let incidentNumber = 1;

    processes.forEach(process => {

        let riskIcon = "🟢";

        if (process.risk === "MEDIUM")
            riskIcon = "🟠";

        if (process.risk === "HIGH")
            riskIcon = "🔴";

        // ===========================
        // Process Table
        // ===========================

        tbody.innerHTML += `
            <tr>
                <td>${process.pid}</td>
                <td>${process.name}</td>
                <td>${process.cpu}%</td>
                <td>${process.memory_mb} MB</td>
                <td>${riskIcon} ${process.risk}</td>
            </tr>
        `;

        // ===========================
        // Incident Cards
        // ===========================

        if (process.risk === "HIGH" || process.risk === "MEDIUM") {

            incidentContainer.innerHTML += `

            <div class="incident-card">

                <h3 class="incident-header">
                <span>🚨 INC-${String(incidentNumber).padStart(4, "0")}</span>
                <span class="${process.risk === "HIGH" ? "incident-risk-high" : "incident-risk-medium"}">${process.risk}</span>
                </h3>

                <div class="incident-grid">

                    <div>
                        <span>Process</span>
                        <p>${process.name}</p>
                    </div>

                    <div>
                        <span>PID</span>
                        <p>${process.pid}</p>
                    </div>

                    <div>
                        <span>Severity</span>
                        <p class="${process.risk === "HIGH"
                            ? "severity-high"
                            : "severity-medium"}
                            ">
                            ${process.risk}
                        </p>
                    </div>

                    <div>
                        <span>CPU</span>
                        <p>${process.cpu}%</p>
                    </div>

                    <div>
                        <span>Memory</span>
                        <p>${process.memory_mb} MB</p>
                    </div>

                    <div>
                        <span>Detected</span>
                        <p>${new Date().toLocaleTimeString("en-IN")}</p>
                    </div>

                    <div>
                        <span>AI Confidence</span>
                        <p>${confidence}%</p>
                    </div>

                    <div>
                        <span>Status</span>

                        <p class="${process.risk === "HIGH"
                            ? "status-critical"
                            : "status-medium"}">

                            ${process.risk === "HIGH"
                                ? "🔴 Critical"
                                : "🟠 Monitoring"}

                        </p>

                    </div>

                </div>

                <div class="ai-explain">

    <h4>🤖 AI Explainability</h4>

    <div class="ai-row">
        <span class="ai-label">Threat Score</span>
        <span class="ai-value">${process.explainability.score}/100</span>
    </div>

    <div class="ai-row">
        <span class="ai-label">Confidence</span>
        <span class="ai-value">${process.explainability.confidence}%</span>
    </div>

    <div class="ai-section">
        <strong>📊 Evidence</strong>

        <ul>
            ${process.explainability.evidence
                .map(item => `<li>${item}</li>`)
                .join("")}
        </ul>
    </div>

    <div class="ai-section">
        <strong>📝 Reason</strong>
        <p>${process.explainability.reason}</p>
    </div>

    <div class="ai-section">
        <strong>💡 Recommendation</strong>
        <p>${process.explainability.recommendation}</p>
    </div>

</div>
                <div class="incident-actions">
                <button class="resolve-btn" onclick="resolveIncident(${process.pid}, this)">✅ Resolve</button>
                </div>
            </div>

            `;

            incidentNumber++;

        }

        // ===========================
        // Highest Risk Process
        // ===========================

        if (process.risk === "HIGH" && highestRisk === null) {

            highestRisk = process;

            if (lastToastPID !== process.pid) {

                showToast(
                    "⚠ High Risk Process",
                    `${process.name} (${process.cpu}% CPU)`
                );

                lastToastPID = process.pid;

            }

        }

    });

    // ===========================
    // AI Advisor
    // ===========================

    if (highestRisk) {

        document.getElementById("aiAdvisor").innerHTML = `

            <h4>🚨 ${highestRisk.name}</h4>

            <b>Severity :</b> ${highestRisk.risk}<br>

            <b>Reason :</b> ${highestRisk.reason}<br><br>

            <b>AI Recommendation</b><br>

            ${highestRisk.ai_message
                .replace(
                    "Threat Assessment:",
                    "<b>Threat Assessment</b><br>"
                )
                .replace(
                    "Possible Cause:",
                    "<br><br><b>Possible Cause</b><br>"
                )
                .replace(
                    "Recommended Action:",
                    "<br><br><b>Recommended Action</b><br>"
                )
            }

        `;

    }
    else {

        document.getElementById("aiAdvisor").innerHTML = `

            <h4>✅ System Secure</h4>

            No High Risk process detected.

        `;

    }

    // ===========================
    // Empty Incident State
    // ===========================

    if (incidentContainer.innerHTML === "") {

        incidentContainer.innerHTML = `

            <div class="emptyIncident">

                <h2>🛡 No Active Incidents</h2>

                <p>
                    AI is continuously monitoring your system.
                </p>

            </div>

        `;

    }
}

async function resolveIncident(pid, button) {

    try {

        button.disabled = true;
        button.innerHTML = "Resolving...";

        const token = localStorage.getItem("token");

        await fetch(`https://aegis-x-nibr.onrender.com/resolve/${pid}`,
            {
            method:"POST",
            headers:{
            Authorization:`Bearer ${token}`
        }
    });

        const data = await response.json();

        if (response.ok) {

            showToast(
                "Incident Resolved",
                data.message
            );

            const card = button.closest(".incident-card");

            card.style.transition = "all 0.4s ease";
            card.style.opacity = "0";
            card.style.transform = "translateX(40px)";

            setTimeout(() => {

                card.remove();

                const incidentContainer = document.getElementById("incidentContainer");

                if (incidentContainer.querySelectorAll(".incident-card").length === 0) {

                    incidentContainer.innerHTML = `

                        <div class="emptyIncident">

                            <h2>🛡 No Active Incidents</h2>

                            <p>
                                AI is continuously monitoring your system.
                            </p>

                        </div>

                    `;

                }

            }, 400);

            updateDashboard();

        } else {

            button.disabled = false;
            button.innerHTML = "✅ Resolve";

            showToast(
                "Failed",
                data.detail
            );

        }

    } catch (err) {

        button.disabled = false;
        button.innerHTML = "✅ Resolve";

        showToast(
            "Server Error",
            err.message
        );

    }

}

/* ==========================================================
   Refresh Interval Manager
========================================================== */
const refreshSelect = document.getElementById("refreshRate");

let refreshTime = Number(localStorage.getItem("refreshRate")) || 2000;

refreshSelect.value = refreshTime;

let refreshInterval;

function startRefresh() {

    clearInterval(refreshInterval);

    refreshInterval = setInterval(updateDashboard, refreshTime);

}

startRefresh();

refreshSelect.addEventListener("change", () => {

    refreshTime = Number(refreshSelect.value);

    localStorage.setItem("refreshRate", refreshTime);

    startRefresh();

});

/* ==========================================================
   Download Security Report
========================================================== */

const reportButton = document.getElementById("downloadReport");

if (reportButton) {

    reportButton.addEventListener("click", async () => {

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                "https://aegis-x-nibr.onrender.com/report",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to download report.");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = "AEGIS-X_Security_Report.pdf";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

        }
        catch (err) {

            alert(err.message);

        }

    });

}

const clearLogsBtn = document.getElementById("clearLogsBtn");

if (clearLogsBtn) {

    clearLogsBtn.addEventListener("click", async () => {

        const ok = confirm("Clear all audit logs?");

        if (!ok) return;

        const token = localStorage.getItem("token");

        await fetch("https://aegis-x-nibr.onrender.com/logs/clear",
            {
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`
             }
            });

        await loadAuditLogs();

    });

}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.location.href = "login.html";

    });

}

/* ==========================================================
   Hide Loader
========================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        const loader = document.getElementById("loader");

        if (loader) {

            loader.classList.add("hide");

        }

    }, 1800);

});
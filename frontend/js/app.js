/*
=========================================================
                AEGIS-X DASHBOARD SCRIPT
=========================================================

Purpose:
This script communicates with the FastAPI backend to
retrieve real-time system statistics and display them
on the monitoring dashboard.

Functions Available:

1. loadCPU()
   - Fetches current CPU utilization from the backend.
   - Updates the CPU Usage card.

2. loadMemory()
   - Fetches current memory utilization.
   - Updates the Memory Usage card.

3. loadDisk()
   - Fetches current disk utilization.
   - Updates the Disk Usage card.

4. loadDashboard()
   - Executes all monitoring functions.
   - Refreshes every dashboard metric together.

Workflow:
Dashboard Load
      │
      ▼
Fetch Data from FastAPI APIs
      │
      ▼
Update Dashboard Cards
      │
      ▼
Auto Refresh Every 2 Seconds

=========================================================
*/

const API = "http://127.0.0.1:8000";


// Fetch current CPU usage
async function loadCPU() {

    const response = await fetch(`${API}/cpu`);

    const data = await response.json();

    document.getElementById("cpu").innerHTML =
        data.cpu_usage_percent + " %";
}


// Fetch current memory usage
async function loadMemory() {

    const response = await fetch(`${API}/memory`);

    const data = await response.json();

    document.getElementById("memory").innerHTML =
        data.usage_percent + " %";
}


// Fetch current disk usage
async function loadDisk() {

    const response = await fetch(`${API}/disk`);

    const data = await response.json();

    document.getElementById("disk").innerHTML =
        data.usage_percent + " %";
}


// Load all dashboard metrics
async function loadDashboard() {

    await loadCPU();

    await loadMemory();

    await loadDisk();
}


// Load dashboard once when the page opens
loadDashboard();


// Refresh dashboard every 2 seconds
setInterval(loadDashboard, 2000);
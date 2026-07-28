/**
 * ==========================================================
 * File        : health.js
 * Project     : AEGIS-X
 *
 * Description :
 * Calculates overall system health.
 * ==========================================================
 */

export function updateHealth(cpu, memory, disk, processes) {

    let threatScore = 100;

    const hasHigh = processes.some(p => p.risk === "HIGH");

    if (hasHigh)
        threatScore = 50;

    const score = Math.round(

        (
            (100 - cpu.cpu_usage_percent) +
            (100 - memory.usage_percent) +
            (100 - disk.usage_percent) +
            threatScore

        ) / 4

    );

    document.getElementById("healthScore").innerText = score;

    const status = document.getElementById("healthStatus");

    if (score >= 90) {

        status.innerText = "🟢 Excellent";

    }

    else if (score >= 75) {

        status.innerText = "🟢 Healthy";

    }

    else if (score >= 50) {

        status.innerText = "🟡 Warning";

    }

    else {

        status.innerText = "🔴 Critical";

    }

    document.getElementById("cpuState").innerText =
        cpu.cpu_usage_percent < 70 ? "✔" : "⚠";

    document.getElementById("memoryState").innerText =
        memory.usage_percent < 80 ? "✔" : "⚠";

    document.getElementById("diskState").innerText =
        disk.usage_percent < 90 ? "✔" : "⚠";

    document.getElementById("threatState").innerText =
        hasHigh ? "⚠" : "✔";

}
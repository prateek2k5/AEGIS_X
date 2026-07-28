"""
============================================================
File        : process_monitor.py
Project     : AEGIS-X

Description:
Collect information about running system processes.
============================================================
"""

import os
from time import sleep

import psutil

from backend.services.ai_engine import explain_threat
from backend.services.audit_logger import write_log
from backend.services.threat_engine import calculate_risk


# ==========================================================
# Ignore Windows system idle processes
# ==========================================================

EXCLUDED_PROCESSES = {
    "System Idle Process",
    "Idle",
}

# ==========================================================
# Prevent duplicate audit logs
# ==========================================================

logged_high_risk = set()


# ==========================================================
# Get Running Processes
# ==========================================================

def get_running_processes() -> list:
    """
    Return the top running processes sorted by CPU usage.
    """

    # Initialize CPU counters
    for process in psutil.process_iter():
        try:
            process.cpu_percent(None)
        except (
            psutil.NoSuchProcess,
            psutil.AccessDenied,
        ):
            pass

    sleep(0.2)

    process_list = []

    for process in psutil.process_iter(
        ["pid", "name", "memory_info"]
    ):

        try:

            cpu = round(process.cpu_percent(None), 1)

            memory = round(
                process.info["memory_info"].rss /
                (1024 * 1024),
                2
            )

            if process.info["name"] in EXCLUDED_PROCESSES:
                continue

            risk, reason = calculate_risk(cpu, memory)

            # ===========================================
            # Audit Log (only once per PID)
            # ===========================================

            if risk == "HIGH" and process.info["pid"] not in logged_high_risk:

                write_log(
                    "WARNING",
                    f"High Risk Process Detected : "
                    f"{process.info['name']} "
                    f"(PID {process.info['pid']})"
                )

                logged_high_risk.add(process.info["pid"])

            # ===========================================
            # Threat Score
            # ===========================================

            threat_score = min(
                100,
                int(cpu * 0.6 + (memory / 10) * 0.4)
            )

            confidence = 70

            if risk == "MEDIUM":
                confidence = 85

            elif risk == "HIGH":
                confidence = 95

            # ===========================================
            # AI Recommendation
            # ===========================================

            ai_message = explain_threat({
                "risk": risk,
                "name": process.info["name"]
            })

            # ===========================================
            # AI Explainability
            # ===========================================

            explainability = {

                "score": threat_score,

                "confidence": confidence,

                "evidence": [
                    f"CPU Usage : {cpu}%",
                    f"Memory Usage : {memory} MB"
                ],

                "reason": reason,

                "recommendation":
                    "Terminate only if the process is not trusted."
                    if risk == "HIGH"
                    else "Continue monitoring the process."
            }

            process_list.append({

                "pid": process.info["pid"],

                "name": process.info["name"] or "Unknown",

                "cpu": cpu,

                "memory_mb": memory,

                "risk": risk,

                "reason": reason,

                "ai_message": ai_message,

                "explainability": explainability

            })

        except (
            psutil.NoSuchProcess,
            psutil.AccessDenied,
            psutil.ZombieProcess
        ):
            continue

    process_list.sort(
        key=lambda x: x["cpu"],
        reverse=True
    )

    return process_list[:25]


# ==========================================================
# Resolve / Terminate Suspicious Process
# ==========================================================

def terminate_process(pid: int):
    """
    Terminate a running process by PID.
    """

    try:

        process = psutil.Process(pid)

        if process.pid == os.getpid():
            return {
                "success": False,
                "message": "Cannot terminate AEGIS-X backend process."
            }

        process_name = process.name()

        process.terminate()

        try:
            process.wait(timeout=3)

        except psutil.TimeoutExpired:
            process.kill()

        write_log(
            "ACTION",
            f"Process Terminated : {process_name} (PID {pid})"
        )

        logged_high_risk.discard(pid)

        return {
            "success": True,
            "message": f"{process_name} terminated successfully.",
            "pid": pid
        }

    except psutil.NoSuchProcess:

        return {
            "success": False,
            "message": "Process not found."
        }

    except psutil.AccessDenied:

        return {
            "success": False,
            "message": "Access denied. Run AEGIS-X as Administrator."
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
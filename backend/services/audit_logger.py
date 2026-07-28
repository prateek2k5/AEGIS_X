"""
============================================================
File        : audit_logger.py
Project     : AEGIS-X

Description:
Centralized audit logging service.
============================================================
"""

from datetime import datetime

from pathlib import Path

LOG_FILE = Path(__file__).resolve().parents[2] / "audit.log"


def write_log(event_type: str, message: str):
    """
    Write an event to audit.log
    """

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    log = (
        f"[{timestamp}] "
        f"[{event_type.upper()}] "
        f"{message}\n"
    )

    with open(LOG_FILE, "a", encoding="utf-8") as file:
        file.write(log)


def get_logs(limit: int = 50):
    """
    Return latest logs.
    """

    try:

        with open(LOG_FILE, "r", encoding="utf-8") as file:

            logs = file.readlines()

        logs.reverse()

        return [log.strip() for log in logs[:limit]]

    except FileNotFoundError:

        return []

def clear_logs():
    """
    Clear all audit logs.
    """
    with open(LOG_FILE, "w", encoding="utf-8"):
        pass
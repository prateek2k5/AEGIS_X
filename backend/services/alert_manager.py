"""
============================================================
File        : alert_manager.py
Project     : AEGIS-X

Description :
Stores recent security alerts.
============================================================
"""

from datetime import datetime

MAX_ALERTS = 20

alerts = []


def add_alert(process):

    # Avoid duplicate consecutive alerts
    if alerts:

        last = alerts[0]

        if (
            last["pid"] == process["pid"]
            and last["risk"] == process["risk"]
        ):
            return

    alerts.insert(
        0,
        {
            "time": datetime.now().strftime("%I:%M %p"),
            "pid": process["pid"],
            "name": process["name"],
            "risk": process["risk"],
            "reason": process["reason"],
        },
    )

    if len(alerts) > MAX_ALERTS:
        alerts.pop()


def get_alerts():

    return alerts
"""
============================================================
File        : threat_engine.py
Project     : AEGIS-X
Module      : Threat Detection Engine

Description:
Analyzes running processes and assigns a risk level.
============================================================
"""


def calculate_risk(cpu: float, memory: float) -> tuple:
    """
    Calculate risk level based on CPU and memory usage.

    Returns:
        tuple:
            risk level,
            reason
    """

    # ======================================================
    # HIGH RISK
    # ======================================================

    if cpu >= 80:

        return (
            "HIGH",
            "CPU usage exceeded 80%."
        )

    if memory >= 1500:

        return (
            "HIGH",
            "Memory usage exceeded 1500 MB."
        )

    # ======================================================
    # MEDIUM
    # ======================================================

    if cpu >= 50:

        return (
            "MEDIUM",
            "CPU usage is moderately high."
        )

    if memory >= 800:

        return (
            "MEDIUM",
            "Memory usage is moderately high."
        )

    # ======================================================
    # LOW
    # ======================================================

    return (
        "LOW",
        "Normal process."
    )
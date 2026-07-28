"""
============================================================
File        : ai_engine.py
Project     : AEGIS-X

Description:
Generates AI explanations for detected threats.
============================================================
"""


def explain_threat(process: dict) -> str:
    """
    Generate a human-readable explanation
    for a detected threat.
    """

    if process["risk"] == "HIGH":

        return (
            f"{process['name']} is consuming unusually high "
            "system resources. Immediate investigation "
            "is recommended."
        )

    if process["risk"] == "MEDIUM":

        return (
            f"{process['name']} shows elevated resource usage."
        )

    return (
        f"{process['name']} is operating normally."
    )
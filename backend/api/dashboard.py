"""
============================================================
File        : dashboard.py
Project     : AEGIS-X

Description:
Returns all dashboard data in a single API response.
============================================================
"""

from fastapi import APIRouter, Depends

from backend.services.auth import verify_token

from backend.services.alert_manager import add_alert

from backend.services.system_monitor import (
    get_cpu_info,
    get_memory_info,
    get_disk_info,
    get_network_info,
)

from backend.services.process_monitor import (
    get_running_processes,
)

from backend.services.groq_service import (
    analyze_process,
)

from backend.services.ai_cache import (
    get_cached_response,
    save_response,
)

router = APIRouter(
    tags=["Dashboard"]
)


@router.get("/dashboard")
def dashboard(user=Depends(verify_token)):
    """
    Return all dashboard information.
    """

    processes = get_running_processes()

    # Generate AI analysis only for the first HIGH risk process
    for process in processes:

        if process["risk"] == "HIGH":

            add_alert(process)

            try:

                cached = get_cached_response(process["name"])

                if cached:

                    process["ai_message"] = cached

                else:

                    ai = analyze_process(process)

                    save_response(process["name"], ai)

                    process["ai_message"] = ai

            except Exception:
                pass

            break

    return {

        "cpu": get_cpu_info(),

        "memory": get_memory_info(),

        "disk": get_disk_info(),

        "network": get_network_info(),

        "processes": processes

    }
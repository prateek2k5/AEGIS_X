"""
============================================================
File        : report.py
Project     : AEGIS-X

Description:
Generate and download PDF security report.
============================================================
"""

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from backend.services.auth import verify_token

from backend.services.system_monitor import (
    get_cpu_info,
    get_memory_info,
    get_disk_info,
    get_network_info,
)

from backend.services.process_monitor import (
    get_running_processes,
)

from backend.services.report_generator import (
    generate_report,
)

router = APIRouter(
    tags=["Reports"]
)


@router.get("/report")
def download_report(user=Depends(verify_token)):
    """
    Generate and download PDF security report.
    """

    data = {

        "cpu": get_cpu_info(),

        "memory": get_memory_info(),

        "disk": get_disk_info(),

        "network": get_network_info(),

        "processes": get_running_processes()

    }

    filename = generate_report(data)

    return FileResponse(
        filename,
        media_type="application/pdf",
        filename="AEGIS-X_Security_Report.pdf"
    )
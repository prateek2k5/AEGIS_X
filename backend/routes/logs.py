"""
============================================================
File        : logs.py
Project     : AEGIS-X

Description:
API for Security Audit Logs.
============================================================
"""

from fastapi import APIRouter, Depends

from backend.services.auth import verify_token
from backend.services.audit_logger import get_logs, clear_logs

router = APIRouter()


@router.get("/logs")
def read_logs(user=Depends(verify_token)):
    """
    Return latest audit logs.
    """

    return {
        "logs": get_logs()
    }


@router.post("/logs/clear")
def clear_audit_logs(user=Depends(verify_token)):
    """
    Clear all audit logs.
    """

    clear_logs()

    return {
        "success": True,
        "message": "Audit logs cleared."
    }
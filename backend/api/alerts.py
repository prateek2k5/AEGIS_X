"""
============================================================
File        : alerts.py
Project     : AEGIS-X

Description :
Alert history API.
============================================================
"""

from fastapi import APIRouter, Depends

from backend.services.auth import verify_token
from backend.services.alert_manager import get_alerts

router = APIRouter(
    tags=["Alerts"]
)


@router.get("/alerts")
def alerts(user=Depends(verify_token)):
    """
    Return all security alerts.
    """
    return get_alerts()
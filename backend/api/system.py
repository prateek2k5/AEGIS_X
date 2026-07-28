"""
============================================================
File        : system.py
Project     : AEGIS-X
Module      : System API

Description:
Exposes REST APIs for system monitoring.
============================================================
"""

from fastapi import APIRouter
from fastapi import Depends
from backend.services.auth import verify_token

from backend.services.system_monitor import (
    get_cpu_info,
    get_disk_info,
    get_memory_info,
    get_network_info,
    get_system_info,
)

router = APIRouter(
    prefix="",
    tags=["System Monitoring"]
)

@router.get("/system")
def system(user=Depends(verify_token)):
    """Return operating system information."""
    return get_system_info()


@router.get("/cpu")
def get_cpu(user=Depends(verify_token)):
    """Return CPU statistics."""
    return get_cpu_info()


@router.get("/memory")
def get_memory(user=Depends(verify_token)):
    """Return memory statistics."""
    return get_memory_info()


@router.get("/disk")
def disk(user=Depends(verify_token)):
    """Return disk statistics."""
    return get_disk_info()


@router.get("/network")
def network(user=Depends(verify_token)):
    """Return network statistics."""
    return get_network_info()
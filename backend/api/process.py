"""
============================================================
File        : process.py
Project     : AEGIS-X
Module      : Process API
============================================================
"""

from fastapi import APIRouter, HTTPException, Depends

from backend.services.auth import verify_token

from backend.services.process_monitor import (
    get_running_processes,
    terminate_process
)

router = APIRouter(
    prefix="",
    tags=["Process Monitoring"],
)


@router.get("/processes")
def processes(user=Depends(verify_token)):
    """
    Return top running processes.
    """
    return get_running_processes()


@router.post("/resolve/{pid}")
def resolve_process(
    pid: int,
    user=Depends(verify_token)
):
    """
    Terminate a suspicious process.
    """

    result = terminate_process(pid)

    if result["success"]:
        return result

    raise HTTPException(
        status_code=400,
        detail=result["message"]
    )
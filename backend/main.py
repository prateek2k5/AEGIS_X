"""
============================================================
File        : main.py
Project     : AEGIS-X

Description:
Application entry point.
============================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.process import router as process_router
from backend.api.dashboard import router as dashboard_router
from backend.api.system import router as system_router
from backend.api.report import router as report_router
from backend.api.alerts import router as alerts_router
from backend.routes.logs import router as logs_router
from backend.services.audit_logger import write_log
from backend.routes.auth import router as auth_router

app = FastAPI(
    title="AEGIS-X",
    version="1.0.0",
    description="Autonomous AI Security Operations Center"
)

@app.on_event("startup")
async def startup_event():

    write_log(
        "SYSTEM",
        "AEGIS-X Dashboard Started"
    )
# ==========================================================
# CORS Configuration
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# Register API Routers
# ==========================================================

app.include_router(system_router)
app.include_router(process_router)
app.include_router(dashboard_router)
app.include_router(report_router)
app.include_router(alerts_router)
app.include_router(logs_router)
app.include_router(auth_router)

@app.get("/")
def home():
    """Health check endpoint."""
    return {
        "project": "AEGIS-X",
        "status": "Running"
    }
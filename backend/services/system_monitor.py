"""
=========================================================
                SYSTEM MONITOR MODULE
=========================================================

Purpose:
This module collects real-time system statistics from the
host machine using the psutil library.

Functions Available:

1. get_system_info()
   - Collects basic operating system details
   - Retrieves hostname, processor, machine architecture,
     OS version, and system boot time

2. get_cpu_info()
   - Collects CPU-related statistics
   - Retrieves physical cores, logical cores,
     and current CPU utilization

3. get_memory_info()
   - Collects RAM usage statistics
   - Retrieves total, used, available memory,
     and memory utilization percentage

4. get_disk_info()
   - Collects storage information
   - Retrieves total, used, free disk space,
     and disk utilization percentage

5. get_network_info()
   - Collects network traffic statistics
   - Retrieves total data sent and received
     since the system started

Used By:
- Monitoring Dashboard
- AI Threat Analysis Engine
- Incident Reporting System
=========================================================
"""

import platform
import socket
from datetime import datetime
import psutil


def get_system_info() -> dict:
    system = platform.uname()
    boot_time = datetime.fromtimestamp(psutil.boot_time())

    return {
        "operating_system": system.system,
        "hostname": socket.gethostname(),
        "release": system.release,
        "version": system.version,
        "machine": system.machine,
        "processor": system.processor,
        "boot_time": boot_time.strftime("%Y-%m-%d %H:%M:%S")
    }


def get_cpu_info() -> dict:
    return {
        "physical_cores": psutil.cpu_count(logical=False),
        "logical_cores": psutil.cpu_count(logical=True),
        "cpu_usage_percent": psutil.cpu_percent(interval=1)
    }


def get_memory_info() -> dict:
    memory = psutil.virtual_memory()

    return {
        "total_gb": round(memory.total / (1024 ** 3), 2),
        "used_gb": round(memory.used / (1024 ** 3), 2),
        "available_gb": round(memory.available / (1024 ** 3), 2),
        "usage_percent": memory.percent
    }


def get_disk_info() -> dict:
    disk = psutil.disk_usage("/")

    return {
        "total_gb": round(disk.total / (1024 ** 3), 2),
        "used_gb": round(disk.used / (1024 ** 3), 2),
        "free_gb": round(disk.free / (1024 ** 3), 2),
        "usage_percent": disk.percent
    }


def get_network_info() -> dict:
    network = psutil.net_io_counters()

    return {
        "bytes_sent_mb": round(network.bytes_sent / (1024 ** 2), 2),
        "bytes_received_mb": round(network.bytes_recv / (1024 ** 2), 2)
    }
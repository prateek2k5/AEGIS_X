from services.groq_service import analyze_process

sample = {
    "name": "python.exe",
    "cpu": 92,
    "memory_mb": 500,
    "risk": "HIGH",
    "reason": "CPU usage exceeded 80%."
}

print(analyze_process(sample))
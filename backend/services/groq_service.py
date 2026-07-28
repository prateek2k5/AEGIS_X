"""
============================================================
File        : groq_service.py
Project     : AEGIS-X

Description :
Handles AI-based threat analysis using Groq.
============================================================
"""

import os

from groq import Groq
from dotenv import load_dotenv

from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"

load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GROQ_API_KEY")

print("Groq Key Loaded:", api_key is not None)

client = Groq(api_key=api_key)


def analyze_process(process):
    prompt = f"""
You are a Senior SOC (Security Operations Center) Analyst.

Analyze the following process.

Process Name : {process['name']}
CPU Usage : {process['cpu']}%
Memory Usage : {process['memory_mb']} MB
Risk Level : {process['risk']}
Detection Reason : {process['reason']}

Important Rules:

- Do NOT assume malware.
- High CPU usage alone does NOT indicate malicious behavior.
- Mention legitimate possibilities first (software compilation, AI training, development server, browser workload, etc.).
- Only mention malware as a possibility if clearly justified.
- Keep the response professional and balanced.

Respond in exactly this format:

Threat Assessment:
Possible Cause:
Recommended Action:

Maximum 100 words.
"""

    response = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]

    )

    return response.choices[0].message.content
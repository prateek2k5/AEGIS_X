"""
============================================================
File        : ai_cache.py
Project     : AEGIS-X

Description :
Caches AI responses to avoid repeated Groq API calls.
============================================================
"""

import time

_cache = {
    "process": None,
    "response": None,
    "timestamp": 0
}


def get_cached_response(process_name):

    if (
        _cache["process"] == process_name
        and time.time() - _cache["timestamp"] < 30
    ):
        return _cache["response"]

    return None


def save_response(process_name, response):

    _cache["process"] = process_name
    _cache["response"] = response
    _cache["timestamp"] = time.time()
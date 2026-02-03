"""Utility modules for uipro CLI."""

from uipro.utils.logger import console, logger
from uipro.utils.detect import detect_ai_type, get_ai_type_description
from uipro.utils.template import generate_platform_files, generate_all_platform_files

__all__ = [
    "console",
    "logger",
    "detect_ai_type",
    "get_ai_type_description",
    "generate_platform_files",
    "generate_all_platform_files",
]

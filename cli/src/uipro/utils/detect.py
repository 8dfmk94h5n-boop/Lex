"""AI platform detection utilities."""

from pathlib import Path

from uipro.types import DetectionResult


def detect_ai_type(cwd: Path | None = None) -> DetectionResult:
    """Detect AI platforms based on folder structure in the current directory.

    Args:
        cwd: Directory to search in. Defaults to current working directory.

    Returns:
        DetectionResult with detected platforms and a suggested platform.
    """
    if cwd is None:
        cwd = Path.cwd()

    detected: list[str] = []

    # Check for platform-specific directories
    platform_dirs = {
        ".claude": "claude",
        ".cursor": "cursor",
        ".windsurf": "windsurf",
        ".agent": "antigravity",
        ".github": "copilot",
        ".kiro": "kiro",
        ".codex": "codex",
        ".roo": "roocode",
        ".qoder": "qoder",
        ".gemini": "gemini",
        ".trae": "trae",
        ".opencode": "opencode",
        ".continue": "continue",
        ".codebuddy": "codebuddy",
    }

    for folder, platform in platform_dirs.items():
        if (cwd / folder).exists():
            detected.append(platform)

    # Suggest based on what's detected
    suggested: str | None = None
    if len(detected) == 1:
        suggested = detected[0]
    elif len(detected) > 1:
        suggested = "all"

    return DetectionResult(detected=detected, suggested=suggested)


def get_ai_type_description(ai_type: str) -> str:
    """Get human-readable description for an AI type.

    Args:
        ai_type: The AI platform identifier.

    Returns:
        Description string with platform name and folder path.
    """
    descriptions = {
        "claude": "Claude Code (.claude/skills/)",
        "cursor": "Cursor (.cursor/skills/)",
        "windsurf": "Windsurf (.windsurf/skills/)",
        "antigravity": "Antigravity (.agent/skills/)",
        "copilot": "GitHub Copilot (.github/prompts/)",
        "kiro": "Kiro (.kiro/steering/)",
        "codex": "Codex (.codex/skills/)",
        "roocode": "RooCode (.roo/skills/)",
        "qoder": "Qoder (.qoder/skills/)",
        "gemini": "Gemini CLI (.gemini/skills/)",
        "trae": "Trae (.trae/skills/)",
        "opencode": "OpenCode (.opencode/skills/)",
        "continue": "Continue (.continue/skills/)",
        "codebuddy": "CodeBuddy (.codebuddy/skills/)",
        "all": "All AI assistants",
    }
    return descriptions.get(ai_type, ai_type)

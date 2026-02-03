"""Type definitions for uipro CLI."""

from dataclasses import dataclass, field
from typing import Literal

# AI platform types
AIType = Literal[
    "claude",
    "cursor",
    "windsurf",
    "antigravity",
    "copilot",
    "kiro",
    "roocode",
    "codex",
    "qoder",
    "gemini",
    "trae",
    "opencode",
    "continue",
    "codebuddy",
    "all",
]

AI_TYPES: list[str] = [
    "claude",
    "cursor",
    "windsurf",
    "antigravity",
    "copilot",
    "roocode",
    "kiro",
    "codex",
    "qoder",
    "gemini",
    "trae",
    "opencode",
    "continue",
    "codebuddy",
    "all",
]

# Legacy folder mapping for backward compatibility with ZIP-based installs
AI_FOLDERS: dict[str, list[str]] = {
    "claude": [".claude"],
    "cursor": [".cursor", ".shared"],
    "windsurf": [".windsurf", ".shared"],
    "antigravity": [".agent", ".shared"],
    "copilot": [".github", ".shared"],
    "kiro": [".kiro", ".shared"],
    "codex": [".codex"],
    "roocode": [".roo", ".shared"],
    "qoder": [".qoder", ".shared"],
    "gemini": [".gemini", ".shared"],
    "trae": [".trae", ".shared"],
    "opencode": [".opencode", ".shared"],
    "continue": [".continue"],
    "codebuddy": [".codebuddy"],
}

# Map AIType to platform config file name
AI_TO_PLATFORM: dict[str, str] = {
    "claude": "claude",
    "cursor": "cursor",
    "windsurf": "windsurf",
    "antigravity": "agent",
    "copilot": "copilot",
    "kiro": "kiro",
    "opencode": "opencode",
    "roocode": "roocode",
    "codex": "codex",
    "qoder": "qoder",
    "gemini": "gemini",
    "trae": "trae",
    "continue": "continue",
    "codebuddy": "codebuddy",
}


@dataclass
class FolderStructure:
    """Folder structure configuration for a platform."""

    root: str
    skill_path: str
    filename: str


@dataclass
class Sections:
    """Section configuration for skill file generation."""

    quick_reference: bool = True


@dataclass
class PlatformConfig:
    """Configuration for an AI platform."""

    platform: str
    display_name: str
    install_type: Literal["full", "reference"]
    folder_structure: FolderStructure
    script_path: str
    frontmatter: dict[str, str] | None
    sections: Sections
    title: str
    description: str
    skill_or_workflow: str

    @classmethod
    def from_dict(cls, data: dict) -> "PlatformConfig":
        """Create PlatformConfig from dictionary (loaded from JSON)."""
        folder_data = data.get("folderStructure", {})
        folder_structure = FolderStructure(
            root=folder_data.get("root", ""),
            skill_path=folder_data.get("skillPath", ""),
            filename=folder_data.get("filename", "SKILL.md"),
        )

        sections_data = data.get("sections", {})
        sections = Sections(quick_reference=sections_data.get("quickReference", True))

        return cls(
            platform=data.get("platform", ""),
            display_name=data.get("displayName", ""),
            install_type=data.get("installType", "full"),
            folder_structure=folder_structure,
            script_path=data.get("scriptPath", ""),
            frontmatter=data.get("frontmatter"),
            sections=sections,
            title=data.get("title", ""),
            description=data.get("description", ""),
            skill_or_workflow=data.get("skillOrWorkflow", "skill"),
        )


@dataclass
class Release:
    """GitHub release information."""

    tag_name: str
    name: str
    published_at: str
    html_url: str
    assets: list["Asset"] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: dict) -> "Release":
        """Create Release from dictionary (loaded from GitHub API)."""
        assets = [Asset.from_dict(a) for a in data.get("assets", [])]
        return cls(
            tag_name=data.get("tag_name", ""),
            name=data.get("name", ""),
            published_at=data.get("published_at", ""),
            html_url=data.get("html_url", ""),
            assets=assets,
        )


@dataclass
class Asset:
    """GitHub release asset."""

    name: str
    browser_download_url: str
    size: int

    @classmethod
    def from_dict(cls, data: dict) -> "Asset":
        """Create Asset from dictionary."""
        return cls(
            name=data.get("name", ""),
            browser_download_url=data.get("browser_download_url", ""),
            size=data.get("size", 0),
        )


@dataclass
class DetectionResult:
    """Result of AI platform detection."""

    detected: list[str]
    suggested: str | None

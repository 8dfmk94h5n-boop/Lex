"""Template rendering utilities for skill file generation."""

import json
import shutil
from pathlib import Path

from uipro.types import AI_TO_PLATFORM, PlatformConfig

# Assets directory relative to this file
# After install: site-packages/uipro/utils/template.py -> ../../assets
# During dev: src/uipro/utils/template.py -> ../../../assets
_THIS_DIR = Path(__file__).parent
_ASSETS_DIR = _THIS_DIR.parent.parent.parent / "assets"

# Fallback: check if assets are bundled alongside the package
if not _ASSETS_DIR.exists():
    _ASSETS_DIR = _THIS_DIR.parent / "assets"


def get_assets_dir() -> Path:
    """Get the path to the assets directory.

    Returns:
        Path to assets directory.

    Raises:
        FileNotFoundError: If assets directory cannot be found.
    """
    if _ASSETS_DIR.exists():
        return _ASSETS_DIR

    # Try to find assets in common locations
    for candidate in [
        Path(__file__).parent.parent.parent.parent / "assets",  # dev layout
        Path(__file__).parent.parent / "assets",  # installed layout
    ]:
        if candidate.exists():
            return candidate

    raise FileNotFoundError(
        "Assets directory not found. Please reinstall the package."
    )


def load_platform_config(ai_type: str) -> PlatformConfig:
    """Load platform configuration from JSON file.

    Args:
        ai_type: AI platform identifier.

    Returns:
        PlatformConfig object.

    Raises:
        ValueError: If AI type is unknown.
        FileNotFoundError: If config file doesn't exist.
    """
    platform_name = AI_TO_PLATFORM.get(ai_type)
    if not platform_name:
        raise ValueError(f"Unknown AI type: {ai_type}")

    assets_dir = get_assets_dir()
    config_path = assets_dir / "templates" / "platforms" / f"{platform_name}.json"

    if not config_path.exists():
        raise FileNotFoundError(f"Platform config not found: {config_path}")

    with open(config_path, encoding="utf-8") as f:
        data = json.load(f)

    return PlatformConfig.from_dict(data)


def load_all_platform_configs() -> dict[str, PlatformConfig]:
    """Load all available platform configurations.

    Returns:
        Dictionary mapping AI type to PlatformConfig.
    """
    configs: dict[str, PlatformConfig] = {}

    for ai_type in AI_TO_PLATFORM:
        try:
            configs[ai_type] = load_platform_config(ai_type)
        except (FileNotFoundError, ValueError):
            pass  # Skip if config doesn't exist

    return configs


def load_template(template_name: str) -> str:
    """Load a template file.

    Args:
        template_name: Relative path to template within assets/templates/.

    Returns:
        Template file contents.
    """
    assets_dir = get_assets_dir()
    template_path = assets_dir / "templates" / template_name

    with open(template_path, encoding="utf-8") as f:
        return f.read()


def render_frontmatter(frontmatter: dict[str, str] | None) -> str:
    """Render YAML frontmatter section.

    Args:
        frontmatter: Dictionary of frontmatter key-value pairs.

    Returns:
        Formatted frontmatter string including delimiters.
    """
    if not frontmatter:
        return ""

    lines = ["---"]
    for key, value in frontmatter.items():
        # Quote values that contain special characters
        if any(c in value for c in [':', '"', "\n"]):
            escaped = value.replace('"', '\\"')
            lines.append(f'{key}: "{escaped}"')
        else:
            lines.append(f"{key}: {value}")
    lines.append("---")
    lines.append("")

    return "\n".join(lines)


def render_skill_file(config: PlatformConfig) -> str:
    """Render skill file content from template.

    Args:
        config: Platform configuration.

    Returns:
        Rendered skill file content.
    """
    # Load base template
    content = load_template("base/skill-content.md")

    # Load quick reference if needed
    quick_reference_content = ""
    if config.sections.quick_reference:
        quick_reference_content = load_template("base/quick-reference.md")

    # Build the final content
    frontmatter = render_frontmatter(config.frontmatter)

    # Add newline before quick reference content if it exists
    quick_ref_with_newline = (
        "\n" + quick_reference_content if quick_reference_content else ""
    )

    content = (
        content.replace("{{TITLE}}", config.title)
        .replace("{{DESCRIPTION}}", config.description)
        .replace("{{SCRIPT_PATH}}", config.script_path)
        .replace("{{SKILL_OR_WORKFLOW}}", config.skill_or_workflow)
        .replace("{{QUICK_REFERENCE}}", quick_ref_with_newline)
    )

    return frontmatter + content


def copy_data_and_scripts(target_skill_dir: Path) -> None:
    """Copy data and scripts to target directory.

    Args:
        target_skill_dir: Target skill directory.
    """
    assets_dir = get_assets_dir()
    data_source = assets_dir / "data"
    scripts_source = assets_dir / "scripts"

    data_target = target_skill_dir / "data"
    scripts_target = target_skill_dir / "scripts"

    # Copy data
    if data_source.exists():
        data_target.mkdir(parents=True, exist_ok=True)
        shutil.copytree(data_source, data_target, dirs_exist_ok=True)

    # Copy scripts
    if scripts_source.exists():
        scripts_target.mkdir(parents=True, exist_ok=True)
        shutil.copytree(scripts_source, scripts_target, dirs_exist_ok=True)


def generate_platform_files(target_dir: Path, ai_type: str) -> list[str]:
    """Generate platform files for a specific AI type.

    All platforms use self-contained installation with data and scripts.

    Args:
        target_dir: Target directory for installation.
        ai_type: AI platform identifier.

    Returns:
        List of created folder names.
    """
    config = load_platform_config(ai_type)
    created_folders: list[str] = []

    # Determine full skill directory path
    skill_dir = (
        target_dir
        / config.folder_structure.root
        / config.folder_structure.skill_path
    )

    # Create directory structure
    skill_dir.mkdir(parents=True, exist_ok=True)

    # Render and write skill file
    skill_content = render_skill_file(config)
    skill_file_path = skill_dir / config.folder_structure.filename

    with open(skill_file_path, "w", encoding="utf-8") as f:
        f.write(skill_content)

    created_folders.append(config.folder_structure.root)

    # Copy data and scripts into the skill directory (self-contained)
    copy_data_and_scripts(skill_dir)

    return created_folders


def generate_all_platform_files(target_dir: Path) -> list[str]:
    """Generate files for all AI types.

    Args:
        target_dir: Target directory for installation.

    Returns:
        List of created folder names (deduplicated).
    """
    all_folders: set[str] = set()

    for ai_type in AI_TO_PLATFORM:
        try:
            folders = generate_platform_files(target_dir, ai_type)
            all_folders.update(folders)
        except Exception:
            pass  # Skip if generation fails for a platform

    return list(all_folders)


def get_supported_ai_types() -> list[str]:
    """Get list of supported AI types.

    Returns:
        List of AI type identifiers.
    """
    return list(AI_TO_PLATFORM.keys())

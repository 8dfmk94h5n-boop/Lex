"""Init command - Install UI/UX Pro Max skill to current project."""

from pathlib import Path

import click
import questionary
from rich.progress import Progress, SpinnerColumn, TaskID, TextColumn

from uipro.types import AI_TYPES
from uipro.utils.detect import detect_ai_type, get_ai_type_description
from uipro.utils.extract import cleanup, create_temp_dir, install_from_zip
from uipro.utils.github import (
    GitHubDownloadError,
    GitHubRateLimitError,
    download_release,
    get_asset_url,
    get_latest_release,
)
from uipro.utils.logger import console, logger
from uipro.utils.template import generate_all_platform_files, generate_platform_files


def try_github_install(
    target_dir: Path,
    ai_type: str,
    progress: Progress,
    task_id: TaskID,
) -> list[str] | None:
    """Try to install from GitHub release (legacy method).

    Args:
        target_dir: Target directory for installation.
        ai_type: AI platform type.
        progress: Progress bar instance.
        task_id: Progress task ID.

    Returns:
        List of copied folders if successful, None if failed.
    """
    temp_dir: Path | None = None

    try:
        progress.update(task_id, description="Fetching latest release from GitHub...")
        release = get_latest_release()
        asset_url = get_asset_url(release)

        if not asset_url:
            raise GitHubDownloadError("No ZIP asset found in latest release")

        progress.update(task_id, description=f"Downloading {release.tag_name}...")
        temp_dir = create_temp_dir()
        zip_path = temp_dir / "release.zip"

        download_release(asset_url, zip_path)

        progress.update(task_id, description="Extracting and installing files...")
        copied_folders, extracted_temp_dir = install_from_zip(
            zip_path, target_dir, ai_type
        )

        cleanup(extracted_temp_dir)
        return copied_folders

    except GitHubRateLimitError:
        logger.warn("GitHub rate limit reached, using template generation...")
        return None

    except GitHubDownloadError:
        logger.warn("GitHub download failed, using template generation...")
        return None

    except Exception:
        logger.warn("Download failed, using template generation...")
        return None

    finally:
        if temp_dir:
            cleanup(temp_dir)


def template_install(
    target_dir: Path,
    ai_type: str,
    progress: Progress,
    task_id: TaskID,
) -> list[str]:
    """Install using template generation.

    Args:
        target_dir: Target directory for installation.
        ai_type: AI platform type.
        progress: Progress bar instance.
        task_id: Progress task ID.

    Returns:
        List of created folders.
    """
    progress.update(task_id, description="Generating skill files from templates...")

    if ai_type == "all":
        return generate_all_platform_files(target_dir)

    return generate_platform_files(target_dir, ai_type)


@click.command("init")
@click.option(
    "-a",
    "--ai",
    type=click.Choice(AI_TYPES),
    help=f"AI assistant type ({', '.join(AI_TYPES)})",
)
@click.option("-f", "--force", is_flag=True, help="Overwrite existing files")
@click.option("-o", "--offline", is_flag=True, help="Skip GitHub download, use bundled assets only")
@click.option("--legacy", is_flag=True, help="Use old ZIP-based install")
def init_cmd(ai: str | None, force: bool, offline: bool, legacy: bool) -> None:
    """Install UI/UX Pro Max skill to current project."""
    logger.title("UI/UX Pro Max Installer")

    ai_type = ai

    # Auto-detect or prompt for AI type
    if not ai_type:
        detection = detect_ai_type()

        if detection.detected:
            detected_str = ", ".join(f"[cyan]{t}[/cyan]" for t in detection.detected)
            logger.info(f"Detected: {detected_str}")

        # Create choices for interactive selection
        choices = [
            questionary.Choice(title=get_ai_type_description(t), value=t)
            for t in AI_TYPES
        ]

        # Set initial selection based on detection
        default = detection.suggested if detection.suggested else AI_TYPES[0]

        response = questionary.select(
            "Select AI assistant to install for:",
            choices=choices,
            default=default,
        ).ask()

        if not response:
            logger.warn("Installation cancelled")
            return

        ai_type = response

    logger.info(f"Installing for: [cyan]{get_ai_type_description(ai_type)}[/cyan]")

    cwd = Path.cwd()
    copied_folders: list[str] = []
    install_method = "template"

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task_id = progress.add_task("Installing files...", total=None)

        try:
            # Use legacy ZIP-based install if --legacy flag is set
            if legacy:
                if not offline:
                    github_result = try_github_install(cwd, ai_type, progress, task_id)
                    if github_result:
                        copied_folders = github_result
                        install_method = "github"

                # Fall back to template if GitHub failed
                if install_method != "github":
                    copied_folders = template_install(cwd, ai_type, progress, task_id)
                    install_method = "template"
            else:
                # Use template-based generation (default)
                copied_folders = template_install(cwd, ai_type, progress, task_id)
                install_method = "template"

            progress.update(task_id, description="[green]Done![/green]")

        except Exception as e:
            progress.update(task_id, description="[red]Failed![/red]")
            logger.error(str(e))
            raise click.Abort()

    # Success message
    method_messages = {
        "github": "Installed from GitHub release!",
        "bundled": "Installed from bundled assets!",
        "template": "Generated from templates!",
    }
    logger.success(method_messages.get(install_method, "Installed!"))

    # Summary
    console.print()
    logger.info("Installed folders:")
    for folder in copied_folders:
        console.print(f"  [green]+[/green] {folder}")

    console.print()
    logger.success("UI/UX Pro Max installed successfully!")

    # Next steps
    console.print()
    console.print("[bold]Next steps:[/bold]")
    console.print("[dim]  1. Restart your AI coding assistant[/dim]")
    console.print('[dim]  2. Try: "Build a landing page for a SaaS product"[/dim]')
    console.print()

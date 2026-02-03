"""Versions command - List available versions."""

import click
from rich.table import Table

from uipro.utils.github import (
    GitHubDownloadError,
    GitHubRateLimitError,
    fetch_releases,
)
from uipro.utils.logger import console, logger


@click.command("versions")
def versions_cmd() -> None:
    """List available versions from GitHub releases."""
    logger.title("UI/UX Pro Max Versions")

    try:
        releases = fetch_releases()

        if not releases:
            logger.warn("No releases found.")
            return

        # Create a table
        table = Table(show_header=True, header_style="bold cyan")
        table.add_column("Version", style="green")
        table.add_column("Name")
        table.add_column("Published")
        table.add_column("URL", style="dim")

        for release in releases[:10]:  # Show latest 10
            # Parse date
            published = release.published_at[:10] if release.published_at else "N/A"

            table.add_row(
                release.tag_name,
                release.name or release.tag_name,
                published,
                release.html_url,
            )

        console.print(table)

        if len(releases) > 10:
            console.print(f"\n[dim]Showing 10 of {len(releases)} releases[/dim]")

    except GitHubRateLimitError as e:
        logger.error(str(e))
        raise click.Abort()

    except GitHubDownloadError as e:
        logger.error(str(e))
        raise click.Abort()

    except Exception as e:
        logger.error(f"Failed to fetch versions: {e}")
        raise click.Abort()

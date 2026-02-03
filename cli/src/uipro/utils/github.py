"""GitHub API client for fetching releases."""

from pathlib import Path

import httpx

from uipro.types import Release

REPO_OWNER = "regutierrez"
REPO_NAME = "ui-ux-skill"
API_BASE = "https://api.github.com"


class GitHubRateLimitError(Exception):
    """Raised when GitHub API rate limit is exceeded."""

    pass


class GitHubDownloadError(Exception):
    """Raised when GitHub download fails."""

    pass


def _check_rate_limit(response: httpx.Response) -> None:
    """Check if we've hit GitHub's rate limit.

    Args:
        response: The HTTP response to check.

    Raises:
        GitHubRateLimitError: If rate limit is exceeded.
    """
    remaining = response.headers.get("x-ratelimit-remaining")
    if response.status_code == 403 and remaining == "0":
        reset_time = response.headers.get("x-ratelimit-reset")
        if reset_time:
            from datetime import datetime

            reset_date = datetime.fromtimestamp(int(reset_time)).strftime("%H:%M:%S")
        else:
            reset_date = "unknown"
        raise GitHubRateLimitError(
            f"GitHub API rate limit exceeded. Resets at {reset_date}"
        )
    if response.status_code == 429:
        raise GitHubRateLimitError(
            "GitHub API rate limit exceeded (429 Too Many Requests)"
        )


def fetch_releases() -> list[Release]:
    """Fetch all releases from GitHub.

    Returns:
        List of Release objects.

    Raises:
        GitHubDownloadError: If the API request fails.
        GitHubRateLimitError: If rate limit is exceeded.
    """
    url = f"{API_BASE}/repos/{REPO_OWNER}/{REPO_NAME}/releases"

    with httpx.Client() as client:
        response = client.get(
            url,
            headers={
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "uipro-cli",
            },
        )

        _check_rate_limit(response)

        if not response.is_success:
            raise GitHubDownloadError(
                f"Failed to fetch releases: {response.status_code} {response.reason_phrase}"
            )

        return [Release.from_dict(r) for r in response.json()]


def get_latest_release() -> Release:
    """Fetch the latest release from GitHub.

    Returns:
        The latest Release object.

    Raises:
        GitHubDownloadError: If the API request fails.
        GitHubRateLimitError: If rate limit is exceeded.
    """
    url = f"{API_BASE}/repos/{REPO_OWNER}/{REPO_NAME}/releases/latest"

    with httpx.Client() as client:
        response = client.get(
            url,
            headers={
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "uipro-cli",
            },
        )

        _check_rate_limit(response)

        if not response.is_success:
            raise GitHubDownloadError(
                f"Failed to fetch latest release: {response.status_code} {response.reason_phrase}"
            )

        return Release.from_dict(response.json())


def download_release(url: str, dest: Path) -> None:
    """Download a release asset to a file.

    Args:
        url: URL of the asset to download.
        dest: Destination path for the downloaded file.

    Raises:
        GitHubDownloadError: If the download fails.
        GitHubRateLimitError: If rate limit is exceeded.
    """
    with httpx.Client(follow_redirects=True) as client:
        response = client.get(
            url,
            headers={
                "User-Agent": "uipro-cli",
                "Accept": "application/octet-stream",
            },
        )

        _check_rate_limit(response)

        if not response.is_success:
            raise GitHubDownloadError(
                f"Failed to download: {response.status_code} {response.reason_phrase}"
            )

        dest.write_bytes(response.content)


def get_asset_url(release: Release) -> str | None:
    """Get the download URL for a release's ZIP asset.

    Args:
        release: The Release object.

    Returns:
        Download URL for the ZIP asset, or None if not found.
    """
    # First try to find an uploaded ZIP asset
    for asset in release.assets:
        if asset.name.endswith(".zip"):
            return asset.browser_download_url

    # Fall back to GitHub's auto-generated archive
    if release.tag_name:
        return f"https://github.com/{REPO_OWNER}/{REPO_NAME}/archive/refs/tags/{release.tag_name}.zip"

    return None

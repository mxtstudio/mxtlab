"""Repo manager – high‑level git operations for Kira.

All methods are static and return a dictionary containing the subprocess result. The
functions raise Python exceptions for obvious misuse (e.g., missing repository).
"""

import subprocess
from pathlib import Path
from typing import Dict, List

class RepoManager:
    """Utility class for managing Git repositories.

    The manager is deliberately simple – it uses the system ``git`` binary and returns
    the stdout/stderr of each operation so the orchestrator can embed the result in the
    response payload.
    """

    @staticmethod
    def _run_git(args: List[str], cwd: Path | None = None) -> Dict[str, any]:
        """Execute a ``git`` command.

        Returns a dictionary with ``returncode``, ``stdout`` and ``stderr``.
        ``cwd`` is the working directory for the subprocess (if provided).
        """
        result = subprocess.run(
            ["git"] + args,
            cwd=str(cwd) if cwd else None,
            capture_output=True,
            text=True,
        )
        return {
            "returncode": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr,
        }

    @staticmethod
    def clone(repo_url: str, dest: str = ".") -> Dict[str, any]:
        """Clone *repo_url* into *dest*.

        ``dest`` may be a relative or absolute path. If the directory exists and is not empty,
        the operation fails with ``FileExistsError`` to avoid overwriting existing data.
        """
        dest_path = Path(dest).expanduser().resolve()
        if dest_path.exists() and any(dest_path.iterdir()):
            raise FileExistsError(f"Destination {dest_path} already exists and is not empty")
        return RepoManager._run_git(["clone", repo_url, str(dest_path)])

    @staticmethod
    def pull(repo_path: str) -> Dict[str, any]:
        """Pull the latest changes for the repository at *repo_path*.
        """
        repo_path_obj = Path(repo_path).expanduser().resolve()
        if not (repo_path_obj / ".git").is_dir():
            raise FileNotFoundError(f"{repo_path_obj} is not a git repository")
        return RepoManager._run_git(["pull"], cwd=repo_path_obj)

    @staticmethod
    def status(repo_path: str) -> Dict[str, any]:
        """Return a concise status for *repo_path*.

        The ``changed`` flag is ``True`` when ``git status --porcelain`` reports any
        modifications. ``summary`` contains the raw porcelain lines.
        """
        repo_path_obj = Path(repo_path).expanduser().resolve()
        if not (repo_path_obj / ".git").is_dir():
            raise FileNotFoundError(f"{repo_path_obj} is not a git repository")
        result = RepoManager._run_git(["status", "--porcelain"], cwd=repo_path_obj)
        changed = bool(result["stdout"].strip())
        return {"changed": changed, "summary": result["stdout"].strip()}

    @staticmethod
    def list_files(repo_path: str) -> Dict[str, any]:
        """List all files tracked in *repo_path* (recursively)."""
        repo_path_obj = Path(repo_path).expanduser().resolve()
        if not (repo_path_obj / ".git").is_dir():
            raise FileNotFoundError(f"{repo_path_obj} is not a git repository")
        files = [str(p.relative_to(repo_path_obj)) for p in repo_path_obj.rglob("*") if p.is_file()]
        return {"files": files}

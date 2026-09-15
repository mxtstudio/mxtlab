# Repository manager tests

import os
from pathlib import Path
import pytest

from repo.manager import RepoManager

@pytest.fixture(scope="module")
def existing_repo_path():
    """Path to the already‑cloned mxtlab repository used for read‑only tests."""
    repo_path = Path(os.getcwd()) / "mxtlab_repo"
    assert repo_path.is_dir(), "mxtlab_repo should exist in the project root"
    return str(repo_path)

def test_status_and_list_files(existing_repo_path):
    status = RepoManager.status(existing_repo_path)
    assert isinstance(status, dict)
    # The cloned repo should be clean – no pending changes.
    assert status["changed"] is False
    # ``summary`` should be an empty string for a clean repo.
    assert status["summary"] == ""

    files = RepoManager.list_files(existing_repo_path)
    assert isinstance(files, dict)
    # A known file in the repository should be listed.
    assert "README.md" in files["files"]

def test_clone_repo(tmp_path):
    dest = tmp_path / "clone"
    result = RepoManager.clone("https://github.com/mxtstudio/mxtlab.git", str(dest))
    assert isinstance(result, dict)
    assert result["returncode"] == 0, f"Git clone failed: {result['stderr']}"
    # The cloned directory should contain a .git folder.
    assert (dest / ".git").is_dir()
    # Verify that the cloned repo has a README file.
    assert (dest / "README.md").is_file()

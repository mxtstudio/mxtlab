    if (profile.role === 'teacher' || profile.role === 'admin') {
      const canOpenWorkspace = Boolean(profile.department_id);
      workspace.hidden = !canOpenWorkspace;
      if (signInButton) signInButton.hidden = true;
      status.textContent = canOpenWorkspace
        ? 'Your staff account is approved. Open your Teacher Workspace.'
        : 'Your staff account is approved, but it has not been assigned to a department yet. Contact your administrator.';
      return;
    }
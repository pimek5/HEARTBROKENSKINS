# GitHub Pages setup helper

This repo includes a PowerShell helper script to create (or use an existing) GitHub repository, push your current code, enable GitHub Pages, and poll until the site becomes available.

Files added:
- `scripts/setup_github_pages.ps1` — PowerShell automation script.

How to use (recommended, automated)

1. Create a GitHub Personal Access Token (PAT) with the `repo` and `admin:repo_hook` scopes. Keep it secret.
2. Open PowerShell in the repository root (where `.git` is located).
3. Set the token in your session (do not paste it elsewhere):

```powershell
$env:GITHUB_TOKEN = 'ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
```

4. Run the script:

```powershell
pwsh .\scripts\setup_github_pages.ps1
```

Options
- You can pass parameters to the script, for example to change the owner or repo name:

```powershell
pwsh .\scripts\setup_github_pages.ps1 -Owner 'your-username' -Repo 'MyRepoName' -Branch 'main'
```

Manual (web UI) method

1. On GitHub go to the repository Settings → Pages.
2. Under "Source" choose Branch: `main` and folder: `/ (root)`, then Save.
3. Wait a minute and then open: `https://<your-username>.github.io/<repo>/` (or the HTML URL shown in the Pages settings).

If you prefer, run the automated script above — it will attempt to create the repo under the authenticated user if the repo name isn't found under the requested owner.

If anything fails, copy the error output and open an issue or message me here and I'll help debug.
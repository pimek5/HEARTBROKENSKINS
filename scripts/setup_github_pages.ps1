<#
setup_github_pages.ps1

Usage:
  - Create a GitHub Personal Access Token (classic) with repo and admin:repo_hook scopes.
  - In PowerShell set it as an environment variable for the session:
      $env:GITHUB_TOKEN = '<YOUR_TOKEN_HERE>'
  - Run this script from the repository root (where .git exists):
      pwsh .\scripts\setup_github_pages.ps1

What it does:
  1. Checks whether the remote repo exists on GitHub.
  2. If missing, attempts to create a repository under the authenticated user.
  3. Ensures `origin` remote points to the target repo and pushes the current branch.
  4. Enables GitHub Pages on the repository using the `main` branch (root).
  5. Polls the Pages endpoint until the site becomes available or times out.

Notes:
  - This script requires PowerShell and curl (built-in) and git.
  - The script does not send your token anywhere. Keep your token secret.
#>

param(
    [string]$Owner = 'pimek5',
    [string]$Repo = 'HEARTBROKENSKINS',
    [string]$Branch = 'main',
    [int]$PollSeconds = 5,
    [int]$TimeoutSeconds = 300
)

function ExitWith($msg, $code=1) {
    Write-Error $msg
    exit $code
}

if (-not $env:GITHUB_TOKEN) {
    ExitWith "Environment variable GITHUB_TOKEN is required. Create a PAT and set it: `$env:GITHUB_TOKEN = '...'."
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    ExitWith "git is not available in PATH. Install Git and try again."
}

$apiBase = 'https://api.github.com'
$headers = @{
    Authorization = "token $($env:GITHUB_TOKEN)"
    Accept = 'application/vnd.github+json'
    'User-Agent' = 'setup-github-pages-script'
}

Write-Host "Checking whether repository $Owner/$Repo exists on GitHub..."

$repoUrl = "$apiBase/repos/$Owner/$Repo"
$resp = curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $($env:GITHUB_TOKEN)" $repoUrl

if ($resp -eq '200') {
    Write-Host "Repository exists: $Owner/$Repo"
    $targetOwner = $Owner
} else {
    Write-Host "Repository $Owner/$Repo not found or inaccessible (HTTP $resp). Will try to create a repo under the authenticated user."
    # Get authenticated user
    $userJson = curl -s -H "Authorization: token $($env:GITHUB_TOKEN)" "$apiBase/user"
    try {
        $user = ($userJson | ConvertFrom-Json)
    } catch {
        ExitWith "Failed to query authenticated user. Ensure token is valid."
    }
    $authUser = $user.login
    Write-Host "Authenticated as: $authUser"
    if ($authUser -ne $Owner) {
        Write-Host "Note: creating repo under $authUser instead of requested owner $Owner. If you want the repo under $Owner you'll need to authenticate as that user."
    }

    # Create repo under authenticated user
    $createBody = @{ name = $Repo; private = $false } | ConvertTo-Json
    $createResp = curl -s -X POST -H "Authorization: token $($env:GITHUB_TOKEN)" -H "Accept: application/vnd.github+json" -d $createBody "$apiBase/user/repos"
    try {
        $created = $createResp | ConvertFrom-Json
    } catch {
        ExitWith "Failed to create repository. Response: $createResp"
    }
    if ($created.full_name) {
        Write-Host "Created repository: $($created.full_name)"
        $targetOwner = $created.owner.login
    } else {
        ExitWith "Repository creation failed. Response: $createResp"
    }
}

$remoteUrl = "https://github.com/$targetOwner/$Repo.git"

Write-Host "Ensuring git remote 'origin' points to $remoteUrl"
try {
    git remote remove origin 2>$null
} catch {}
git remote add origin $remoteUrl

Write-Host "Pushing current branch ($Branch) to origin..."
git push -u origin $Branch --force

Write-Host "Enabling GitHub Pages (branch: $Branch, path: /)..."
$pagesUrl = "$apiBase/repos/$targetOwner/$Repo/pages"
$pagesBody = @{ source = @{ branch = $Branch; path = '/' } } | ConvertTo-Json
$pagesResp = curl -s -X PUT -H "Authorization: token $($env:GITHUB_TOKEN)" -H "Accept: application/vnd.github+json" -d $pagesBody $pagesUrl
try { $pagesJson = $pagesResp | ConvertFrom-Json } catch { $pagesJson = $null }

if ($pagesJson -and $pagesJson.html_url) {
    Write-Host "Pages configured, site URL: $($pagesJson.html_url)"
    $siteUrl = $pagesJson.html_url
} else {
    Write-Host "Pages API response: $pagesResp"
    Write-Host "Proceeding to poll the Pages endpoint for readiness..."
    $siteUrl = "https://$($targetOwner).github.io/$Repo/"
}

Write-Host "Polling $siteUrl for availability (timeout: $TimeoutSeconds s)..."
$elapsed = 0
while ($elapsed -lt $TimeoutSeconds) {
    $code = curl -s -o /dev/null -w "%{http_code}" $siteUrl
    if ($code -eq '200') {
        Write-Host "Site is live: $siteUrl"
        exit 0
    }
    Start-Sleep -Seconds $PollSeconds
    $elapsed += $PollSeconds
    Write-Host "Waiting... ($elapsed/$TimeoutSeconds s)"
}

ExitWith "Timed out waiting for Pages to become available at $siteUrl" 2
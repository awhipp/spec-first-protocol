param (
    [Parameter(Mandatory=$false)]
    [Alias("i")]
    [ValidateSet("claude", "antigravity", "cursor", "windsurf", "none")]
    [string]$integration = "none",

    [Parameter(Mandatory=$false)]
    [Alias("r")]
    [string]$repo = $(if ($env:SFP_REPO) { $env:SFP_REPO } else { "awhipp/spec-first-protocol" }),

    [Parameter(Mandatory=$false)]
    [Alias("y")]
    [switch]$yes,

    [Parameter(Mandatory=$false)]
    [Alias("h")]
    [switch]$help
)

# Render help menu
if ($help) {
    Write-Host "Skill Distribution Installer Script"
    Write-Host ""
    Write-Host "Usage: install.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -i, -integration <val>  Target developer tool integration (claude, antigravity, cursor, windsurf, none) [default: none]"
    Write-Host "  -r, -repo <val>         Target GitHub repository owner/name [default: awhipp/spec-first-protocol]"
    Write-Host "  -y, -yes                Bypass target confirmation prompt"
    Write-Host "  -h, -help               Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\install.ps1"
    Write-Host "  .\install.ps1 -i claude"
    Write-Host "  .\install.ps1 -integration cursor -yes"
    Write-Host "  .\install.ps1 -repo myfork/spec-first-protocol"
    exit 0
}

# Input validation: Repo format (owner/repo)
# Must match regex: ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$
if ($repo -notmatch '^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$') {
    Write-Host "Error: Invalid repository format '$repo'. Must match 'owner/repo' (regex: ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$)." -ForegroundColor Red
    exit 1
}

# Resolve Target Directory
$baseDir = $PWD.Path

# Map integrations
switch ($integration) {
    "claude" { $targetDir = Join-Path $baseDir ".claude\skills" }
    "antigravity" { $targetDir = Join-Path $baseDir ".agents\skills" }
    "cursor" { $targetDir = Join-Path $baseDir ".cursor\skills" }
    "windsurf" { $targetDir = Join-Path $baseDir ".windsurf\skills" }
    "none" { $targetDir = Join-Path $baseDir "skills" }
}

Write-Host "Target destination: $targetDir"

# Confirmation prompt
if (-not $yes) {
    $response = Read-Host "Do you want to proceed with the installation to this path? (y/N)"
    if ($response -notmatch '^[yY]$') {
        Write-Host "Installation cancelled."
        exit 0
    }
}

# Set up temporary files
$guid = [Guid]::NewGuid().ToString()
$tempZip = Join-Path $env:TEMP "skills-$guid.zip"
$tempDir = Join-Path $env:TEMP "skills-dir-$guid"

# Configure security protocol for TLS 1.2+
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Download skills.zip
$downloadUrl = "https://github.com/$repo/releases/latest/download/skills.zip"
$checksumUrl = "https://github.com/$repo/releases/latest/download/skills.zip.sha256"
try {
    Write-Host "Downloading skills from $downloadUrl..."
    Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip -UseBasicParsing -ErrorAction Stop
} catch {
    Write-Host "Error: Failed to download from $downloadUrl. Details: $_" -ForegroundColor Red
    if (Test-Path $tempZip) { Remove-Item -Path $tempZip -Force }
    exit 3
}

# Download and verify checksum (guards against corrupted or truncated downloads)
$tempSha = Join-Path $env:TEMP "skills-$guid.sha256"
$verifyChecksum = $true
try {
    Write-Host "Downloading checksum from $checksumUrl..."
    Invoke-WebRequest -Uri $checksumUrl -OutFile $tempSha -UseBasicParsing -ErrorAction Stop
} catch {
    Write-Host "Warning: Failed to download checksum from $checksumUrl. Skipping integrity verification." -ForegroundColor Yellow
    $verifyChecksum = $false
    if (Test-Path $tempSha) { Remove-Item -Path $tempSha -Force }
}

if ($verifyChecksum) {
    $expectedHash = ((Get-Content $tempSha -Raw).Trim() -split '\s+')[0]
    $actualHash = (Get-FileHash -Path $tempZip -Algorithm SHA256).Hash
    if ($expectedHash.ToUpper() -ne $actualHash.ToUpper()) {
        Write-Host "Error: Checksum verification failed." -ForegroundColor Red
        Write-Host "  Expected: $expectedHash" -ForegroundColor Red
        Write-Host "  Actual:   $actualHash" -ForegroundColor Red
        if (Test-Path $tempZip) { Remove-Item -Path $tempZip -Force }
        if (Test-Path $tempSha) { Remove-Item -Path $tempSha -Force }
        exit 3
    }
    Write-Host "Checksum verified."
    if (Test-Path $tempSha) { Remove-Item -Path $tempSha -Force }
}

# Extract and install
try {
    Write-Host "Extracting archive to temporary directory..."
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    Expand-Archive -Path $tempZip -DestinationPath $tempDir -Force -ErrorAction Stop
} catch {
    Write-Host "Error: Extraction failed. Details: $_" -ForegroundColor Red
    if (Test-Path $tempZip) { Remove-Item -Path $tempZip -Force }
    if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force }
    exit 2
}

$extractedSkillsDir = Join-Path $tempDir "skills"
if (-not (Test-Path $extractedSkillsDir)) {
    Write-Host "Error: Extracted archive does not contain a 'skills' directory." -ForegroundColor Red
    if (Test-Path $tempZip) { Remove-Item -Path $tempZip -Force }
    if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force }
    exit 2
}

try {
    # Ensure target parent directory exists
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    # Clean and overwrite on a per-skill basis
    $skills = Get-ChildItem -Path $extractedSkillsDir -Directory
    foreach ($skill in $skills) {
        $skillName = $skill.Name
        $destSkillPath = Join-Path $targetDir $skillName

        if (Test-Path $destSkillPath) {
            Write-Host "Removing existing skill directory: $destSkillPath"
            Remove-Item -Path $destSkillPath -Recurse -Force -ErrorAction Stop
        }

        Write-Host "Installing skill '$skillName' to: $destSkillPath"
        Copy-Item -Path $skill.FullName -Destination $destSkillPath -Recurse -Force -ErrorAction Stop
    }

    # Install and configure updater script
    $updaterSrc = Join-Path $extractedSkillsDir "update.ps1"
    if (Test-Path $updaterSrc) {
        $updaterDest = Join-Path $targetDir "update.ps1"
        Write-Host "Installing updater script 'update.ps1' to: $updaterDest"
        Copy-Item -Path $updaterSrc -Destination $updaterDest -Force -ErrorAction Stop
    } else {
        Write-Warning "update.ps1 not found in the release archive."
    }
} catch {
    Write-Host "Error: File operation failed. Details: $_" -ForegroundColor Red
    exit 2
} finally {
    # Clean up temporary downloads/dirs
    if (Test-Path $tempZip) { Remove-Item -Path $tempZip -Force }
    if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force }
}

Write-Host "Installation completed successfully."
exit 0

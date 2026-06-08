param (
    [Parameter(Mandatory=$false)]
    [Alias("r")]
    [string]$Repo = $(if ($env:SFP_REPO) { $env:SFP_REPO } else { "awhipp/spec-first-protocol" }),

    [Parameter(Mandatory=$false)]
    [Alias("y")]
    [switch]$Yes,

    [Parameter(Mandatory=$false)]
    [Alias("h")]
    [switch]$Help
)

# Render help menu
if ($Help) {
    Write-Host "Skill Distribution Updater Script"
    Write-Host ""
    Write-Host "Usage: update.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -r, -repo, --repo <val>  Target GitHub repository owner/name [default: awhipp/spec-first-protocol]"
    Write-Host "  -y, -yes, --yes          Bypass delete confirmation prompts"
    Write-Host "  -h, -help, --help        Show this help message"
    exit 0
}

# Input validation: Repo format (owner/repo)
if ($Repo -notmatch '^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$') {
    [Console]::Error.WriteLine("Error: Invalid repository format '$Repo'. Must match 'owner/repo' (regex: ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$).")
    exit 1
}

# Target Directory Resolution (directory containing the update script)
$targetDir = $PSScriptRoot

# Set up temporary files
$guid = [Guid]::NewGuid().ToString()
$tempZip = Join-Path $env:TEMP "skills-update-$guid.zip"
$tempDir = Join-Path $env:TEMP "skills-update-dir-$guid"

# Helper function to compute SHA-256 hash of a file
function Get-FileSha256 {
    param([string]$Path)
    if (Test-Path $Path) {
        $hashObj = Get-FileHash -Path $Path -Algorithm SHA256
        return $hashObj.Hash
    }
    return $null
}

# Helper function to get relative files of a directory
function Get-RelativeFiles {
    param([string]$Dir)
    if (-not (Test-Path $Dir)) { return @() }
    $files = Get-ChildItem -Path $Dir -File -Recurse
    $relPaths = @()
    foreach ($file in $files) {
        # Case-insensitive regex replace to handle Windows path case-insensitivity
        $relPath = ($file.FullName -replace [regex]::Escape($Dir), "").TrimStart("\", "/")
        $relPaths += $relPath
    }
    return $relPaths
}

try {
    # Configure security protocol for TLS 1.2+
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

    # Download skills.zip
    $downloadUrl = "https://github.com/$Repo/releases/latest/download/skills.zip"
    try {
        Write-Host "Downloading skills from $downloadUrl..."
        Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip -UseBasicParsing -ErrorAction Stop
    } catch {
        [Console]::Error.WriteLine("Error: Failed to download from $downloadUrl. Details: $_")
        exit 3
    }

    # Extract
    try {
        Write-Host "Extracting archive to temporary directory..."
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
        Expand-Archive -Path $tempZip -DestinationPath $tempDir -Force -ErrorAction Stop
    } catch {
        [Console]::Error.WriteLine("Error: Extraction failed. Details: $_")
        exit 2
    }

    $extractedSkillsDir = Join-Path $tempDir "skills"
    if (-not (Test-Path $extractedSkillsDir)) {
        [Console]::Error.WriteLine("Error: Extracted archive does not contain a 'skills' directory.")
        exit 2
    }

    # Self-Update Flow
    $localPath = Join-Path $targetDir "update.ps1"
    $remotePath = Join-Path $extractedSkillsDir "update.ps1"

    if (-not (Test-Path $remotePath)) {
        [Console]::Error.WriteLine("Error: Remote skills directory does not contain 'update.ps1'.")
        exit 2
    }

    $localHash = Get-FileSha256 $localPath
    $remoteHash = Get-FileSha256 $remotePath

    if ($localHash -ne $remoteHash) {
        Write-Host "Performing self-update..."
        Copy-Item -Path $remotePath -Destination $localPath -Force -ErrorAction Stop
        
        # Clean up temp assets before process replacement to prevent resource leaks
        if (Test-Path $tempZip) { Remove-Item -Path $tempZip -Force }
        if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force }
        
        # Restart script with exact same arguments
        & $localPath -Repo $Repo -Yes:$Yes -Help:$Help
        exit $LASTEXITCODE
    }

    # Skill Synchronization Flow

    # 1. Create/Install and 2. Update Phase
    $remoteSkills = Get-ChildItem -Path $extractedSkillsDir -Directory
    foreach ($remoteSkill in $remoteSkills) {
        $skillName = $remoteSkill.Name
        
        # Only process skills with sfp- prefix
        if (-not ($skillName.StartsWith("sfp-"))) {
            continue
        }
        
        $localSkillPath = Join-Path $targetDir $skillName
        
        if (-not (Test-Path $localSkillPath)) {
            Write-Host "Installing new skill '$skillName'..."
            Copy-Item -Path $remoteSkill.FullName -Destination $localSkillPath -Recurse -Force -ErrorAction Stop
        } else {
            # Compare local and remote skill contents recursively
            $different = $false
            
            $remoteRelPaths = Get-RelativeFiles $remoteSkill.FullName
            $localRelPaths = Get-RelativeFiles $localSkillPath
            
            if ($remoteRelPaths.Count -ne $localRelPaths.Count) {
                $different = $true
            } else {
                foreach ($relPath in $remoteRelPaths) {
                    $localFile = Join-Path $localSkillPath $relPath
                    if (-not (Test-Path $localFile)) {
                        $different = $true
                        break
                    }
                    
                    $remoteFile = Join-Path $remoteSkill.FullName $relPath
                    $remoteHash = Get-FileSha256 $remoteFile
                    $localHash = Get-FileSha256 $localFile
                    if ($remoteHash -ne $localHash) {
                        $different = $true
                        break
                    }
                }
            }
            
            if ($different) {
                Write-Host "Updating skill '$skillName'..."
                Remove-Item -Path $localSkillPath -Recurse -Force -ErrorAction Stop
                Copy-Item -Path $remoteSkill.FullName -Destination $localSkillPath -Recurse -Force -ErrorAction Stop
            }
        }
    }

    # 3. Delete Phase
    $localSubDirs = Get-ChildItem -Path $targetDir -Directory
    foreach ($localSub in $localSubDirs) {
        $subName = $localSub.Name
        
        # Ignore hidden directories (e.g. starting with .)
        if ($subName.StartsWith(".")) {
            continue
        }
        
        # Only process skills with sfp- prefix
        if (-not ($subName.StartsWith("sfp-"))) {
            continue
        }
        
        # If the local skill directory is not in the remote package
        $remoteSkillPath = Join-Path $extractedSkillsDir $subName
        if (-not (Test-Path $remoteSkillPath)) {
            $confirmDelete = $false
            if ($Yes) {
                $confirmDelete = $true
            } else {
                # Prompt user if in interactive shell, otherwise fail if yes is not specified
                if ($env:CI -or -not [Environment]::UserInteractive) {
                    [Console]::Error.WriteLine("Error: Non-interactive environment detected and no -y/--yes flag was provided to delete '$subName'.")
                    exit 1
                }
                
                $response = Read-Host "The local skill '$subName' is no longer present in the remote repository. Do you want to delete it? (y/N)"
                if ($response -match '^[yY]$') {
                    $confirmDelete = $true
                }
            }
            
            if ($confirmDelete) {
                Write-Host "Deleting skill '$subName'..."
                Remove-Item -Path $localSub.FullName -Recurse -Force -ErrorAction Stop
            } else {
                Write-Host "Skipping deletion of '$subName'."
            }
        }
    }

} finally {
    # Clean up temporary downloads/dirs
    if (Test-Path $tempZip) { Remove-Item -Path $tempZip -Force }
    if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force }
}

Write-Host "Update completed successfully."
exit 0

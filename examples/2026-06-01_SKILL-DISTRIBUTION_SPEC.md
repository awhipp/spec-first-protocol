# Skill Distribution Specification

## 1. Overview

The purpose of this specification is to define the design, installation paths, execution workflows, and packaging automation for distributing the repository's Agent Skills to local and global developer environments. It provides a dependency-minimal, command-line based installation mechanism for both Windows and macOS/Linux environments, allowing users to integrate Spec-First Protocol skills into their choice of agentic developer tools (e.g., Claude, Antigravity, Cursor, Windsurf).

---

## 2. Integration Targets and Directory Mapping

The distribution utility maps specific agentic tool integrations to their respective local and global installation directories.

### Target Mapping Table

| Integration ID | Scope | Operating System | Destination Path |
| :--- | :--- | :--- | :--- |
| `claude` | `local` | All | `./.claude/skills/` |
| `claude` | `global` | macOS / Linux | `~/.claude/skills/` |
| `claude` | `global` | Windows | `$HOME\.claude\skills\` |
| `antigravity` | `local` | All | `./.agents/skills/` |
| `antigravity` | `global` | macOS / Linux | `~/.agents/skills/` |
| `antigravity` | `global` | Windows | `$HOME\.agents\skills\` |
| `cursor` | `local` | All | `./.cursor/skills/` |
| `cursor` | `global` | macOS / Linux | `~/.cursor/skills/` |
| `cursor` | `global` | Windows | `$HOME\.cursor\skills\` |
| `windsurf` | `local` | All | `./.windsurf/skills/` |
| `windsurf` | `global` | macOS / Linux | `~/.windsurf/skills/` |
| `windsurf` | `global` | Windows | `$HOME\.windsurf\skills\` |
| `none` | `local` | All | `./skills/` |
| `none` | `global` | All | *Invalid combination (system errors out)* |

---

## 3. Workflows and Processes

### 3.1. Release Packaging Workflow (GitHub Actions)

1. **Trigger**: Occurs automatically when a new version tag (matching pattern `v*`) is pushed to the repository.
2. **Execution Steps**:
   - Checks out the repository code.
   - Archives the `skills/` directory and its contents into a standard zip file named `skills.zip`.
   - Creates a new GitHub Release corresponding to the pushed tag.
   - Uploads the `skills.zip` archive as a release asset attached to that release.

### 3.2. Installation Script Download Workflow

The user copies a single-line command from the `README.md` and runs it to bootstrap the installation.

- **macOS/Linux (Bash)**:
  - *Without arguments*:

    ```bash
    curl -fsSL https://raw.githubusercontent.com/awhipp/spec-first-protocol/main/scripts/install.sh | bash
    ```

  - *With arguments* (using `bash -s` to forward parameters):

    ```bash
    curl -fsSL https://raw.githubusercontent.com/awhipp/spec-first-protocol/main/scripts/install.sh | bash -s -- -i claude -s global
    ```

- **Windows (PowerShell)**:
  - *Without arguments*:

    ```powershell
    powershell -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/awhipp/spec-first-protocol/main/scripts/install.ps1 | iex"
    ```

  - *With arguments* (wrapping download in a scriptblock invocation to forward parameters):

    ```powershell
    powershell -ExecutionPolicy Bypass -Command "& { [scriptblock]::Create((irm https://raw.githubusercontent.com/awhipp/spec-first-protocol/main/scripts/install.ps1)) -i claude -s global }"
    ```

### 3.3. Script Execution Workflow

Once invoked, the installer script executes the following sequence:

1. **Argument Parsing**: Resolves user inputs for integration type, installation scope, repository source, force mode, and help request.
2. **Input Validation**: Evaluates parameter combinations, immediately failing if invalid options (like `none` integration with `global` scope) or malformed repository strings are supplied.
3. **Destination Resolution**: Computes the target absolute destination directory path on the local system.
4. **Approval Gate**:
   - Prints the resolved target absolute directory path to the console.
   - If the force flag is active, bypasses confirmation.
   - If interactive, prompts the user: `Do you want to proceed with the installation to this path? (y/N)`.
     - *Piped Input Handling*: For macOS/Linux (Bash), when standard input is redirected (e.g. during piped execution), the script must explicitly read the user's confirmation input from `/dev/tty` (i.e. `read -p ... < /dev/tty`).
   - If the response is not `y` or `Y`, exits without modifications.
5. **Download and Extract**:
   - Downloads the packaged `skills.zip` asset from GitHub: `https://github.com/<repo-owner-name>/<repo-name>/releases/latest/download/skills.zip`.
   - Extracts the contents into a temporary directory.
   - Moves the extracted `skills/` subdirectories into the resolved destination path, updating existing directories on a per-skill basis (clearing and overwriting only the specific subfolders belonging to the package).
6. **Clean Up**: Deletes any downloaded zip files or temporary directories.

---

## 4. Interfaces and Command Line Arguments

The installer scripts (`install.sh` and `install.ps1`) expose a command-line interface with the following parameters:

### Arguments Specification

- `-i`, `--integration`
  - **Type**: String
  - **Allowed Values**: `claude`, `antigravity`, `cursor`, `windsurf`, `none`
  - **Default**: `none`
  - **Description**: Target developer tool integration.
- `-s`, `--scope`
  - **Type**: String
  - **Allowed Values**: `local`, `global`
  - **Default**: `local`
  - **Description**: Target installation scope.
- `-r`, `--repo`
  - **Type**: String
  - **Default**: `awhipp/spec-first-protocol`
  - **Description**: Target GitHub repository owner and name, allowing users running forks to fetch their custom assets.
  - **Validation**: The script must validate the format of the custom repository against standard GitHub naming conventions (regex: `^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$`). If malformed, the script must abort execution immediately with exit code `1`.
- `-y`, `--yes`
  - **Type**: Switch / Boolean Flag
  - **Default**: False
  - **Description**: Bypasses the target confirmation prompt, assuming automatic user approval.
- `-h`, `--help`
  - **Type**: Switch / Boolean Flag
  - **Default**: False
  - **Description**: Renders a command help menu detailing parameters, defaults, and examples, then terminates execution.

---

## 5. Constraints and Rules

- **Dependency Minimization**: The scripts must only use native utilities.
  - For Windows: `Powershell v5.1+`, `Invoke-WebRequest`, and `Expand-Archive`.
    - The PowerShell script must explicitly use the `-Force` parameter with `Expand-Archive` (e.g. `Expand-Archive -Path $tempZip -DestinationPath $tempDir -Force`) to allow successful extraction and overwrite of existing files.
  - For macOS/Linux: `bash`, `curl` or `wget`, and `unzip`. The installer script must use `unzip` to extract the downloaded release zip file. If `unzip` is not installed on the system, the script must fail immediately with a clear error message instructing the user to install it.
- **Clean Installation Overwrite**: The installation process must perform updates by clearing and overwriting directories on a *per-skill* basis (meaning it only deletes or replaces the subdirectories/files corresponding to the skills in the package being installed, e.g. `skills/audit/`, `skills/discover/`, `skills/refine/`), preserving other custom skills or files in the parent destination `skills/` directory. Any stale files within those specific skill subdirectories must be removed during the update.
- **Scope Restriction**: A global scope option is disallowed for the `none` integration. If both `-s global` and `-i none` are provided, the script must immediately abort execution with a diagnostic error code.
- **Paths with Spaces**: To ensure the installer functions correctly in environments where paths or home directories contain space characters, all path variables and file system references in both the Bash and PowerShell scripts must be enclosed in double quotes (e.g., `"$TARGET_DIR"` and `"$TargetDir"`).

---

## 6. Failure Modes and Edge Cases

### 6.1. Unsupported Global None Scope

- **Scenario**: User requests `--integration none --scope global`.
- **Behavior**: The script prints a validation error explaining that global installation requires a specific agentic integration, then exits with code `1`.

### 6.2. Non-Interactive Run Without Force Flag

- **Scenario**: The installer script runs in a CI pipeline or a non-interactive/non-tty environment (detected in macOS/Linux by checking the `CI` environment variable or testing if `/dev/tty` is writable), and no `-y` or `--yes` flag is passed.
- **Behavior**:
  - **macOS/Linux (Bash)**: The script immediately exits with code `1` to prevent hanging, rather than attempting to prompt the user.
  - **Windows (PowerShell)**: Because the script is designed exclusively for local developer environments, no non-interactive checks are performed, and it will rely on standard interactive prompts via `Read-Host`.

### 6.3. Target Path Unwritable

- **Scenario**: The resolved destination directory is read-only, requires root privileges, or is locked by another process.
- **Behavior**: The script catch-blocks the file write/move operation, prints a permission error message, and exits with code `2`.

### 6.4. Download Failure

- **Scenario**: The network is offline, the GitHub API is rate-limiting, or the specified repository doesn't have a release.
- **Behavior**:
  - The macOS/Linux script must run `curl` with the `-f` / `--fail` flag (or check HTTP status codes if `wget` is used) so that HTTP errors are caught immediately during download.
  - The script reports a connection error, details the URL that failed to download, and exits with code `3` (rather than continuing to a failed extraction phase).

---

## 7. Deliverables

### 7.1. macOS/Linux Bootstrap Script

- **File Path**: `scripts/install.sh`
- **Format**: Bash script (`#!/usr/bin/env bash`) containing argument parsing, validation, directory resolution, interactive prompting (with stdin redirection from `/dev/tty` when piped), downloading (using `curl -f`), and per-skill extraction.

### 7.2. Windows Bootstrap Script

- **File Path**: `scripts/install.ps1`
- **Format**: PowerShell script containing equivalent command parsing, validation, directory resolution (using `$HOME`), interactive prompt, download, and extraction (using `Expand-Archive -Force`).

### 7.3. Release Automation Workflow

- **File Path**: `.github/workflows/release-skills.yml`
- **Format**: GitHub Action YAML script mapping tag creation (`v*`) to the execution of the zip compression and release creation.

### 7.4. Documentation Update

- **File Path**: [README.md](file:///c:/Users/alexr/OneDrive/Desktop/spec-first-protocol/README.md)
- **Format**: Markdown updates to include a copyable single-command code fence under the **Installation** section for users to copy and run directly, with examples for passing arguments.

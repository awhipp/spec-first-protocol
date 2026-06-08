#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -eo pipefail

# Default values
REPO="${SFP_REPO:-awhipp/spec-first-protocol}"
YES=false
HELP=false

# Render help menu
show_help() {
  echo "Skill Distribution Updater Script"
  echo ""
  echo "Usage: update.sh [options]"
  echo ""
  echo "Options:"
  echo "  -r, --repo <val>         Target GitHub repository owner/name [default: awhipp/spec-first-protocol]"
  echo "  -y, --yes                Bypass delete confirmation prompts"
  echo "  -h, --help               Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./update.sh"
  echo "  ./update.sh -y"
  echo "  ./update.sh --repo myfork/spec-first-protocol"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -r|-repo|--repo)
      if [[ -z "$2" || "$2" == -* ]]; then
        echo "Error: Argument for $1 is missing." >&2
        exit 1
      fi
      REPO="$2"
      shift 2
      ;;
    -y|-yes|--yes)
      YES=true
      shift
      ;;
    -h|-help|--help)
      HELP=true
      shift
      ;;
    *)
      echo "Error: Unknown option: $1" >&2
      show_help
      exit 1
      ;;
  esac
done

if [ "$HELP" = true ]; then
  show_help
  exit 0
fi

# Input validation: Repo format (owner/repo)
if [[ ! "$REPO" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
  echo "Error: Invalid repository format '$REPO'. Must match 'owner/repo' (regex: ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$)." >&2
  exit 1
fi

# Target Directory Resolution (directory containing the update script)
TARGET_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Dependency check: unzip is required
if ! command -v unzip >/dev/null 2>&1; then
  echo "Error: 'unzip' is not installed. Please install 'unzip' to proceed." >&2
  exit 1
fi

# Dependency check: sha256 utility is required
if ! command -v sha256sum >/dev/null 2>&1 && ! command -v shasum >/dev/null 2>&1 && ! command -v openssl >/dev/null 2>&1; then
  echo "Error: No sha256 utility found (sha256sum, shasum, or openssl are required)." >&2
  exit 1
fi

# Helper function to compute SHA-256 hash of a file
get_sha256() {
  local file="$1"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$file" | awk '{print $1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$file" | awk '{print $1}'
  elif command -v openssl >/dev/null 2>&1; then
    local hash
    hash=$(openssl dgst -sha256 -r "$file" 2>/dev/null | awk '{print $1}') || true
    if [ -z "$hash" ]; then
      hash=$(openssl dgst -sha256 "$file" | awk -F'= ' '{print $2}')
    fi
    echo "$hash"
  else
    echo "Error: No sha256 utility found." >&2
    exit 1
  fi
}

# Download skills.zip
DOWNLOAD_URL="https://github.com/${REPO}/releases/latest/download/skills.zip"
TEMP_ZIP=$(mktemp /tmp/skills-update-XXXXXX.zip)

# Cleanup helper in case of failure or exit
cleanup() {
  if [ -n "$TEMP_ZIP" ] && [ -f "$TEMP_ZIP" ]; then
    rm -f "$TEMP_ZIP" || true
  fi
  if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR" || true
  fi
}
trap cleanup EXIT INT TERM

if command -v curl >/dev/null 2>&1; then
  echo "Downloading skills from $DOWNLOAD_URL using curl..."
  if ! curl -fsSL -o "$TEMP_ZIP" "$DOWNLOAD_URL"; then
    echo "Error: Failed to download from $DOWNLOAD_URL" >&2
    exit 3
  fi
elif command -v wget >/dev/null 2>&1; then
  echo "Downloading skills from $DOWNLOAD_URL using wget..."
  if ! wget -q -O "$TEMP_ZIP" "$DOWNLOAD_URL"; then
    echo "Error: Failed to download from $DOWNLOAD_URL" >&2
    exit 3
  fi
else
  echo "Error: Neither curl nor wget was found. Please install curl or wget." >&2
  exit 1
fi

# Extract
TEMP_DIR=$(mktemp -d /tmp/skills-update-dir-XXXXXX)
if [ ! -d "$TEMP_DIR" ]; then
  echo "Error: Failed to create temporary extraction directory." >&2
  exit 2
fi

if ! unzip -q "$TEMP_ZIP" -d "$TEMP_DIR"; then
  echo "Error: Extraction failed." >&2
  exit 2
fi

if [ ! -d "$TEMP_DIR/skills" ]; then
  echo "Error: Extracted archive does not contain a 'skills' directory." >&2
  exit 2
fi

# Self-Update Flow
if [ ! -f "$TEMP_DIR/skills/update.sh" ]; then
  echo "Error: Remote skills directory does not contain 'update.sh'." >&2
  exit 2
fi

LOCAL_HASH=$(get_sha256 "$TARGET_DIR/update.sh")
REMOTE_HASH=$(get_sha256 "$TEMP_DIR/skills/update.sh")

if [ "$LOCAL_HASH" != "$REMOTE_HASH" ]; then
  echo "Performing self-update..."
  TEMP_UPDATER_COPY="$TARGET_DIR/update.sh.tmp"
  cp "$TEMP_DIR/skills/update.sh" "$TEMP_UPDATER_COPY"
  chmod +x "$TEMP_UPDATER_COPY"
  mv "$TEMP_UPDATER_COPY" "$TARGET_DIR/update.sh"
  
  # Clean up temp assets before process replacement to prevent resource leaks
  cleanup
  
  # Restart script with exact same arguments
  exec "$TARGET_DIR/update.sh" "$@"
fi

# Skill Synchronization Flow

# 1. Create/Install and 2. Update Phase
for remote_skill_path in "$TEMP_DIR/skills"/*; do
  if [ -d "$remote_skill_path" ]; then
    skill_name=$(basename "$remote_skill_path")
    
    # Only process skills with sfp- prefix
    if [[ "$skill_name" != sfp-* ]]; then
      continue
    fi
    
    local_skill_path="$TARGET_DIR/$skill_name"
    
    if [ ! -d "$local_skill_path" ]; then
      echo "Installing new skill '$skill_name'..."
      if ! cp -R "$remote_skill_path" "$local_skill_path"; then
        echo "Error: Failed to install skill '$skill_name'." >&2
        exit 2
      fi
    else
      # Compare local and remote skill contents recursively
      DIFFERENT=false
      
      # We check files in remote vs local
      while IFS= read -r -d '' r_file_abs; do
        rel_path="${r_file_abs#$remote_skill_path/}"
        l_file_abs="$local_skill_path/$rel_path"
        
        if [ ! -f "$l_file_abs" ]; then
          DIFFERENT=true
          break
        fi
        
        r_hash=$(get_sha256 "$r_file_abs")
        l_hash=$(get_sha256 "$l_file_abs")
        if [ "$r_hash" != "$l_hash" ]; then
          DIFFERENT=true
          break
        fi
      done < <(find "$remote_skill_path" -type f -print0)
      
      # We check if local has extra files not in remote
      if [ "$DIFFERENT" = false ]; then
        while IFS= read -r -d '' l_file_abs; do
          rel_path="${l_file_abs#$local_skill_path/}"
          r_file_abs="$remote_skill_path/$rel_path"
          
          if [ ! -f "$r_file_abs" ]; then
            DIFFERENT=true
            break
          fi
        done < <(find "$local_skill_path" -type f -print0)
      fi
      
      if [ "$DIFFERENT" = true ]; then
        echo "Updating skill '$skill_name'..."
        if ! rm -rf "$local_skill_path"; then
          echo "Error: Failed to remove old skill directory '$local_skill_path'." >&2
          exit 2
        fi
        if ! cp -R "$remote_skill_path" "$local_skill_path"; then
          echo "Error: Failed to copy updated skill '$skill_name'." >&2
          exit 2
        fi
      fi
    fi
  fi
done

# 3. Delete Phase
for local_sub in "$TARGET_DIR"/*; do
  if [ -d "$local_sub" ]; then
    sub_name=$(basename "$local_sub")
    
    # Ignore hidden directories (e.g. starting with .)
    if [[ "$sub_name" == .* ]]; then
      continue
    fi
    
    # Only process skills with sfp- prefix
    if [[ "$sub_name" != sfp-* ]]; then
      continue
    fi
    
    # If the local skill directory is not in the remote package
    if [ ! -d "$TEMP_DIR/skills/$sub_name" ]; then
      CONFIRM=false
      if [ "$YES" = true ]; then
        CONFIRM=true
      else
        # Prompt user if in interactive shell, otherwise fail if yes is not specified
        if [ -n "$CI" ] || [ ! -w /dev/tty ]; then
          echo "Error: Non-interactive environment detected and no -y/--yes flag was provided to delete '$sub_name'." >&2
          exit 1
        fi
        
        echo -n "The local skill '$sub_name' is no longer present in the remote repository. Do you want to delete it? (y/N): "
        read -r RESPONSE < /dev/tty
        if [[ "$RESPONSE" =~ ^[yY]$ ]]; then
          CONFIRM=true
        fi
      fi
      
      if [ "$CONFIRM" = true ]; then
        echo "Deleting skill '$sub_name'..."
        if ! rm -rf "$local_sub"; then
          echo "Error: Failed to delete skill '$sub_name'." >&2
          exit 2
        fi
      else
        echo "Skipping deletion of '$sub_name'."
      fi
    fi
  fi
done

echo "Update completed successfully."
exit 0

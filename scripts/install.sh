#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -eo pipefail

# Default values
INTEGRATION="none"
REPO="awhipp/spec-first-protocol"
YES=false
HELP=false

# Render help menu
show_help() {
  echo "Skill Distribution Installer Script"
  echo ""
  echo "Usage: install.sh [options]"
  echo ""
  echo "Options:"
  echo "  -i, --integration <val>  Target developer tool integration (claude, antigravity, cursor, windsurf, none) [default: none]"
  echo "  -r, --repo <val>         Target GitHub repository owner/name [default: awhipp/spec-first-protocol]"
  echo "  -y, --yes                Bypass target confirmation prompt"
  echo "  -h, --help               Show this help message"
  echo ""
  echo "Examples:"
  echo "  install.sh"
  echo "  install.sh -i claude"
  echo "  install.sh --integration cursor --yes"
  echo "  install.sh --repo myfork/spec-first-protocol"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -i|--integration)
      if [[ -z "$2" || "$2" == -* ]]; then
        echo "Error: Argument for $1 is missing." >&2
        exit 1
      fi
      INTEGRATION="$2"
      shift 2
      ;;
    -r|--repo)
      if [[ -z "$2" || "$2" == -* ]]; then
        echo "Error: Argument for $1 is missing." >&2
        exit 1
      fi
      REPO="$2"
      shift 2
      ;;
    -y|--yes)
      YES=true
      shift
      ;;
    -h|--help)
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

# Input validation: Allowed integrations
case "$INTEGRATION" in
  claude|antigravity|cursor|windsurf|none) ;;
  *)
    echo "Error: Invalid integration '$INTEGRATION'. Allowed values: claude, antigravity, cursor, windsurf, none." >&2
    exit 1
    ;;
esac

# Input validation: Repo format (owner/repo)
# Must match regex: ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$
if [[ ! "$REPO" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
  echo "Error: Invalid repository format '$REPO'. Must match 'owner/repo' (regex: ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$)." >&2
  exit 1
fi

# Target Directory Resolution
if [ -z "$BASE_DIR" ]; then
  BASE_DIR="$(pwd)"
fi

case "$INTEGRATION" in
  claude)
    TARGET_DIR="$BASE_DIR/.claude/skills"
    ;;
  antigravity)
    TARGET_DIR="$BASE_DIR/.agents/skills"
    ;;
  cursor)
    TARGET_DIR="$BASE_DIR/.cursor/skills"
    ;;
  windsurf)
    TARGET_DIR="$BASE_DIR/.windsurf/skills"
    ;;
  none)
    TARGET_DIR="$BASE_DIR/skills"
    ;;
esac

echo "Target destination: $TARGET_DIR"

# Check if non-interactive and no yes flag passed
if [ "$YES" = false ]; then
  if [ -n "$CI" ] || [ ! -w /dev/tty ]; then
    echo "Error: Non-interactive environment detected and no -y/--yes flag was provided." >&2
    exit 1
  fi

  # Interactive prompt
  echo -n "Do you want to proceed with the installation to this path? (y/N): "
  read -r RESPONSE < /dev/tty
  if [[ ! "$RESPONSE" =~ ^[yY]$ ]]; then
    echo "Installation cancelled."
    exit 0
  fi
fi

# Dependency check: unzip is required
if ! command -v unzip >/dev/null 2>&1; then
  echo "Error: 'unzip' is not installed. Please install 'unzip' to proceed." >&2
  exit 1
fi

# Download skills.zip
DOWNLOAD_URL="https://github.com/${REPO}/releases/latest/download/skills.zip"
TEMP_ZIP=$(mktemp /tmp/skills-XXXXXX.zip)

# Cleanup helper in case of failure or exit
cleanup() {
  rm -f "$TEMP_ZIP" || true
  if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR" || true
  fi
}
trap cleanup EXIT

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

# Extract and install
TEMP_DIR=$(mktemp -d /tmp/skills-dir-XXXXXX)
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

if ! mkdir -p "$TARGET_DIR"; then
  echo "Error: Failed to create or write to target directory '$TARGET_DIR'." >&2
  exit 2
fi

# Clean and overwrite on a per-skill basis
for skill_path in "$TEMP_DIR/skills"/*; do
  if [ -d "$skill_path" ]; then
    skill_name=$(basename "$skill_path")
    dest_skill_path="$TARGET_DIR/$skill_name"

    if [ -d "$dest_skill_path" ]; then
      echo "Removing existing skill directory: $dest_skill_path"
      if ! rm -rf "$dest_skill_path"; then
        echo "Error: Failed to remove existing skill directory '$dest_skill_path'." >&2
        exit 2
      fi
    fi

    echo "Installing skill '$skill_name' to: $dest_skill_path"
    if ! cp -R "$skill_path" "$dest_skill_path"; then
      echo "Error: Failed to copy skill '$skill_name' to '$dest_skill_path'." >&2
      exit 2
    fi
  fi
done

echo "Installation completed successfully."
exit 0

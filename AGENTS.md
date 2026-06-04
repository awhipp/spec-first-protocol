# Agent Instructions

## 1. System Overview & Architecture

### High-Level Domain

The Spec-First Protocol (SFP) is a domain-agnostic, adversarial requirements
verification pipeline. Its objective is to shift the cognitive load of formal
specification writing from project owners to an automated pipeline of
specialized AI agent skills. This repository acts as the core distribution
center for SFP skills and hosts the protocol's onboarding website.

### Tech Stack

- **Agent Skills**: Markdown (`SKILL.md`) utilizing standard Anthropic skill
  manifest structures and YAML frontmatter.
- **Installer Scripts**: Shell scripting (`install.sh` for macOS/Linux and
  `install.ps1` for Windows PowerShell).
- **Onboarding App & Tooling**: Static client-side JS (`docs/app.js`), CSS, and
  HTML. Node.js is leveraged for documentation builders
  (`scripts/build-docs.js`) and local Markdown linting tools.

### Component Map

```text
spec-first-protocol/
├── .github/workflows/          # CI/CD pipelines (linter, releases)
├── docs/                       # Onboarding & marketing static website
│   ├── data/                   # Example specifications displayed on site
│   ├── app.js                  # Client interaction logic for site
│   └── index.html              # Marketing page
├── examples/                   # Reference specifications (frozen)
├── scripts/                    # Installer & documentation build helper scripts
│   ├── install.sh              # Unix bootstrap installer script
│   └── install.ps1             # Windows bootstrap installer script
└── skills/                     # Core Spec-First Protocol Agent Skills
    ├── sfp-discover/           # Requirements discovery & compilation
    ├── sfp-audit/              # Adversarial review & finalization gate
    ├── sfp-refine/             # Finding resolution & re-compilation
    └── sfp-orchestrate/        # Continuous pipeline orchestrator
```

---

## 2. Directory Layout & Entrypoints

The agent entrypoints exist at the root and inside config folders, all
pointing back to `AGENTS.md`:

- **Root Source of Truth**: `AGENTS.md`
- **Symlink Entrypoints**:
  - `.cursorrules` (Cursor editor agent) -> `AGENTS.md`
  - `CLAUDE.md` (Claude CLI tool) -> `AGENTS.md`
  - `.github/copilot-instructions.md` (Copilot instructions) -> `../AGENTS.md`

---

## 3. Workflows and Processes

### Symlink Creation and Git Tracking

To support multiple environments seamlessly, all symlinks will be created and
committed directly to the Git repository as symbolic link objects.

1. The symlinks are created and checked into version control.
2. In Git, these are tracked as symlinks (`mode 120000`).

### Windows Environment Configuration

Because Git for Windows disables symbolic links by default during checkout,
developers on Windows must configure Git and their OS permissions:

1. **Enable Windows Developer Mode**: Open Settings -> Privacy & security ->
   For developers -> Enable "Developer Mode" (or configure the Local
   Security Policy for "Create symbolic links" for the user).
2. **Configure Git Symlink Support**:

   ```powershell
   git config --local core.symlinks true
   ```

3. **Re-checkout Checked-in Symlinks**: If repository symlinks were cloned
   before configuring Git and are checked out as plain text files:

   ```powershell
   git reset --hard HEAD
   ```

### Manual Symlink Creation on Windows

If git-tracked symlinks fail to check out as native symlinks on a Windows
system, developers can manually recreate them using one of the following
commands:

- **PowerShell (with Developer Mode enabled)**:

  ```powershell
  New-Item -ItemType SymbolicLink -Path ".cursorrules" -Value "AGENTS.md"
  New-Item -ItemType SymbolicLink -Path "CLAUDE.md" -Value "AGENTS.md"
  New-Item -ItemType SymbolicLink -Path ".github\copilot-instructions.md" -Value "..\AGENTS.md"
  ```

- **Command Prompt (Run as Administrator or with Developer Mode)**:

  ```text
  mklink .cursorrules AGENTS.md
  mklink CLAUDE.md AGENTS.md
  mklink .github\copilot-instructions.md ..\AGENTS.md
  ```

---

## 4. Operational Personas & Modes

AI agents must operate under one of these explicit operational modes, matching
the user's task context:

### Architect Mode (System & Protocol Design)

- **Goal**: Focus on high-level SFP workflow rules, skill design, system
  boundaries, and directory layout.
- **Behavior**: Emphasize design-first planning. Propose modifications and
  clarify constraints before making destructive changes. Ensure skill logic is
  mathematically and operationally consistent across platforms.

### Code Mode (Implementation & Refactoring)

- **Goal**: Focus on scripting, UI/frontend development, and system script
  updates.
- **Behavior**: Prioritize platform compatibility, clean vanilla
  implementations, type safety, and minimal dependencies. Do not write
  Unix-specific scripts without verifying their Windows equivalents, and vice
  versa.

### Test Mode (Verification & Auditing)

- **Goal**: Focus on QA, running linters, setting up sandboxes, and
  verification.
- **Behavior**: Focus on running the local verification test suites (e.g.,
  `markdownlint-cli2`) and executing installer tests within safe local testing
  boundaries.

---

## 5. Development Guardrails & Constraints

Every agent operating in this repository must adhere to the following
constraints:

### Markdown Linting

- All Markdown files must comply with the project's `.markdownlint.json` rules.
- **Local Verification Command**: Run the following command to lint Markdown
  files locally:

  ```bash
  npx markdownlint-cli2 "**/*.md"
  ```

### Conventional Commits

- Commit messages must follow the conventional commit format:
  `<type>(<scope>): <description>` (e.g., `feat(skills): add new git-audit
  skill` or `fix(discover): resolve path delimiter issue`).
- Allowed types include: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
  `test`, `build`, `ci`, `chore`, and `revert`.

### File and Token Limits

- Guidelines apply strictly to files in the `skills/` directory (ignoring
  the gitignored `.agents/` directory).
- `SKILL.md` length: Must be $\le$ 500 lines (approximately 5,000 tokens) to
  fit in context windows.
- YAML description: Must be $\le$ 200 characters for reliable routing across
  agents.
- Reference documents: Must be $\le$ 300 lines (approximately 6 KB) per file.

### Communication Style

- **Documentation and READMEs**: Maintain an informative, concise, and
  easy-to-understand tone. Focus on brevity and high clarity.
- **Skill Definitions (`skills/`)**: Formulate instructions with precise,
  structured language to ensure that LLM-based agents can parse and execute
  the tasks without ambiguity.

### Reference Links

- When referencing files in responses or documentation, agents must use
  traditional relative Markdown links (e.g., `[README.md](README.md)`) rather
  than absolute paths or `file:///` URLs.

### Modifying and Code Integrity

- **Code Preservation**: Retain existing docstrings, code structure, and
  comments unless explicitly asked to modify them.
- **Plan and Execute**: For complex modifications, follow a structured
  planning phase (Plan -> Approval -> Execute -> Verify).
- **Git Stage and Commit Boundary**: Agents must NOT automatically stage (e.g.,
  `git add`), commit, or push files unless the user has explicitly requested
  it in the chat. Staging, committing, and pushing are the sole responsibility
  of the developer/user unless a command is requested.

### Agent Best Practices

- **No-CD Invariant**: Agents must avoid running `cd` commands. Terminal State
  is not guaranteed to persist across execution environments; instead, pass the
  correct working directory (Cwd) to tools or run commands relative to the
  project root.
- **Windows Shell Empathy**: When running commands on a Windows host, do not use
  Unix-specific utilities or shell concepts (such as `export`, `cat`, or
  `&&`). Use PowerShell syntax, write temporary scripts, or leverage cross-OS
  node CLI commands.
- **No-TODO Invariant**: Do not commit code, specifications, or documentation
  containing `TODO`, `FIXME`, or placeholders. All sections must be complete or
  omitted.
- **Dependency Hygiene**: Keep dependencies minimal. Avoid introducing new
  external libraries or packages unless explicitly asked or required.

### System Boundaries & Modification Constraints

- **Frozen Specs**: The examples under `examples/` and static reference spec
  files inside `docs/data/` are frozen references. Do not modify them unless
  explicitly asked.
- **Skill-Frontend Sync**: If changes are made to core SFP skills in `skills/`
  that affect their default paths, parameters, or configurations, those changes
  must be mirrored in the onboarding website client logic (`docs/app.js`) and
  the docs builder (`scripts/build-docs.js`).
- **Shell Scripting Safe Mode**: When modifying `scripts/install.sh` or
  `scripts/install.ps1`, agents must test the scripts using temporary,
  non-system destination folders. Installer actions must not leave side effects
  or modify configuration files outside designated directories.

---

## 6. Workflow Protocol

Agents should follow this tool-agnostic workflow for any non-trivial changes:

### Discovery Phase

- **Inspect Patterns**: Before drafting any implementation, inspect active
  patterns in matching components (e.g. check how other skills are structured
  in `skills/` or how client methods are written in `docs/app.js`). Do not
  introduce redundant or non-standard abstractions if local conventions already
  exist.

### Planning Phase

- **Define Scope**: Write down or present a plan listing files to modify/create,
  testing strategies, and open questions. Obtain user sign-off before editing
  code files.

### Implementation Phase

- **Incremental Changes**: Make modular, step-by-step edits. Avoid massive
  single-turn modifications.
- **Clean Code**: Ensure types, variables, and documentation contain zero
  placeholders or `TODO` comments.

### Verification Phase

- **Local Checks**: Execute the project linters (`npx markdownlint-cli2`) and
  run safe manual tests. Confirm all tests pass successfully before declaring
  the task complete.

---

## 7. Failure Modes and Edge Cases

### Broken or Text-only Symlinks on Windows

If Windows users do not have Developer Mode enabled or `core.symlinks`
configured, Git will check out the symlink files as single-line text files
containing the path `AGENTS.md` or `../AGENTS.md`.

- **Mitigation**: Run `git config --local core.symlinks true` and reset the
  repository state. Alternatively, follow the manual `mklink` or PowerShell
  `New-Item` fallback commands listed under the workflows section.

### CI Linting Failure

If an agent modifies a Markdown file and introduces formatting that violates the
Markdown lint rules, CI tests will fail.

- **Mitigation**: Agents are required to check and verify Markdown compliance
  against the updated `.markdownlint.json` schema before submitting changes.

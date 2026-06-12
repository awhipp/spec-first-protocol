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
  manifest structures and YAML frontmatter. All core Spec-First Protocol skills
  must be prepended/prefixed with `sfp-` (e.g., `sfp-discover`). Custom or
  third-party skills must not use the `sfp-` prefix.
- **Distribution Mechanism**: Skills are distributed via the Vercel Labs
  `skills` package manager using `npx skills` commands, and pre-packaged manual
  ZIP release archives.
- **Onboarding App & Tooling**: A Vite + React 19 single-page application
  (`docs/`) using Tailwind CSS 4 for styling, with Vitest for unit testing,
  ESLint for linting, and Prettier for formatting. A Node.js build helper
  (`scripts/build-docs.js`) pre-processes specification data for the portal.

### Component Map

```text
spec-first-protocol/
├── .github/workflows/          # CI/CD pipelines
│   ├── deploy-portal.yml       # Vite build, test & GitHub Pages deploy
│   ├── lint.yml                # Markdown linting on push/PR
│   └── release-skills.yml      # Release-please + skills.zip packaging
├── docs/                       # Onboarding & marketing portal (Vite + React)
│   ├── public/                 # Static assets directory served directly
│   │   └── data/               # Example specifications displayed on site
│   ├── src/                    # React source code
│   │   ├── App.jsx             # Main application component
│   │   ├── components/         # Reusable UI components
│   │   ├── index.css           # Global styles (Tailwind)
│   │   └── main.jsx            # Application entrypoint
│   ├── index.html              # HTML shell
│   ├── vite.config.js          # Vite build configuration
│   ├── eslint.config.js        # ESLint configuration
│   └── package.json            # Dependencies & scripts
├── examples/                   # Reference specifications (frozen)
│   └── non-software/           # Non-software domain examples
├── scripts/                    # Build helper scripts
│   └── build-docs.js           # Pre-processes spec data for the portal
└── skills/                     # Core Spec-First Protocol Agent Skills
    ├── sfp-discover/           # Requirements discovery & compilation
    ├── sfp-audit/              # Adversarial review & finalization gate
    ├── sfp-refine/             # Finding resolution & re-compilation
    ├── sfp-orchestrate/        # Continuous pipeline orchestrator
    └── sfp-personas/           # Persona creation, refinement & domain configurations
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
- **Ignored Files**: The `markdownlint-cli2` configuration ignores transient,
  generated, and reference paths: `CLAUDE.md`,
  `.github/copilot-instructions.md`, `CHANGELOG.md`, `examples/**`,
  `docs/public/data/**`, `**_SPEC**.md`, `.sfp/**`, `**/node_modules/**`, and
  `**/dist/**`.
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
- Persona files: Must be $\le$ 300 lines per file to remain within
  supplementary material limits.

### Skill Naming Conventions

- Core Spec-First Protocol skills must be prepended/prefixed with `sfp-`
  (e.g., `sfp-discover`).
- Custom or local user-created skills must not start with the `sfp-` prefix.
  This distinction prevents namespace conflicts and ensures that updater scripts
  (`update.sh` and `update.ps1`) do not attempt to modify or delete custom
  local skills.

### Persona Naming Conventions

- Persona configuration files inside `skills/sfp-personas/` must use
  lowercase, hyphenated filenames matching the persona slug (e.g.,
  `travel-advisor.md`).
- Files prefixed with `_` (e.g., `_TEMPLATE.md`) are excluded from persona
  detection and serve as scaffolding templates.
- Each persona file must contain YAML frontmatter with `name`, `domain`,
  and `description` fields to enable intelligent matching during discovery.

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
  files inside `docs/public/data/` are frozen references. Do not modify them unless
  explicitly asked.
- **Skill-Frontend Sync**: If changes are made to core SFP skills in `skills/`
  that affect their default paths, parameters, or configurations, those changes
  must be mirrored in the onboarding portal source (`docs/src/App.jsx` and
  `docs/src/components/`) and the docs builder (`scripts/build-docs.js`).
- **Persona Schema Integrity**: Persona files in `skills/sfp-personas/` must
  follow the schema defined in `_TEMPLATE.md`. Changes to the persona schema
  must be reflected in the template, the personas README, and all existing
  persona files.
- **Agent Instructions Up-to-date**: If changes are made to the repository
  architecture, tech stack, workflows, or CLI runner integration, agents
  must update `AGENTS.md` to ensure instructions remain consistent.

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
- **Agent Instructions Sync**: If changes affect the repository architecture,
  tech stack, workflows, or scripts, update `AGENTS.md` at the end of the
  verification phase (rather than during implementation) to ensure instructions
  remain consistent without introducing multiple small updates.

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

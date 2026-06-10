# SFP-UI Marketing Site Specification

## 1. Overview

The purpose of this specification is to design and build a clean, static marketing website for the Spec-First Protocol (SFP). The website is fully housed in the `docs/` directory of the repository to enable direct and automatic deployment to GitHub Pages. The target audience includes developers, project owners, and AI agents interested in using or contributing to the Spec-First Protocol.

## 2. Domain Model and Site Structure

The website is a single-page application structured entirely from static files served directly by the browser:

- **Entry Point**: `docs/index.html` serves as the sole HTML document containing SEO metadata, semantic layout, and structural content.
- **Design & Layout**: `docs/styles.css` houses style rules, grid positioning, and layout tokens.
- **Logic & Interactions**: `docs/app.js` manages class toggles for interactive components, client-side Markdown fetching, and error checking.
- **Branding Assets**: `docs/favicon.svg` provides a clean SVG favicon matching the `header__logo-icon` SVG path, supporting both light and dark browser themes.
- **Dynamic Content**: Documentation assets (e.g., the `SKILL-DISTRIBUTION` and `SFP-UI` specs) are synced into the `docs/data/` folder and fetched at runtime.
- **Theme State**: The site is styled in a single, highly readable Light Mode (slate aesthetic) optimized for code reading and clarity, eliminating dark mode toggle complexity.

## 3. Workflows and Processes

### 3.1 Local Build and Sync

Before committing and pushing changes, the documentation content must be prepared:

1. The developer executes the synchronization script:

   ```bash
   node scripts/build-docs.js
   ```

2. The script copies the root `README.md` and all files from `examples/` into the `docs/data/` directory.
3. If source folders are missing or copying fails, the script handles the error gracefully by printing a descriptive message to `stderr` and exiting with a non-zero code.
4. On success, the files are tracked under `docs/data/` as static deployment assets.

### 3.2 Deployment

1. The developer pushes changes to the repository's `main` branch.
2. GitHub Pages, configured to host from the `/docs` folder of the `main` branch, automatically deploys the updated directory.

### 3.3 Dynamic Content Rendering

When a user visits the website:

1. The browser loads `docs/index.html`.
2. The page loads the parsing libraries (`marked.js` and `prism.js`) from secure CDNs.
3. `docs/app.js` performs safety checks to confirm that these libraries loaded successfully.
4. When a user interacts with the Spec Explorer, `docs/app.js` fetches the requested Markdown file from `docs/data/` via an asynchronous fetch request.
5. The JavaScript parser converts the raw Markdown into HTML and injects it into the designated container in the page.
6. The syntax highlighter processes all `<code class="language-*">` blocks to apply syntax coloring.

## 4. Interfaces and Page Layout

The single-page site is organized into logical, visual sections:

- **Hero Section**:
  - Clean typographic branding for the Spec-First Protocol (SFP).
  - Main value proposition: "Specification-Driven Development precursor."
  - An abridged, italicized quote highlighting the cost of direct code generation without a spec.
  - Primary Call-to-Action (CTA): An "Install Now" button that smoothly scrolls the page to the tabbed installation section.
  - Secondary Call-to-Action (CTA): A "View on GitHub" link pointing to the repository.
- **Why Specs Matter**:
  - A comparison table comparing traditional problems (invisible scope creep, compounding rework, drift from intent, and AI context drift) side-by-side with how SFP solves them.
- **What is SFP? Section**:
  - A high-impact vertical callout section that pops visually to explain SFP's core operation statement.
- **The Protocol Flow**:
  - An interactive cyclic flowchart diagram showing SFP's pipeline:
    - **discover** (points to audit)
    - **audit** (points to lock, loops vertically with refine)
    - **refine** (loops back to audit)
    - **lock** (points to final locked spec)
  - Implemented using CSS Grid positioning and inline SVGs for flow lines.
  - Clicking any step node in the flowchart highlights the node and opens a details panel below describing that step's purpose, outputs, and gate requirements.
- **Tabbed Installation & Setup**:
  - Horizontal tabs for selecting the target operating system (macOS/Linux or Windows).
  - Selectors for choosing the editor/agent integration (Claude, Antigravity, Cursor, Windsurf, or raw file fallback).
  - Segmented toggle for scope (Local vs Global) showing target directories directly inline within button description text.
  - Tailored installation code blocks are pre-rendered statically in the HTML. JavaScript toggles the visibility of the matching panel based on selectors.
- **Spec Explorer**:
  - Collapsible components that hide example specification contents by default.
  - Toggling a component open displays its corresponding preview metadata summary block showing the vague starting prompt and final spec deliverables, followed by a mock code-editor layout that fetches, parses, and displays that specification (supporting both `SKILL-DISTRIBUTION` and `SFP-UI` specs).
- **Reference Table**:
  - A clean, compact table outlining the skill authoring guidelines (constraints on `SKILL.md` length, YAML descriptions, and reference file sizes).

## 5. Constraints and Design Rules

- **Zero-Config Build**: No bundlers, compilers (like Webpack, Vite), or javascript framework runtimes (like React, Vue, Svelte) are allowed for the deployed site. It must run on native browser support.
- **Asset Independence**: The UI must not rely on external images, logos, or brand assets. All visual styling and icons must be generated dynamically using CSS or inline SVGs.
- **Typography**: Imports and uses Google Fonts (Outfit for headers, Inter for body, and a standard monospace font for code blocks).
- **Clean Slate Design System**:
  - Slate color tokens (pure white background, soft slate borders, dark slate headings and text, clear royal/cyan blue accent).
  - Micro-animations: Smooth scaling on buttons and hover transitions.
- **Mobile & Responsive Layout**:
  - The layout must be fully responsive, supporting viewport widths from 320px up to large desktop monitors.
  - On viewports narrower than 768px:
    - The Protocol Flow diagram stacks vertically.
    - The onboarding installation panels are hidden, and a stacked mobile accordion view is displayed in its place.

## 6. Failure Modes and Edge Cases

### 6.1 Content Load Failure

- **Scenario**: A network error or missing file causes the fetch request for the example specification to fail.
- **Expected Behavior**: The container renders a styled warning box informing the user of the error, with a link to view the file directly on the GitHub repository.

### 6.2 Library CDN Outage

- **Scenario**: The CDN hosting `marked.js` or `prism.js` is unreachable.
- **Expected Behavior**: The page degrades gracefully. `docs/app.js` validates that these libraries exist before calling them. Raw Markdown text is displayed in a clean, legible preformatted text container.

## 7. Deliverables

- **`docs/index.html`**: Entrypoint page containing the static HTML templates, SEO metadata, layout structures, and CDN scripts.
- **`docs/styles.css`**: Design tokens, variables, typography, BEM layout rules, and media query overrides.
- **`docs/app.js`**: Client-side logic for toggling component visibility, handling copy-to-clipboard, fetching examples, and rendering markdown.
- **`docs/favicon.svg`**: SVG-based favicon representing the header logo, styled to adapt to prefers-color-scheme.
- **`docs/data/`**: Subfolder to store synced Markdown content files.
- **`scripts/build-docs.js`**: Node script that copies files to `docs/data/` for local updates.

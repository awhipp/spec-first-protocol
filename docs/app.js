/* ==========================================================================
   Spec-First Protocol (SFP) Marketing Site - Client Logic (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFlowchart();
  initInstallationControls();
  initSpecExplorer();
  initCopyButtons();
});

/* --------------------------------------------------------------------------
   1. Copy-to-Clipboard Utility (Static Mapping)
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.terminal__copy');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      if (!targetId) return;

      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const textToCopy = codeEl.textContent;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          btn.classList.add('show-feedback');
          setTimeout(() => {
            btn.classList.remove('show-feedback');
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy code block: ', err);
        });
    });
  });
}

/* --------------------------------------------------------------------------
   2. Interactive Funnel Details (Cyclic Flowchart)
   -------------------------------------------------------------------------- */
function initFlowchart() {
  const nodes = document.querySelectorAll('.funnel-node');
  const detailsCard = document.getElementById('funnel-details-card');
  const detailStepNum = document.getElementById('funnel-detail-step-num');
  const detailTitle = document.getElementById('funnel-detail-title');
  const detailDesc = document.getElementById('funnel-detail-desc');
  const detailOutput = document.getElementById('funnel-detail-output');
  const detailGate = document.getElementById('funnel-detail-gate');

  const stepsData = {
    discover: {
      stepNum: 'Step 1',
      title: 'discover',
      desc: 'Conducts an interactive, requirements-gathering interview to map out core boundaries. Compiles validated notes into a structured specification draft.',
      output: '.sfp/YYYY-MM-DD_<SLUG>/discovery_notes.md, YYYY-MM-DD_<SLUG>_SPEC_DRAFT.md',
      gate: 'Explicit project owner approval of initial scope and boundaries.'
    },
    audit: {
      stepNum: 'Step 2',
      title: 'audit',
      desc: 'Performs a logic-based review of the draft specification file against the locked Discovery Notes. Identifies gaps, risks, and contradictions.',
      output: '.sfp/YYYY-MM-DD_<SLUG>/audit_report.md',
      gate: 'Passes (clean status) only when zero blockers remain in the audit report.'
    },
    refine: {
      stepNum: 'Step 3',
      title: 'refine',
      desc: 'Walks through findings one at a time to resolve contradictions and gaps. Presents options to expand scope, then recompiles the draft specification.',
      output: 'Updated discovery notes and recompiled spec draft file.',
      gate: 'Project owner approval of issue resolutions and scope adjustments.'
    },
    lock: {
      stepNum: 'Step 4',
      title: 'lock',
      desc: 'Finalizes and locks the specification, removing the draft status. Cleans up temporary working notes to leave a clean production-ready asset.',
      output: 'Locked YYYY-MM-DD_<SLUG>_SPEC.md (written to project root)',
      gate: 'Explicit owner final sign-off, zero active blockers, and cleanup of the .sfp/ directory.'
    }
  };

  function selectStep(step) {
    if (!step || !stepsData[step]) return;

    // 1. Update node active styles
    nodes.forEach(n => {
      if (n.getAttribute('data-step') === step) {
        n.classList.add('is-active');
      } else {
        n.classList.remove('is-active');
      }
    });

    // 2. Animate detail card transition
    detailsCard.classList.add('fade-out');

    setTimeout(() => {
      const data = stepsData[step];
      detailStepNum.textContent = data.stepNum;
      detailTitle.textContent = data.title;
      detailDesc.textContent = data.desc;
      detailOutput.textContent = data.output;
      detailGate.textContent = data.gate;

      detailsCard.classList.remove('fade-out');
    }, 150);
  }

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const step = node.getAttribute('data-step');
      selectStep(step);
    });
  });
}

/* --------------------------------------------------------------------------
   3. Onboarding & Installation Setup (Toggling Static Components)
   -------------------------------------------------------------------------- */
function initInstallationControls() {
  const osTabs = document.querySelectorAll('.os-tab');
  const agentTabs = document.querySelectorAll('.agent-tab');

  const panels = document.querySelectorAll('.install-panel');
  const mobileAccGroups = document.querySelectorAll('.mobile-accordion-group');
  const accordions = document.querySelectorAll('.accordion');

  const targetPathEl = document.getElementById('setup-target-path');

  let activeOS = 'mac';
  let activeAgent = 'none';

  // Map of target paths depending on OS and Agent
  const scopePaths = {
    mac: {
      none: './skills/',
      claude: './.claude/skills/',
      antigravity: './.agents/skills/',
      cursor: './.cursor/skills/',
      windsurf: './.windsurf/skills/'
    },
    win: {
      none: '.\\skills\\',
      claude: '.\\.claude\\skills\\',
      antigravity: '.\\.agents\\skills\\',
      cursor: '.\\.cursor\\skills\\',
      windsurf: '.\\.windsurf\\skills\\'
    }
  };

  // Toggle active components based on states
  function updateSetupDisplay() {
    // 1. Update target path dynamically
    const targetPath = scopePaths[activeOS][activeAgent];
    if (targetPathEl) {
      targetPathEl.textContent = targetPath;
    }

    // 2. Update active Desktop panel
    panels.forEach(panel => {
      const os = panel.getAttribute('data-os');
      const agent = panel.getAttribute('data-agent');

      if (os === activeOS && agent === activeAgent) {
        panel.classList.add('is-active');
      } else {
        panel.classList.remove('is-active');
      }
    });

    // 3. Update active Mobile accordion group (OS-level)
    mobileAccGroups.forEach(group => {
      const groupOS = group.getAttribute('data-mobile-os');
      if (groupOS === activeOS) {
        group.classList.add('is-active');
      } else {
        group.classList.remove('is-active');
      }
    });
  }

  // OS Tab Selection
  osTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      osTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      activeOS = tab.getAttribute('data-os');

      updateSetupDisplay();
    });
  });

  // Agent Tab Selection
  agentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      agentTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      activeAgent = tab.getAttribute('data-agent');

      updateSetupDisplay();
    });
  });

  // Mobile Accordion Toggle Actions
  accordions.forEach(acc => {
    const header = acc.querySelector('.accordion__header');
    header.addEventListener('click', () => {
      const isExpanded = acc.classList.contains('is-expanded');

      // Collapse sibling accordions in the active group
      const activeGroup = acc.closest('.mobile-accordion-group');
      if (activeGroup) {
        const siblings = activeGroup.querySelectorAll('.accordion');
        siblings.forEach(s => s.classList.remove('is-expanded'));
      }

      // Toggle clicked accordion state
      if (!isExpanded) {
        acc.classList.add('is-expanded');
      }
    });
  });

  // Initialize view
  updateSetupDisplay();
}

/* --------------------------------------------------------------------------
   4. Spec Explorer (Dynamic Content Fetching & Outage Degradation)
   -------------------------------------------------------------------------- */
function initSpecExplorer() {
  const specExplorers = [
    {
      btnId: 'explorer-toggle-btn-dist',
      contentId: 'explorer-content-dist',
      containerId: 'spec-viewer-container-dist',
      file: '2026-06-01_SKILL-DISTRIBUTION_SPEC.md'
    },
    {
      btnId: 'explorer-toggle-btn-ui',
      contentId: 'explorer-content-ui',
      containerId: 'spec-viewer-container-ui',
      file: '2026-06-01_SFP-UI_SPEC.md'
    },
    {
      btnId: 'explorer-toggle-btn-disney',
      contentId: 'explorer-content-disney',
      containerId: 'spec-viewer-container-disney',
      file: 'non-software/2026-06-02_PERFECT-DISNEY-VACATION_SPEC.md'
    }
  ];

  specExplorers.forEach(spec => {
    const toggleBtn = document.getElementById(spec.btnId);
    const contentPanel = document.getElementById(spec.contentId);
    const viewerContainer = document.getElementById(spec.containerId);
    if (!toggleBtn || !contentPanel || !viewerContainer) return;

    let isSpecLoaded = false;
    let localSpecPath = `data/${spec.file}`;
    let githubFallbackUrl = `https://github.com/awhipp/spec-first-protocol/blob/main/examples/${spec.file}`;

    const tabs = contentPanel.querySelectorAll('.mock-editor__tab');
    if (tabs.length > 0) {
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');

          const newFile = tab.getAttribute('data-file');
          localSpecPath = `data/${newFile}`;
          githubFallbackUrl = `https://github.com/awhipp/spec-first-protocol/blob/main/examples/${newFile}`;

          const titleText = toggleBtn.querySelector('#explorer-toggle-text-disney');
          if (titleText) {
            titleText.textContent = `examples/${newFile}`;
          }

          viewerContainer.innerHTML = `
            <div class="mock-editor__loading">
              <div class="spinner"></div>
              <span>Fetching ${tab.textContent.toLowerCase()} from local repository...</span>
            </div>
          `;
          loadSpecificationData();
        });
      });
    }

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        contentPanel.classList.add('collapsed');
        contentPanel.setAttribute('aria-hidden', 'true');
      } else {
        toggleBtn.setAttribute('aria-expanded', 'true');
        contentPanel.classList.remove('collapsed');
        contentPanel.setAttribute('aria-hidden', 'false');

        // Fetch specification once
        if (!isSpecLoaded) {
          loadSpecificationData();
        }
      }
    });

    function loadSpecificationData() {
      fetch(localSpecPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load: ${response.status} ${response.statusText}`);
          }
          return response.text();
        })
        .then(markdownText => {
          renderMarkdown(markdownText);
          isSpecLoaded = true;
        })
        .catch(error => {
          console.error(`Spec-First Protocol Spec Explorer Error [${spec.file}]:`, error);
          renderErrorFallback(error.message);
        });
    }

    function renderMarkdown(markdownText) {
      const isMarkedAvailable = typeof marked !== 'undefined';
      const isPrismAvailable = typeof Prism !== 'undefined';

      if (isMarkedAvailable) {
        try {
          const html = marked.parse(markdownText);
          viewerContainer.innerHTML = `<div class="spec-viewer">${html}</div>`;

          if (isPrismAvailable) {
            Prism.highlightAllUnder(viewerContainer);
          }

          if (typeof mermaid !== 'undefined') {
            const mermaidBlocks = viewerContainer.querySelectorAll('.language-mermaid');
            mermaidBlocks.forEach(block => {
              const pre = block.parentElement;
              if (pre && pre.tagName.toLowerCase() === 'pre') {
                const div = document.createElement('div');
                div.className = 'mermaid';
                div.textContent = block.textContent;
                pre.parentNode.replaceChild(div, pre);
              }
            });
            const mermaids = viewerContainer.querySelectorAll('.mermaid');
            if (mermaids.length > 0) {
              mermaid.init(undefined, mermaids);
            }
          }
        } catch (err) {
          console.error('Markdown parser crashed, degrading to pre block:', err);
          renderRawMarkdownText(markdownText);
        }
      } else {
        renderRawMarkdownText(markdownText);
      }
    }

    function renderRawMarkdownText(rawText) {
      const isPrismAvailable = typeof Prism !== 'undefined';
      const escapedText = rawText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      viewerContainer.innerHTML = `
        <pre class="pre-fallback"><code class="language-markdown" id="fallback-code-block-${spec.btnId}">${escapedText}</code></pre>
      `;

      if (isPrismAvailable) {
        const codeBlock = document.getElementById(`fallback-code-block-${spec.btnId}`);
        Prism.highlightElement(codeBlock);
      }
    }

    function renderErrorFallback(message) {
      viewerContainer.innerHTML = `
        <div class="error-box">
          <h4 class="error-box__title">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Unable to Load Specification Content</span>
          </h4>
          <p class="error-box__desc">
            We encountered an issue fetching the example specification file from the local repository directory (<code>${localSpecPath}</code>).
          </p>
          <p class="error-box__desc" style="font-size: 0.85rem; opacity: 0.8;">
            Technical details: ${message}
          </p>
          <a href="${githubFallbackUrl}" target="_blank" rel="noopener" class="error-box__cta">
            <span>View the raw file directly on GitHub &rarr;</span>
          </a>
        </div>
      `;
    }
  });
}

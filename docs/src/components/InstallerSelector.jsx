import { useState } from 'react';
import { Copy, Check, Download, ExternalLink } from 'lucide-react';

const AGENTS = [
  { id: 'auto', label: 'Auto-detect (Default)' },
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'cursor', label: 'Cursor' },
  { id: 'windsurf', label: 'Windsurf' },
  { id: 'github-copilot', label: 'GitHub Copilot' },
  { id: 'cline', label: 'Cline' },
  { id: 'roo', label: 'Roo Code' },
  { id: 'aider-desk', label: 'Aider' },
  { id: 'antigravity', label: 'Antigravity' },
  { id: 'antigravity-cli', label: 'Antigravity CLI' }
];

export default function InstallerSelector() {
  const [activeTab, setActiveTab] = useState('cli'); // 'cli' | 'manual'
  const [selectedAgent, setSelectedAgent] = useState('auto');
  const [globalScope, setGlobalScope] = useState(false);
  const [copyFiles, setCopyFiles] = useState(false);
  const [nonInteractive, setNonInteractive] = useState(false);
  const [copied, setCopied] = useState(false);

  const getCommand = () => {
    let cmd = 'npx skills add awhipp/spec-first-protocol';
    if (selectedAgent !== 'auto') {
      cmd += ` --agent ${selectedAgent}`;
    }
    if (globalScope) {
      cmd += ' --global';
    }
    if (copyFiles) {
      cmd += ' --copy';
    }
    if (nonInteractive) {
      cmd += ' --yes';
    }
    return cmd;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCommand());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy command: ', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Primary Navigation Tabs */}
      <div className="flex gap-6 border-b border-border-primary" role="tablist">
        <button
          onClick={() => setActiveTab('cli')}
          role="tab"
          aria-selected={activeTab === 'cli'}
          className={`bg-transparent border-none border-b-2 font-header text-lg font-semibold px-2 py-3 cursor-pointer transition-all duration-200
            ${activeTab === 'cli' ? 'text-accent border-accent' : 'text-text-secondary border-transparent hover:text-text-primary'}
          `}
        >
          CLI Installation
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          role="tab"
          aria-selected={activeTab === 'manual'}
          className={`bg-transparent border-none border-b-2 font-header text-lg font-semibold px-2 py-3 cursor-pointer transition-all duration-200
            ${activeTab === 'manual' ? 'text-accent border-accent' : 'text-text-secondary border-transparent hover:text-text-primary'}
          `}
        >
          Manual Installation
        </button>
      </div>
      {activeTab === 'cli' ? (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <p className="text-sm text-text-secondary -mb-2">
            The CLI installer requires <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-accent underline font-semibold hover:text-accent-hover">Node.js</a> (which includes <code>npx</code>). If you do not have Node.js installed, please switch to the <strong>Manual Installation</strong> tab above.
          </p>
          {/* Controls Box */}
          <div className="flex flex-col gap-6 bg-bg-secondary border border-border-primary p-6 rounded-xl shadow-sm">
            {/* Agent Select Dropdown */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label htmlFor="agent-select" className="text-sm font-semibold text-text-secondary md:w-[170px]">
                Target AI Agent:
              </label>
              <select
                id="agent-select"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="bg-bg-primary text-text-primary border border-border-primary rounded-md px-3.5 py-2 text-sm font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer min-w-[200px]"
              >
                {AGENTS.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Flags / Options Switches */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 border-t border-border-primary pt-6">
              <span className="text-sm font-semibold text-text-secondary md:w-[170px] md:pt-1">
                Configure Options:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                {/* Global Switch */}
                <div className="flex items-center justify-between p-3.5 bg-bg-primary rounded-lg border border-border-primary shadow-2xs">
                  <div className="flex flex-col pr-3">
                    <span className="text-xs font-bold text-text-primary">Global Scope</span>
                    <span className="text-[11px] text-text-muted">Install in user home folder</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGlobalScope(!globalScope)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                      ${globalScope ? 'bg-accent' : 'bg-slate-200'}
                    `}
                    aria-checked={globalScope}
                    role="switch"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
                        ${globalScope ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>

                {/* Copy Switch */}
                <div className="flex items-center justify-between p-3.5 bg-bg-primary rounded-lg border border-border-primary shadow-2xs">
                  <div className="flex flex-col pr-3">
                    <span className="text-xs font-bold text-text-primary">Copy Files</span>
                    <span className="text-[11px] text-text-muted">Copy instead of symlinking</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCopyFiles(!copyFiles)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                      ${copyFiles ? 'bg-accent' : 'bg-slate-200'}
                    `}
                    aria-checked={copyFiles}
                    role="switch"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
                        ${copyFiles ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>

                {/* Non-Interactive Switch */}
                <div className="flex items-center justify-between p-3.5 bg-bg-primary rounded-lg border border-border-primary shadow-2xs">
                  <div className="flex flex-col pr-3">
                    <span className="text-xs font-bold text-text-primary">Non-Interactive (CI)</span>
                    <span className="text-[11px] text-text-muted">Bypass confirmation prompts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNonInteractive(!nonInteractive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                      ${nonInteractive ? 'bg-accent' : 'bg-slate-200'}
                    `}
                    aria-checked={nonInteractive}
                    role="switch"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
                        ${nonInteractive ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Simulator Command Output */}
          <div className="bg-[#0f172a] rounded-lg overflow-hidden border border-border-primary shadow-md">
            <div className="bg-[#1e293b] px-4 py-3 flex justify-between items-center border-b border-[#334155]">
              <span className="font-mono text-xs text-slate-300 font-bold">terminal</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors bg-transparent border-none cursor-pointer focus:outline-none"
                aria-label="Copy command"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-400" />
                    <span className="text-xs font-semibold text-green-400 animate-in fade-in zoom-in duration-200">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="text-xs font-semibold text-slate-400 hover:text-slate-100">Copy Command</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 font-mono text-sm leading-relaxed overflow-x-auto text-slate-200 flex gap-3">
              <span className="text-slate-500 select-none">$</span>
              <code className="whitespace-pre">{getCommand()}</code>
            </div>
          </div>
        </div>
      ) : (
        /* Manual Installation Tab */
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Step 1: Download Box */}
          <div className="flex flex-col gap-4 bg-bg-secondary border border-border-primary p-6 rounded-xl shadow-sm">
            <h3 className="font-header font-bold text-lg text-text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">1</span>
              Download Core Skills
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Download the compiled <code>skills.zip</code> package containing all core Spec-First Protocol agent skills.
            </p>
            <div className="flex flex-wrap gap-4 items-center mt-2">
              <a
                href="https://github.com/awhipp/spec-first-protocol/releases/latest/download/skills.zip"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white font-header font-bold text-sm transition-all shadow-xs cursor-pointer"
              >
                <Download size={16} /> Download skills.zip
              </a>
              <a
                href="https://github.com/awhipp/spec-first-protocol/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-semibold transition-colors focus:outline-none"
              >
                Static Release Page <ExternalLink size={14} />
              </a>
            </div>
            <p className="text-xs text-text-muted mt-2 border-t border-border-primary pt-3">
              💡 <strong>Network issues?</strong> If direct downloads fail, browse and select release archives directly from the backup{' '}
              <a
                href="https://github.com/awhipp/spec-first-protocol/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline font-semibold hover:text-accent-hover"
              >
                GitHub Releases Page
              </a>.
            </p>
          </div>

          {/* Step 2: Extract & Install Steps */}
          <div className="flex flex-col gap-4 bg-bg-secondary border border-border-primary p-6 rounded-xl shadow-sm">
            <h3 className="font-header font-bold text-lg text-text-primary flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">2</span>
              Extract & Place
            </h3>
            <ol className="list-decimal list-inside text-sm text-text-secondary space-y-3.5 pl-1 leading-relaxed">
              <li>
                Extract the contents of the downloaded <code>skills.zip</code> archive.
              </li>
              <li>
                Copy the extracted directories (<code>sfp-discover</code>, <code>sfp-audit</code>, <code>sfp-refine</code>, <code>sfp-orchestrate</code>, <code>sfp-personas</code>) directly into your target agent config directory.
              </li>
            </ol>
          </div>

          {/* Table: Standard Destination Paths */}
          <div className="flex flex-col gap-4 bg-bg-secondary border border-border-primary p-6 rounded-xl shadow-sm">
            <h3 className="font-header font-bold text-lg text-text-primary">
              Standard Target Folders
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Common destination directories for manual setup on typical environments:
            </p>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-primary">
                    <th className="py-2.5 px-3 font-semibold text-text-primary w-1/3">AI Agent / Editor</th>
                    <th className="py-2.5 px-3 font-semibold text-text-primary">Destination Path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary/50 text-text-secondary">
                  <tr>
                    <td className="py-3 px-3 font-medium text-text-primary">Claude Code</td>
                    <td className="py-3 px-3 font-mono text-accent">.claude/skills/</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-text-primary">Antigravity / Antigravity CLI</td>
                    <td className="py-3 px-3 font-mono text-accent">.agents/skills/</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-text-primary">Cursor</td>
                    <td className="py-3 px-3 font-mono text-accent">.cursor/skills/</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-text-primary">Windsurf</td>
                    <td className="py-3 px-3 font-mono text-accent">.windsurf/skills/</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

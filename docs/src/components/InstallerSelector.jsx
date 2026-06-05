import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const OS_TABS = [
  { id: 'mac', label: 'macOS / Linux' },
  { id: 'win', label: 'Windows' }
];

const AGENT_TABS = [
  { id: 'none', label: 'None (Default)' },
  { id: 'claude', label: 'Claude' },
  { id: 'antigravity', label: 'Antigravity' },
  { id: 'cursor', label: 'Cursor' },
  { id: 'windsurf', label: 'Windsurf' }
];

const TARGET_PATHS = {
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

export default function InstallerSelector() {
  const [activeOS, setActiveOS] = useState('mac');
  const [activeAgent, setActiveAgent] = useState('none');
  const [copied, setCopied] = useState(false);

  const getCommand = () => {
    if (activeOS === 'mac') {
      if (activeAgent === 'none') {
        return 'curl -fsSL https://raw.githubusercontent.com/awhipp/spec-first-protocol/main/scripts/install.sh | bash';
      }
      return `curl -fsSL https://raw.githubusercontent.com/awhipp/spec-first-protocol/main/scripts/install.sh | bash -s -- -i ${activeAgent}`;
    } else {
      if (activeAgent === 'none') {
        return 'powershell -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/awhipp/spec-first-protocol/main/scripts/install.ps1 | iex"';
      }
      return `powershell -ExecutionPolicy Bypass -Command "& ([scriptblock]::Create((irm https://raw.githubusercontent.com/awhipp/spec-first-protocol/main/scripts/install.ps1))) -i ${activeAgent}"`;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCommand());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code block: ', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* OS Tabs */}
      <div className="flex gap-2 border-b border-border-primary" role="tablist">
        {OS_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveOS(tab.id)}
            role="tab"
            aria-selected={activeOS === tab.id}
            className={`bg-transparent border-none border-b-2 font-header text-lg font-semibold px-2 py-3 mr-4 cursor-pointer transition-colors
              ${activeOS === tab.id ? 'text-accent border-accent' : 'text-text-secondary border-transparent hover:text-text-primary'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-5 bg-bg-secondary border border-border-primary p-5 rounded-xl">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-text-secondary min-w-[170px]">Select AI Agent / Editor:</span>
          <div className="flex gap-2 flex-wrap" role="tablist">
            {AGENT_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveAgent(tab.id)}
                role="tab"
                aria-selected={activeAgent === tab.id}
                className={`font-header text-[13px] font-semibold px-3.5 py-2 rounded-md border cursor-pointer transition-colors
                  ${activeAgent === tab.id ? 'bg-text-primary text-bg-primary border-text-primary' : 'bg-bg-primary text-text-secondary border-border-primary hover:border-border-hover'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-text-secondary min-w-[170px]">Installation Target:</span>
          <code className="font-mono text-sm text-accent font-semibold">
            {TARGET_PATHS[activeOS][activeAgent]}
          </code>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-[#0f172a] rounded-lg overflow-hidden border border-border-primary shadow-sm mt-2">
        <div className="bg-[#1e293b] px-4 py-2.5 flex justify-between items-center border-b border-[#334155]">
          <span className="font-mono text-xs text-slate-300 font-semibold">{activeOS === 'mac' ? 'bash' : 'powershell'}</span>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Copy command"
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-400" />
                <span className="text-xs font-semibold text-green-400 animate-in fade-in zoom-in duration-200">Copied!</span>
              </>
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
        <div className="p-4 font-mono text-sm leading-relaxed overflow-x-auto text-slate-200 flex gap-3">
          <span className="text-slate-500 select-none">{activeOS === 'mac' ? '$' : 'PS >'}</span>
          <code className="whitespace-pre">{getCommand()}</code>
        </div>
      </div>
    </div>
  );
}

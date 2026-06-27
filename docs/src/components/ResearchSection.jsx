import { useState } from 'react';
import ContextAnimation from './ContextAnimation';
import { FileText, ArrowDown, MessageSquare, Bot, AlertTriangle, Check } from 'lucide-react';

const researchData = [
  {
    id: "context-window-efficiency",
    label: "Context Window Efficiency",
    description: "SFP prevents attention decay by isolating requirements into a dense specification at the beginning of a fresh context session, preserving peak recall.",
    citations: [
      {
        authors: "Liu et al.",
        year: 2023,
        title: "Lost in the Middle: How Language Models Use Long Contexts",
        url: "https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.tacl2023.pdf",
        backupUrl: "/spec-first-protocol/lost-in-the-middle.pdf"
      }
    ],
    comparison: {
      traditional: "Raw conversational chat histories grow uncontrollably, burying critical details in the middle of long contexts and degrading recall accuracy.",
      sfp: "Compresses discovery chat into a clean, dense markdown specification at the start of a fresh session, preserving peak recall accuracy."
    },
    content: <ContextAnimation />
  },
  {
    id: "primacy-recency-ordering",
    label: "Primacy-Recency Ordering",
    description: "SFP's structural ordering principle positions critical constraints at the start (primacy zone) and failure modes near the end (recency zone).",
    citations: [
      {
        authors: "Liu et al.",
        year: 2023,
        title: "Lost in the Middle: How Language Models Use Long Contexts",
        url: "https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.tacl2023.pdf",
        backupUrl: "/spec-first-protocol/lost-in-the-middle.pdf"
      }
    ],
    comparison: {
      traditional: "Important rules and failure modes are scattered randomly throughout the prompt or document, failing to exploit positional bias.",
      sfp: "Systematically places constraints immediately after the overview (index 1) and edge cases at the very end to maximize LLM recall of critical invariants."
    },
    content: (
      <div className="flex flex-col md:flex-row gap-6 mt-4 max-w-4xl mx-auto w-full">
        {/* Traditional Side */}
        <div className="flex-1 w-full bg-bg-primary border border-danger-border/40 rounded-xl overflow-hidden shadow-3xs">
          <div className="flex items-center justify-center gap-2 bg-danger-bg p-3 border-b border-danger-border/40 font-bold text-danger-primary text-sm uppercase tracking-wider">
            <AlertTriangle size={16} />
            <span>Traditional Prompting</span>
          </div>
          <div className="p-0 flex flex-col">
            <div className="flex items-center p-4 border-b border-border-primary bg-bg-primary">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-text-muted font-bold mr-4 shrink-0 text-xs">1</div>
              <div>
                <h4 className="font-bold text-text-primary text-sm">Context Start</h4>
                <p className="text-[11px] text-success-primary mt-0.5 uppercase tracking-wider font-semibold">High Recall</p>
              </div>
            </div>
            <div className="flex flex-col p-4 border-b border-border-primary bg-danger-bg/30">
              <div className="text-center text-[11px] font-bold text-danger-primary mb-3 tracking-widest uppercase">Lost In The Middle Zone</div>
              <div className="flex flex-col gap-2 relative">
                <div className="p-2 border border-danger-border/40 bg-bg-primary rounded text-xs text-text-secondary line-through opacity-70">
                  Important Rule 1
                </div>
                <div className="p-2 border border-danger-border/40 bg-bg-primary rounded text-xs text-text-secondary line-through opacity-70">
                  Constraint: Use X
                </div>
                <div className="p-2 border border-danger-border/40 bg-bg-primary rounded text-xs text-text-secondary line-through opacity-70">
                  Edge Case Y
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-black text-danger-primary/40 rotate-[-15deg] text-2xl tracking-widest pointer-events-none drop-shadow-md">FORGOTTEN</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-bg-primary">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-text-muted font-bold mr-4 shrink-0 text-xs">n</div>
              <div>
                <h4 className="font-bold text-text-primary text-sm">Context End</h4>
                <p className="text-[11px] text-success-primary mt-0.5 uppercase tracking-wider font-semibold">High Recall</p>
              </div>
            </div>
          </div>
        </div>

        {/* SFP Side */}
        <div className="flex-1 w-full bg-bg-primary border border-success-border/50 rounded-xl overflow-hidden shadow-3xs">
          <div className="flex items-center justify-center gap-2 bg-success-bg p-3 border-b border-success-border/50 font-bold text-success-primary text-sm uppercase tracking-wider">
            <Check size={16} />
            <span>SFP Spec Structure</span>
          </div>
          <div className="p-0 flex flex-col">
            <div className="flex items-center p-4 border-b border-border-primary bg-gradient-to-r from-success-bg/80 to-transparent border-l-4 border-l-success-primary">
              <div className="w-6 h-6 rounded-full bg-success-primary/20 flex items-center justify-center text-success-primary font-bold mr-4 shrink-0 text-xs">1</div>
              <div>
                <h4 className="font-bold text-text-primary text-sm">Constraints & Rules</h4>
                <p className="text-[11px] text-success-primary mt-0.5 font-semibold uppercase tracking-wider">Primacy Zone: Peak Recall</p>
              </div>
            </div>
            <div className="flex flex-col p-4 border-b border-border-primary opacity-60 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)] h-[134px] justify-center items-center">
              <div className="text-center text-[11px] font-bold text-text-muted tracking-widest uppercase mb-1">Lost In The Middle Zone</div>
              <div className="text-center text-[11px] font-semibold text-text-muted/70">(Low priority context)</div>
            </div>
            <div className="flex items-center p-4 bg-gradient-to-r from-success-bg/80 to-transparent border-l-4 border-l-success-primary">
              <div className="w-6 h-6 rounded-full bg-success-primary/20 flex items-center justify-center text-success-primary font-bold mr-4 shrink-0 text-xs">n</div>
              <div>
                <h4 className="font-bold text-text-primary text-sm">Failure Modes & Edge Cases</h4>
                <p className="text-[11px] text-success-primary mt-0.5 font-semibold uppercase tracking-wider">Recency Zone: Peak Recall</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "fresh-context-isolation",
    label: "Fresh Context Isolation",
    description: "SFP utilizes a decoupled lifecycle and fresh-session handoff strategy to avoid the context length degradation documented in the paper.",
    citations: [
      {
        authors: "Liu et al.",
        year: 2023,
        title: "Lost in the Middle: How Language Models Use Long Contexts",
        url: "https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.tacl2023.pdf",
        backupUrl: "/spec-first-protocol/lost-in-the-middle.pdf"
      }
    ],
    comparison: {
      traditional: "Passing the entire discovery conversation to execution agents introduces dialogue noise and balloons the total context size, decreasing performance.",
      sfp: "Strips dialogue noise and hands off only the final, locked specification to downstream execution agents, keeping total context length minimal."
    },
    content: (
      <div className="flex flex-col md:flex-row gap-6 mt-4 max-w-4xl mx-auto w-full">
        {/* Traditional Side */}
        <div className="flex-1 w-full bg-bg-primary border border-danger-border/40 rounded-xl p-5 shadow-3xs flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-2 w-full text-danger-primary font-bold text-sm mb-1 uppercase tracking-wider bg-danger-bg py-2 rounded-lg border border-danger-border/30">
            <AlertTriangle size={16} /> Traditional Pipeline
          </div>
          
          <div className="flex flex-col items-center justify-center w-full p-4 border border-danger-border/40 rounded-lg bg-danger-bg/20 shadow-inner relative mt-2 flex-1">
            <MessageSquare className="text-danger-primary mb-2 opacity-80" size={36} />
            <span className="text-[15px] font-bold text-text-primary text-center">Verbose Discovery Chat</span>
            <span className="text-xs text-danger-primary font-semibold text-center mt-1">High noise, max tokens</span>
          </div>
          
          <div className="flex flex-col items-center justify-center py-0 h-[40px]">
             <ArrowDown size={24} className="text-danger-primary/50" />
          </div>
          
          <div className="flex flex-col items-center justify-center w-full p-4 border border-border-primary rounded-lg bg-bg-secondary mt-1 flex-1">
            <Bot className="text-text-muted mb-2" size={32} />
            <span className="text-sm font-bold text-text-primary text-center">Exhausted Agent</span>
            <span className="text-[10px] text-danger-primary uppercase tracking-wider font-semibold mt-1">Context Depleted</span>
          </div>

          <div className="flex flex-col items-center justify-center py-0 h-[40px]">
             <ArrowDown size={24} className="text-danger-primary/50" />
          </div>

          <div className="w-full flex flex-col items-center justify-center p-4 bg-bg-primary rounded-lg border border-danger-border/30 relative overflow-hidden flex-1">
             <span className="text-[9px] font-bold text-danger-primary uppercase tracking-widest mb-3">Generated Output</span>
             <div className="flex gap-2 w-full mb-1.5">
               <div className="w-1/3 h-2 bg-border-primary rounded-full"></div>
               <div className="w-1/4 h-2 bg-danger-primary/30 rounded-full"></div>
             </div>
             <div className="w-3/4 h-2 bg-border-primary rounded-full mb-1.5 self-start"></div>
             <div className="w-5/6 h-2 bg-border-primary rounded-full self-start"></div>
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/60 backdrop-blur-[1px]">
                <span className="text-[10px] font-bold text-danger-primary uppercase tracking-wider bg-bg-primary px-2 py-0.5 rounded shadow-sm border border-danger-border/50">Details Lost</span>
                <span className="text-[9px] text-danger-primary font-semibold mt-0.5">Accuracy Diminished</span>
             </div>
          </div>
        </div>

        {/* SFP Side */}
        <div className="flex-1 w-full bg-bg-primary border border-success-border/50 rounded-xl p-5 shadow-3xs flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-2 w-full text-success-primary font-bold text-sm mb-1 uppercase tracking-wider bg-success-bg py-2 rounded-lg border border-success-border/40">
            <Check size={16} /> SFP Pipeline
          </div>
          
          <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-accent rounded-lg bg-accent/5 flex-1 mt-2">
            <FileText className="text-accent mb-2" size={36} />
            <span className="text-[15px] font-bold text-accent text-center">Dense Specification</span>
            <span className="text-xs text-text-secondary text-center font-semibold mt-1">Compressed (Zero noise)</span>
          </div>
          
          <div className="flex flex-col items-center justify-center py-0 h-[40px]">
             <span className="text-[9px] font-bold text-success-primary uppercase tracking-widest bg-success-bg px-2 py-0.5 rounded-full border border-success-border/40 mb-1 z-10">Fresh Handoff</span>
             <ArrowDown size={24} className="text-success-primary/70 -mt-2" />
          </div>
          
          <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-success-primary rounded-lg bg-success-bg/40 shadow-[0_0_15px_rgba(34,197,94,0.15)] flex-1 mt-1">
            <Bot className="text-success-primary mb-2" size={32} />
            <span className="text-[15px] font-bold text-success-primary text-center">Fresh Execution Agent</span>
            <span className="text-[10px] text-success-primary uppercase tracking-wider font-semibold mt-1">Max Tokens Preserved</span>
          </div>

          <div className="flex flex-col items-center justify-center py-0 h-[40px]">
             <ArrowDown size={24} className="text-success-primary/70" />
          </div>
          
          <div className="w-full flex flex-col items-center justify-center p-4 bg-bg-primary rounded-lg border border-success-border/50 relative overflow-hidden flex-1">
             <span className="text-[9px] font-bold text-success-primary uppercase tracking-widest mb-3">Generated Output</span>
             <div className="w-full h-2 bg-success-primary/50 rounded-full mb-1.5"></div>
             <div className="w-11/12 h-2 bg-success-primary/50 rounded-full mb-1.5 self-start"></div>
             <div className="w-full h-2 bg-success-primary/50 rounded-full self-start"></div>
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/20 backdrop-blur-[0.5px]">
                <span className="text-[10px] font-bold text-success-primary uppercase tracking-wider bg-bg-primary px-2 py-0.5 rounded shadow-sm border border-success-border/60">Complete Recall</span>
                <span className="text-[9px] text-success-primary font-semibold mt-0.5">High Accuracy</span>
             </div>
          </div>
        </div>
      </div>
    )
  }
];

export default function ResearchSection() {
  const [activeTab, setActiveTab] = useState(researchData[0].id);

  if (!researchData || researchData.length === 0) {
    return <div className="p-8 text-center text-text-secondary border border-border-primary rounded-xl">No research entries available.</div>;
  }

  const activeEntry = researchData.find(entry => entry.id === activeTab);

  return (
    <div className="w-full border border-border-primary rounded-xl bg-bg-primary shadow-sm overflow-hidden flex flex-col">
      <div className="flex overflow-x-auto gap-2 border-b border-border-primary bg-bg-secondary p-2 pb-0 scrollbar-hide">
        {researchData.map(entry => (
          <button
            key={entry.id}
            onClick={() => setActiveTab(entry.id)}
            className={`whitespace-nowrap px-4 py-2 mt-1 font-semibold text-sm rounded-t-lg transition-colors ${
              activeTab === entry.id
                ? "bg-bg-primary text-accent border-t border-x border-border-primary shadow-[0_4px_0_0_var(--bg-primary)] z-10"
                : "text-text-secondary hover:text-text-primary hover:bg-border-primary/50"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {activeEntry && (
        <div className="flex flex-col gap-5 animate-fadeIn p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-header font-bold text-text-primary m-0">{activeEntry.label}</h3>
            <p className="text-[1.05rem] text-text-secondary leading-relaxed">{activeEntry.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 hidden">
            {/* Kept for data structure, but visual comparisons are now directly in content */}
          </div>

          {activeEntry.content && (
            <div className="mt-2">
              {activeEntry.content}
            </div>
          )}
          
          {activeEntry.citations && activeEntry.citations.length > 0 && (
            <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary mt-4">
              <h4 className="text-sm font-bold text-text-primary mb-2 uppercase tracking-wider">Research Citations</h4>
              <ul className="space-y-2">
                {activeEntry.citations.map((cite, idx) => (
                  <li key={idx} className="text-sm text-text-secondary flex flex-wrap gap-x-2 items-center">
                    <span className="font-semibold">{cite.authors} ({cite.year}).</span>
                    <span className="italic">"{cite.title}"</span>
                    <div className="flex gap-2">
                      {cite.url && <a href={cite.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-[13px]">[Source]</a>}
                      {cite.backupUrl && <a href={cite.backupUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-secondary underline text-[13px]">[Backup PDF]</a>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

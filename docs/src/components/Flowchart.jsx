import { useState } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

const STEPS_DATA = {
  discover: {
    stepNum: "Step 1",
    title: "discover",
    desc: "Conducts an interactive, requirements-gathering interview to map out core boundaries. Compiles validated notes into a structured specification draft.",
    output:
      ".sfp/YYYY-MM-DD_<SLUG>/{discovery_notes.md, status.md, YYYY-MM-DD_<SLUG>_SPEC_DRAFT.md}",
    gate: "Explicit project owner approval of initial scope and boundaries.",
  },
  audit: {
    stepNum: "Step 2",
    title: "audit",
    desc: "Performs a logic-based review of the draft specification file against the locked Discovery Notes. Identifies gaps, risks, and contradictions.",
    output: ".sfp/YYYY-MM-DD_<SLUG>/audit_report.md",
    gate: "Passes (clean status) only when zero blockers remain in the audit report.",
  },
  refine: {
    stepNum: "Step 3",
    title: "refine",
    desc: "Walks through findings one at a time to resolve contradictions and gaps. Presents options to expand scope, then recompiles the draft specification.",
    output: "Updated discovery notes and recompiled spec draft file.",
    gate: "Project owner approval of issue resolutions and scope adjustments.",
  },
  lock: {
    stepNum: "Step 4",
    title: "lock",
    desc: "Finalizes and locks the specification, removing the draft status. Cleans up temporary working notes to leave a clean production-ready asset.",
    output: "Locked YYYY-MM-DD_<SLUG>_SPEC.md (moved to specs/ directory)",
    gate: "Explicit owner final sign-off, zero active blockers, and cleanup of the .sfp/ directory.",
  },
};

export default function Flowchart() {
  const [activeStep, setActiveStep] = useState("discover");

  const data = STEPS_DATA[activeStep];

  return (
    <div className="w-full">
      <div className="bg-bg-secondary border border-border-primary rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 mb-12">
          <button
            onClick={() => setActiveStep("discover")}
            className={`flex flex-col items-center justify-center min-w-[120px] min-h-[110px] p-4 bg-bg-primary border-2 rounded-xl transition-all ${activeStep === "discover" ? "border-accent shadow-[0_4px_12px_rgba(2,132,199,0.15)] scale-[1.02]" : "border-border-primary hover:-translate-y-1 hover:border-border-hover hover:shadow-md"}`}
          >
            <span
              className={`font-header text-xl font-extrabold ${activeStep === "discover" ? "text-accent" : "text-text-muted"}`}
            >
              1
            </span>
            <span className="font-header text-lg font-bold text-text-primary">
              discover
            </span>
            <span className="text-xs text-text-secondary mt-1">
              Structured Interview
            </span>
          </button>

          <div className="hidden lg:flex flex-col items-center text-text-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Spec Draft
            </span>
            <ArrowRight size={20} />
          </div>
          <div className="lg:hidden flex flex-col items-center text-text-muted">
            <ArrowDown size={20} />
          </div>

          <button
            onClick={() => setActiveStep("audit")}
            className={`flex flex-col items-center justify-center min-w-[120px] min-h-[110px] p-4 bg-bg-primary border-2 rounded-xl transition-all ${activeStep === "audit" ? "border-accent shadow-[0_4px_12px_rgba(2,132,199,0.15)] scale-[1.02]" : "border-border-primary hover:-translate-y-1 hover:border-border-hover hover:shadow-md"}`}
          >
            <span
              className={`font-header text-xl font-extrabold ${activeStep === "audit" ? "text-accent" : "text-text-muted"}`}
            >
              2
            </span>
            <span className="font-header text-lg font-bold text-text-primary">
              audit
            </span>
            <span className="text-xs text-text-secondary mt-1">
              Adversarial Review
            </span>
          </button>

          <div className="hidden lg:flex gap-4 items-center justify-center text-text-muted mx-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Findings
              </span>
              <ArrowRight size={16} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <ArrowRight size={16} className="rotate-180" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Recompile
              </span>
            </div>
          </div>
          <div className="lg:hidden flex gap-4 items-center text-text-muted">
            <ArrowDown size={20} />
            <ArrowDown size={20} className="rotate-180" />
          </div>

          <button
            onClick={() => setActiveStep("refine")}
            className={`flex flex-col items-center justify-center min-w-[120px] min-h-[110px] p-4 bg-bg-primary border-2 rounded-xl transition-all ${activeStep === "refine" ? "border-accent shadow-[0_4px_12px_rgba(2,132,199,0.15)] scale-[1.02]" : "border-border-primary hover:-translate-y-1 hover:border-border-hover hover:shadow-md"}`}
          >
            <span
              className={`font-header text-xl font-extrabold ${activeStep === "refine" ? "text-accent" : "text-text-muted"}`}
            >
              3
            </span>
            <span className="font-header text-lg font-bold text-text-primary">
              refine
            </span>
            <span className="text-xs text-text-secondary mt-1">
              Resolution Loop
            </span>
          </button>

          <div className="hidden lg:flex flex-col items-center text-text-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Clean Spec
            </span>
            <ArrowRight size={20} />
          </div>
          <div className="lg:hidden flex flex-col items-center text-text-muted">
            <ArrowDown size={20} />
          </div>

          <button
            onClick={() => setActiveStep("lock")}
            className={`flex flex-col items-center justify-center min-w-[120px] min-h-[110px] p-4 bg-bg-primary border-2 rounded-xl transition-all ${activeStep === "lock" ? "border-accent shadow-[0_4px_12px_rgba(2,132,199,0.15)] scale-[1.02]" : "border-border-primary hover:-translate-y-1 hover:border-border-hover hover:shadow-md"}`}
          >
            <span
              className={`font-header text-xl font-extrabold ${activeStep === "lock" ? "text-accent" : "text-text-muted"}`}
            >
              4
            </span>
            <span className="font-header text-lg font-bold text-text-primary">
              lock
            </span>
            <span className="text-xs text-text-secondary mt-1">
              Finalization Gate
            </span>
          </button>
        </div>

        {/* Details Card */}
        <div
          key={activeStep}
          className="animate-in fade-in slide-in-from-bottom-2 duration-200 border-l-4 border-accent pl-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-bold uppercase text-accent bg-accent/10 px-2.5 py-1 rounded">
              {data.stepNum}
            </span>
            <h3 className="text-2xl font-header font-bold text-text-primary">
              {data.title}
            </h3>
          </div>
          <p className="text-text-secondary mb-5 leading-relaxed">
            {data.desc}
          </p>
          <div className="flex flex-col gap-3 bg-bg-primary p-4 md:p-5 rounded-lg border border-border-primary">
            <div className="grid grid-cols-[130px_1fr] gap-3 text-sm">
              <span className="font-semibold text-text-secondary">
                Primary Output:
              </span>
              <code className="text-text-primary font-mono font-medium break-all">
                {data.output}
              </code>
            </div>
            <div className="grid grid-cols-[130px_1fr] gap-3 text-sm">
              <span className="font-semibold text-text-secondary">
                Required Gate:
              </span>
              <span className="text-text-primary">{data.gate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-6 p-5">
        <h4 className="m-0 mb-2 text-base font-bold text-text-primary">
          Execution Modes
        </h4>
        <p className="m-0 text-[15px] leading-relaxed text-text-secondary">
          The protocol flow above is the same regardless of how you invoke it.
          <strong className="text-text-primary font-semibold">
            {" "}
            Multi-Context (Core Flow)
          </strong>{" "}
          runs each skill in a separate session with context clearing between
          phases — recommended for large specifications or constrained context
          windows.
          <strong className="text-text-primary font-semibold">
            {" "}
            Single-Context
          </strong>{" "}
          uses the <em className="not-italic font-medium">
            Spec Orchestrate
          </em>{" "}
          skill to run the full pipeline in one continuous conversation — best
          when context window management is not a concern.
        </p>
      </div>
    </div>
  );
}

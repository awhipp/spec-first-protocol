import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const SCRIPT_DATA = [
  {
    phase: "Discover",
    command: "sfp discover",
    outputLines: [
      {
        text: "[SYSTEM] Initializing Spec-First Protocol Discovery...",
        delay: 500,
        type: "system",
      },
      {
        text: "? What is the primary objective of this project?",
        delay: 800,
        type: "prompt",
      },
      {
        text: "> We need to implement a checkout flow for our e-commerce platform.",
        delay: 1000,
        type: "input",
      },
      {
        text: "? What payment providers are we supporting?",
        delay: 600,
        type: "prompt",
      },
      { text: "> Stripe and PayPal.", delay: 800, type: "input" },
      {
        text: "? Do we need to handle physical shipping calculations?",
        delay: 600,
        type: "prompt",
      },
      { text: "> No, digital goods only.", delay: 800, type: "input" },
      {
        text: "[SUCCESS] Discovery complete. Compiling draft specification...",
        delay: 1200,
        type: "success",
      },
    ],
  },
  {
    phase: "Audit",
    command: "sfp audit",
    outputLines: [
      {
        text: "[SYSTEM] Adversarial review initiated...",
        delay: 500,
        type: "system",
      },
      {
        text: "[BLOCKER] Stripe integration requires webhook handling which is not defined.",
        delay: 800,
        type: "error",
      },
      {
        text: "[BLOCKER] Missing user authentication requirements before checkout.",
        delay: 600,
        type: "error",
      },
      {
        text: "[WARNING] PayPal integration scope is vaguely defined.",
        delay: 600,
        type: "warning",
      },
      {
        text: "[SYSTEM] Audit complete. 2 Blockers, 1 Warning.",
        delay: 1000,
        type: "system",
      },
    ],
  },
  {
    phase: "Refine",
    command: "sfp refine",
    outputLines: [
      { text: "[SYSTEM] Resolving blockers...", delay: 500, type: "system" },
      {
        text: "Issue: Missing user authentication requirements.",
        delay: 600,
        type: "system",
      },
      {
        text: "> Users must be logged in via OAuth (Google/GitHub) before checkout.",
        delay: 1200,
        type: "input",
      },
      {
        text: "Issue: Stripe webhook handling not defined.",
        delay: 600,
        type: "system",
      },
      {
        text: "> Add an endpoint to receive checkout.session.completed events.",
        delay: 1200,
        type: "input",
      },
      {
        text: "[SUCCESS] Blockers resolved. Recompiling draft...",
        delay: 800,
        type: "success",
      },
    ],
  },
  {
    phase: "Audit 2",
    command: "sfp audit",
    outputLines: [
      {
        text: "[SYSTEM] Adversarial review initiated...",
        delay: 500,
        type: "system",
      },
      {
        text: "[BLOCKER] OAuth implementation conflicts with existing email/password auth system.",
        delay: 800,
        type: "error",
      },
      {
        text: "[SYSTEM] Audit complete. 1 Blocker, 0 Warnings.",
        delay: 1000,
        type: "system",
      },
    ],
  },
  {
    phase: "Refine 2",
    command: "sfp refine",
    outputLines: [
      { text: "[SYSTEM] Resolving blockers...", delay: 500, type: "system" },
      {
        text: "Issue: OAuth implementation conflicts with existing email/password auth system.",
        delay: 600,
        type: "system",
      },
      {
        text: "> We will support both. Link OAuth accounts to email accounts if email matches.",
        delay: 1500,
        type: "input",
      },
      {
        text: "[SUCCESS] Blocker resolved. Recompiling draft...",
        delay: 800,
        type: "success",
      },
    ],
  },
  {
    phase: "Lock",
    command: "sfp audit",
    outputLines: [
      {
        text: "[SYSTEM] Finalizing specification...",
        delay: 500,
        type: "system",
      },
      {
        text: "[SYSTEM] Zero blockers remaining.",
        delay: 600,
        type: "success",
      },
      {
        text: "[SUCCESS] Specification locked: specs/2026-06-05_CHECKOUT-FLOW_SPEC.md",
        delay: 800,
        type: "success",
      },
      {
        text: "[SYSTEM] Cleaning up temporary workspace.",
        delay: 500,
        type: "system",
      },
    ],
  },
];

export default function TerminalSimulator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);

  // The currently typing string (for the command or the input lines)
  const [typedText, setTypedText] = useState("");
  const [renderPhase, setRenderPhase] = useState("command");

  const timeoutRef = useRef(null);
  const stateRef = useRef({
    stepIndex: 0,
    lineIndex: -1,
    charIndex: 0,
    phase: "command", // 'command' | 'output'
    isPlaying: false,
  });

  const scrollRef = useRef(null);

  // Sync refs with state
  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
    stateRef.current.stepIndex = currentStepIndex;
  }, [isPlaying, currentStepIndex]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines, typedText]);

  useEffect(() => {
    if (!isPlaying) {
      clearTimeout(timeoutRef.current);
      return;
    }

    const runPlayback = () => {
      const s = stateRef.current;
      if (!s.isPlaying) return;

      const currentStep = SCRIPT_DATA[s.stepIndex];
      if (!currentStep) {
        setIsPlaying(false);
        return;
      }

      if (s.phase === "command") {
        const targetText = currentStep.command;
        if (s.charIndex < targetText.length) {
          setTypedText(targetText.slice(0, s.charIndex + 1));
          s.charIndex++;
          // Typewriter speed
          timeoutRef.current = setTimeout(runPlayback, Math.random() * 50 + 50);
        } else {
          // Command finished typing
          timeoutRef.current = setTimeout(() => {
            setVisibleLines((prev) => [
              ...prev,
              { text: `$ ${targetText}`, type: "command" },
            ]);
            setTypedText("");
            s.phase = "output";
            setRenderPhase("output");
            s.lineIndex = 0;
            s.charIndex = 0;
            runPlayback();
          }, 400); // pause before execution
        }
      } else if (s.phase === "output") {
        if (s.lineIndex < currentStep.outputLines.length) {
          const line = currentStep.outputLines[s.lineIndex];

          if (line.type === "input") {
            // type it out
            if (s.charIndex < line.text.length) {
              setTypedText(line.text.slice(0, s.charIndex + 1));
              s.charIndex++;
              timeoutRef.current = setTimeout(
                runPlayback,
                Math.random() * 40 + 30,
              );
            } else {
              // done typing input
              timeoutRef.current = setTimeout(() => {
                setVisibleLines((prev) => [...prev, { ...line }]);
                setTypedText("");
                s.lineIndex++;
                s.charIndex = 0;
                runPlayback();
              }, line.delay || 500);
            }
          } else {
            // just display it at once
            setVisibleLines((prev) => [...prev, { ...line }]);
            s.lineIndex++;
            timeoutRef.current = setTimeout(runPlayback, line.delay || 500);
          }
        } else {
          // Step finished
          timeoutRef.current = setTimeout(() => {
            handleNextAction();
          }, 1500); // 1.5 second pause before automatically continuing
        }
      }
    };

    const handleNextAction = () => {
      const s = stateRef.current;
      const nextStepIndex = s.stepIndex + 1;
      if (nextStepIndex >= SCRIPT_DATA.length) {
        // Reset
        setCurrentStepIndex(0);
        setVisibleLines([]);
        setTypedText("");
        setIsPlaying(false);
        s.stepIndex = 0;
        s.lineIndex = -1;
        s.charIndex = 0;
        s.phase = "command";
        setRenderPhase("command");
        s.isPlaying = false;
      } else {
        // Add visual compilation gap
        setVisibleLines((prev) => [...prev, { text: "---", type: "divider" }]);
        setCurrentStepIndex(nextStepIndex);
        s.stepIndex = nextStepIndex;
        s.phase = "command";
        setRenderPhase("command");
        s.charIndex = 0;
        s.lineIndex = -1;
        runPlayback();
      }
    };

    runPlayback();

    return () => clearTimeout(timeoutRef.current);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setVisibleLines([]);
    setTypedText("");
    setRenderPhase("command");
    stateRef.current = {
      stepIndex: 0,
      lineIndex: -1,
      charIndex: 0,
      phase: "command",
      isPlaying: false,
    };
  };

  return (
    <div className="card w-full max-w-3xl mx-auto flex flex-col p-0 overflow-hidden shadow-xl border-border-primary">
      {/* Header Controls */}
      <div className="bg-bg-secondary border-b border-border-primary px-4 py-3 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="text-sm font-mono text-text-muted font-medium">
          SFP Pipeline Example
        </div>
        <div className="flex space-x-2">
          <button
            onClick={togglePlay}
            className="p-1 text-text-secondary hover:text-accent transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={reset}
            className="p-1 text-text-secondary hover:text-accent transition-colors"
            aria-label="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="bg-[#0f172a] text-[#f8fafc] p-5 font-mono text-sm h-80 overflow-y-auto scroll-smooth"
      >
        <div className="space-y-1.5">
          {visibleLines.map((line, idx) => (
            <div
              key={idx}
              className={`
              ${line.type === "system" ? "text-blue-300" : ""}
              ${line.type === "prompt" ? "text-amber-300 font-bold" : ""}
              ${line.type === "input" ? "text-green-300" : ""}
              ${line.type === "error" ? "text-red-400 font-bold" : ""}
              ${line.type === "warning" ? "text-orange-300" : ""}
              ${line.type === "success" ? "text-green-400 font-bold" : ""}
              ${line.type === "divider" ? "text-slate-500 my-4 text-center" : ""}
            `}
            >
              {line.text}
            </div>
          ))}

          {/* Current typing line */}
          {isPlaying && renderPhase === "command" && (
            <div className="text-slate-100">
              <span className="text-accent-hover font-bold mr-2">$</span>
              {typedText}
              <span className="animate-pulse bg-slate-100 w-2 h-4 inline-block align-middle ml-1"></span>
            </div>
          )}

          {/* Current typing input */}
          {isPlaying && renderPhase === "output" && typedText && (
            <div className="text-green-300">
              {typedText}
              <span className="animate-pulse bg-green-300 w-2 h-4 inline-block align-middle ml-1"></span>
            </div>
          )}
        </div>

        {/* Start CTA Overlay */}
        {!isPlaying && visibleLines.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="btn btn--primary !bg-accent hover:!bg-accent-hover text-white flex items-center gap-2"
            >
              <Play size={16} /> Run SFP Pipeline Simulation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

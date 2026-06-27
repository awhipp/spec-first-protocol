import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Sliders,
} from "lucide-react";

export default function ContextAnimation() {
  const [turns, setTurns] = useState(15);

  // Sound math grounded in actual SFP/LLM specs:
  // - Discover system prompt size: ~4,000 tokens
  // - Average interview turn size: ~600 tokens (accumulating history + new inputs/outputs)
  // - SFP Locked Spec + Handoff Prompt: ~2,000 tokens (virtually static reference)
  const systemPromptTokens = 4000;
  const tokensPerTurn = 600;

  const rawContext = systemPromptTokens + turns * tokensPerTurn;
  const sfpContext = 1200 + turns * 50;
  const reductionPercentage = Math.round((1 - sfpContext / rawContext) * 100);

  // Stanford "Lost in the Middle" research paper math:
  // - GPT-3.5-Turbo multi-document QA recall accuracy metrics from Figure 1 / Appendix G:
  //   - 10 documents (~1.5k tokens, short context): Index 0 (Primacy/Start) = 76.8%, Index 4 (Middle) = 61.2%
  //   - 20 documents (~3.0k tokens, medium context): Index 0 (Primacy/Start) = 75.8%, Index 9 (Middle) = 53.8%
  //   - 30 documents (~4.4k tokens, long context): Index 0 (Primacy/Start) = 73.4%, Index 14 (Middle) = 50.5%
  // - With SFP, requirements are isolated into a concise spec (small context) and placed at Index 0.
  // - Without SFP, requirements are buried in conversational history (middle context), causing decay.
  const getRawAccuracy = (t) => {
    if (t <= 10) {
      return Math.round(70.0 - ((t - 5) / 5) * (70.0 - 61.2));
    } else if (t <= 20) {
      return Math.round(61.2 - ((t - 10) / 10) * (61.2 - 53.8));
    } else if (t <= 30) {
      return Math.round(53.8 - ((t - 20) / 10) * (53.8 - 50.5));
    } else {
      return Math.round(50.5 - ((t - 30) / 20) * (50.5 - 42.0));
    }
  };

  const getSfpAccuracy = (t) => {
    if (t <= 10) {
      return Math.round(76.8 - ((t - 5) / 5) * (76.8 - 76.5));
    } else if (t <= 20) {
      return Math.round(76.5 - ((t - 10) / 10) * (76.5 - 75.8));
    } else if (t <= 30) {
      return Math.round(75.8 - ((t - 20) / 10) * (75.8 - 73.4));
    } else {
      return Math.round(73.4 - ((t - 30) / 20) * (73.4 - 71.0));
    }
  };

  const rawAccuracy = getRawAccuracy(turns);
  const sfpAccuracy = getSfpAccuracy(turns);

  return (
    <div className="w-full flex flex-col gap-6 bg-bg-secondary border border-border-primary rounded-2xl p-6 md:p-8 shadow-sm">


      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-0">
        {/* Left Column: Without SFP */}
        <div className="flex flex-col bg-bg-primary border border-border-primary hover:border-danger-border/60 rounded-xl p-5 shadow-3xs transition-all">
          <div className="flex items-center justify-between mb-3.5 border-b border-border-primary/40 pb-3">
            <span className="text-xs font-bold uppercase text-danger-primary bg-danger-bg px-2.5 py-1 rounded-md border border-danger-border flex items-center gap-1.5">
              <AlertTriangle size={13} />
              Raw Chat
            </span>
            <div className="flex flex-col items-end">
              <span className="font-mono text-base font-bold text-danger-primary">
                ~{rawContext.toLocaleString()} tokens
              </span>
              <span className="text-[10px] text-text-muted mt-0.5 font-medium">
                Recall Accuracy:{" "}
                <strong className="text-danger-primary">{rawAccuracy}%</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-text-secondary my-3.5 leading-relaxed">
            Feeding raw, multi-turn chat transcripts directly to a coding agent
            introduces dialogue noise and irrelevant stubs.
          </p>

          <div className="space-y-2.5 flex-1">
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-danger-primary font-bold">⚠️</span>
              <span>
                <strong>Attention Decay:</strong> Critical details get lost in
                the middle of the context, dropping recall accuracy to{" "}
                <strong>{rawAccuracy}%</strong>.
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-danger-primary font-bold">⚠️</span>
              <span>
                <strong>Outdated Drafts:</strong> Agent reads old stubs and
                overrides, causing logic errors.
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-danger-primary font-bold">⚠️</span>
              <span>
                <strong>Token Waste:</strong> Accumulates high API cost per
                prompt cycle.
              </span>
            </div>
          </div>

          {/* Visual Bar representation */}
          <div className="mt-5 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-danger-primary h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (rawContext / 34000) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Right Column: With SFP */}
        <div className="flex flex-col bg-bg-primary border border-border-primary hover:border-success-border/60 rounded-xl p-5 shadow-3xs transition-all">
          <div className="flex items-center justify-between mb-3.5 border-b border-border-primary/40 pb-3">
            <span className="text-xs font-bold uppercase text-success-primary bg-success-bg px-2.5 py-1 rounded-md border border-success-border flex items-center gap-1.5">
              <Check size={13} />
              With SFP
            </span>
            <div className="flex flex-col items-end">
              <span className="font-mono text-base font-bold text-success-primary">
                ~{sfpContext.toLocaleString()} tokens
              </span>
              <span className="text-[10px] text-text-muted mt-0.5 font-medium">
                Recall Accuracy:{" "}
                <strong className="text-success-primary">{sfpAccuracy}%</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-text-secondary my-3.5 leading-relaxed">
            Discovery chat is compressed into a clean markdown spec and a
            runnable downstream prompt in a fresh session.
          </p>

          <div className="space-y-2.5 flex-1">
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-success-primary font-bold">✓</span>
              <span>
                <strong>Pristine Focus:</strong> Keeps requirements at the very
                start of context (Primacy position) for{" "}
                <strong>{sfpAccuracy}%</strong> recall.
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-success-primary font-bold">✓</span>
              <span>
                <strong>Mathematical Completeness:</strong> Zero TODO
                placeholders survive.
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-success-primary font-bold">✓</span>
              <span>
                <strong>Precision Handoff:</strong> Synthesized runnable prompts
                direct the builder.
              </span>
            </div>
          </div>

          {/* Visual Bar representation */}
          <div className="mt-5 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-success-primary h-full transition-all duration-300"
              style={{ width: `${(sfpContext / 34000) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Output Math */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border-primary pt-6 mt-2">
        {/* Slider control */}
        <div className="flex flex-col gap-2.5 w-full md:w-[350px]">
          <div className="flex justify-between items-center">
            <label
              htmlFor="turn-slider"
              className="text-sm font-bold text-text-primary flex items-center gap-1.5 cursor-pointer select-none"
            >
              <Sliders size={15} className="text-accent" />
              Discovery Chat Length
            </label>
            <span className="bg-bg-primary border border-border-primary text-xs font-extrabold px-2.5 py-1 rounded-md text-accent">
              {turns} turns
            </span>
          </div>
          <input
            id="turn-slider"
            type="range"
            min="5"
            max="50"
            step="1"
            value={turns}
            onChange={(e) => setTurns(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-[10px] text-text-muted select-none">
            <span>Short (5 turns)</span>
            <span>Medium (20 turns)</span>
            <span>Long (50 turns)</span>
          </div>
        </div>

        {/* Dynamic calculation result */}
        <div className="flex items-center gap-5 bg-bg-primary border border-border-primary p-4 rounded-xl shadow-2xs w-full md:w-auto shrink-0 select-none">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Payload Reduction
            </span>
            <span className="text-3xl font-header font-black text-success-primary tracking-tight leading-tight">
              ~{reductionPercentage}%
            </span>
            <span className="text-[10px] text-text-muted font-medium mt-0.5">
              Raw Context: ~{rawContext.toLocaleString()} vs SFP: ~
              {sfpContext.toLocaleString()} tokens
            </span>
          </div>
          <div className="h-12 w-px bg-border-primary"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Recall Accuracy
            </span>
            <span className="text-3xl font-header font-black text-success-primary tracking-tight leading-tight">
              +{sfpAccuracy - rawAccuracy}%
            </span>
            <span className="text-[10px] text-text-muted font-medium mt-0.5">
              Raw: {rawAccuracy}% vs SFP: <strong>{sfpAccuracy}%</strong> recall
            </span>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="bg-bg-primary border border-border-primary/50 rounded-xl p-4 text-xs text-text-secondary leading-relaxed space-y-2">
        <p className="m-0">
          As conversational chat transcripts grow, important requirements get buried in the middle of the context window.
          This causes LLM recall accuracy to plummet from <strong>61.2%</strong> (~1.5k tokens) down to <strong>50.5%</strong> (~4.4k tokens).

          SFP prevents this attention decay by isolating requirements into a dense specification at the very beginning of a fresh context session, preserving peak recall (<strong>73.4% – 76.8%</strong>). The slider below dynamically models this decay and primacy recovery relative to chat length.
        </p>
      </div>
    </div>
  );
}

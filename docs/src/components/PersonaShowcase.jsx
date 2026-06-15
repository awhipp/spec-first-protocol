import { useState } from "react";
import {
  Compass,
  TrendingUp,
  Gamepad2,
  BookOpen,
  Calendar,
  Dumbbell,
  X,
  ShieldAlert,
  FileText,
  MessageSquareCode,
} from "lucide-react";

const PERSONAS = [
  {
    id: "travel-advisor",
    name: "Travel Advisor",
    domain: "Travel Planning",
    description:
      "Specialize in itinerary logistics, budget constraints, travel documents, and contingencies.",
    icon: Compass,
    color: "text-sky-500 bg-sky-50 border-sky-100",
    discovery: [
      "Ask for all travel dates, including flexibility windows.",
      "Determine specific destinations, layovers, and preferred modes of transit.",
      "Ask about passport, visa, and vaccination requirements for the destination.",
      "Clarify dietary restrictions, mobility constraints, and accessibility needs for all travelers.",
      "Establish the hard maximum budget and preferred spending allocations.",
    ],
    auditRules: [
      {
        rule: "Passport/Visa check",
        severity: "Blocker",
        detail:
          "Must explicitly list visa/passport requirements if international travel is involved.",
      },
      {
        rule: "Short layovers",
        severity: "Warning",
        detail:
          "Raise a warning if any layover duration is less than 1 hour for international connections.",
      },
      {
        rule: "Budget overrun",
        severity: "Blocker",
        detail: "Flag if the planned allocations exceed the maximum budget.",
      },
      {
        rule: "Dietary & accessibility",
        severity: "Warning",
        detail:
          "Verify that accessibility needs and diets are mapped to transit/catering.",
      },
    ],
    downstream: [
      "Produce a day-by-day itinerary document with times, locations, and transit details.",
      "Include booking references, confirmation numbers, and contact info for accommodations.",
      "Generate a contingency action card for each risk in the Contingency Matrix.",
      "Produce a budget breakdown table showing planned vs. allocated spending.",
    ],
  },
  {
    id: "stock-market-advisor",
    name: "Stock Market Advisor",
    domain: "Stock Trading",
    description:
      "Focus on risk tolerance, portfolio diversification, investment horizons, and benchmarks.",
    icon: TrendingUp,
    color: "text-emerald-500 bg-emerald-50 border-emerald-100",
    discovery: [
      "Identify the client's core investment goal (e.g., retirement, wealth preservation, growth).",
      "Determine the investment time horizon (short, medium, long term).",
      "Assess the client's risk tolerance mathematically (e.g., maximum acceptable drawdown).",
      "Clarify current portfolio composition and available capital to deploy.",
      "Ask about sector preferences or exclusions (e.g., ESG requirements, no fossil fuels).",
    ],
    auditRules: [
      {
        rule: "Allocation sum",
        severity: "Blocker",
        detail:
          "Verify that target allocation weights (equities, bonds, cash) sum to exactly 100%.",
      },
      {
        rule: "Drawdown contradiction",
        severity: "Warning",
        detail:
          "Flag if a low-risk client allocation is heavily weighted in volatile equities.",
      },
      {
        rule: "Exclusion definition",
        severity: "Suggestion",
        detail:
          "If sector exclusions are mentioned, ensure they are explicitly defined in constraints.",
      },
      {
        rule: "Benchmark validation",
        severity: "Warning",
        detail:
          "Ensure a clear benchmark (e.g., S&P 500) is selected for tracking.",
      },
    ],
    downstream: [
      "Produce a portfolio strategy document with target allocations and rebalancing triggers.",
      "Generate a risk analysis report mapping holdings to client drawdown tolerance.",
      "Create a trade execution rule sheet with position sizing and stop-loss levels.",
      "Include a benchmark comparison framework for tracking portfolio performance.",
    ],
  },
  {
    id: "rpg-campaign-master",
    name: "RPG Campaign Master",
    domain: "Tabletop RPGs",
    description:
      "Focus on narrative arc consistency, encounter balancing, NPC rosters, and player agency tracking.",
    icon: Gamepad2,
    color: "text-purple-500 bg-purple-50 border-purple-100",
    discovery: [
      "Establish the core premise, setting, and tone of the campaign (e.g., grimdark, high fantasy).",
      "Ask about the primary antagonist(s) and their motivations.",
      "Determine the starting level of the player characters and the expected progression.",
      "Clarify key player character backstories and how they tie into the main plot.",
      "Establish any specific homebrew rules or restricted character options.",
    ],
    auditRules: [
      {
        rule: "Antagonist motivation",
        severity: "Warning",
        detail:
          "Flag if the primary villain's motive is missing or logically inconsistent.",
      },
      {
        rule: "Unmapped backstories",
        severity: "Suggestion",
        detail:
          "Verify that player backstory hooks map to at least one NPC, location, or milestone.",
      },
      {
        rule: "Progression scale",
        severity: "Warning",
        detail:
          "Check that expected leveling pace matches the planned campaign length.",
      },
      {
        rule: "Restricted options check",
        severity: "Blocker",
        detail:
          "Flag if restricted mechanics conflict with a selected player backstory.",
      },
    ],
    downstream: [
      "Produce session-by-session outlines with narrative beats and encounter triggers.",
      "Generate NPC stat blocks and personality summaries for the active roster.",
      "Create encounter tables with difficulty ratings aligned to party level milestones.",
      "Produce a narrative arc tracker linking character backstories to plot resolutions.",
    ],
  },
  {
    id: "curriculum-designer",
    name: "Curriculum Designer",
    domain: "Education",
    description:
      "Focus on learning objectives mapping, assessment metrics, accessibility, and modular lesson planning.",
    icon: BookOpen,
    color: "text-amber-500 bg-amber-50 border-amber-100",
    discovery: [
      "Identify the target audience (age group, background knowledge, learning needs).",
      "Determine the overarching goal and specific learning objectives of the course.",
      "Ask about preferred teaching methodologies (e.g., project-based, interactive).",
      "Establish the format (in-person, remote, hybrid) and duration of the course.",
      "Clarify accessibility requirements and accommodations for diverse learners.",
    ],
    auditRules: [
      {
        rule: "Missing assessment",
        severity: "Blocker",
        detail:
          "Every module in the curriculum must have a defined assessment method.",
      },
      {
        rule: "Unmeasurable objectives",
        severity: "Warning",
        detail:
          'Flag vague objective verbs like "understand" or "know" instead of actionable ones.',
      },
      {
        rule: "Accessibility missing",
        severity: "Blocker",
        detail:
          "Ensure accessibility accommodations are defined, blocking sign-off if blank.",
      },
      {
        rule: "Duration mismatch",
        severity: "Warning",
        detail:
          "Verify that the sum of module hours matches the declared course length.",
      },
    ],
    downstream: [
      "Produce a complete syllabus with objectives, weekly schedule, and policies.",
      "Generate lesson plans with topic lists, instructional activities, and timings.",
      "Create grading rubrics aligned to the specific learning objectives.",
      "Produce an accessibility checklist for instructors.",
    ],
  },
  {
    id: "event-planner",
    name: "Event Planner",
    domain: "Event Coordination",
    description:
      "Focus on vendor coordination, run-of-show, venue capacity constraints, and layouts.",
    icon: Calendar,
    color: "text-rose-500 bg-rose-50 border-rose-100",
    discovery: [
      "Identify target guest count, date, and venue details.",
      "Establish layout preferences and capacity restrictions.",
      "Clarify vendor details, delivery times, and setup durations.",
      "Ask about catering choices, dietary accommodations, and facilities.",
      "Define emergency backup plans for outdoor spaces.",
    ],
    auditRules: [
      {
        rule: "Venue time overrun",
        severity: "Blocker",
        detail:
          "Check if event duration and setup/cleanup buffers exceed venue rental hours.",
      },
      {
        rule: "Transition delays",
        severity: "Warning",
        detail:
          "Flag if layover times between program agenda segments are less than 15 minutes.",
      },
      {
        rule: "Catering count mismatch",
        severity: "Blocker",
        detail:
          "Ensure vendor catering counts align with RSVPs and target guest counts.",
      },
      {
        rule: "Missing permits",
        severity: "Warning",
        detail:
          "Ensure all necessary permits are explicitly accounted for based on event size and activities.",
      },
    ],
    downstream: [
      "Generate a minute-by-minute run-of-show timeline for vendors and coordinators.",
      "Produce layout schematics mapping seating, staging, and vendor load zones.",
      "Produce a delivery tracking sheet for all key external vendors.",
      "Generate a consolidated budget tracking sheet.",
    ],
  },
  {
    id: "fitness-coach",
    name: "Fitness Coach",
    domain: "Health & Fitness",
    description:
      "Focus on biometric profiling, macro-nutrient breakdowns, progressive overload, and medical constraints.",
    icon: Dumbbell,
    color: "text-indigo-500 bg-indigo-50 border-indigo-100",
    discovery: [
      "Gather age, body composition, sleep schedule, and stress baselines.",
      "Establish specific goals (e.g. fat loss, hypertrophy, endurance).",
      "Clarify exercise history, injuries, and mobility restrictions.",
      "Determine preferred workout frequencies and equipment access.",
      "Map macro-nutrient preferences and food intolerances.",
    ],
    auditRules: [
      {
        rule: "Calorie deficit floor",
        severity: "Blocker",
        detail:
          "Ensure target daily calories do not drop below the user's absolute BMR threshold.",
      },
      {
        rule: "Volume scaling",
        severity: "Warning",
        detail:
          "Check progressive overload progression rates; flag training volume jumps >10% weekly.",
      },
      {
        rule: "Injury conflict",
        severity: "Blocker",
        detail:
          "Flag if workouts include exercises that aggravate declared physical restrictions.",
      },
    ],
    downstream: [
      "Produce a 4-week workout log detailing exercises, target reps, sets, and rest times.",
      "Generate a daily macronutrient meals planner with hydration targets.",
      "Create a progress tracking sheet for key metrics.",
      "Generate a sleep hygiene and recovery checklist.",
    ],
  },
];

export default function PersonaShowcase() {
  const [selectedPersona, setSelectedPersona] = useState(null);

  return (
    <div className="w-full">
      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PERSONAS.map((persona) => {
          const IconComponent = persona.icon;
          return (
            <div
              key={persona.id}
              onClick={() => setSelectedPersona(persona)}
              className="bg-bg-primary border border-border-primary hover:border-accent hover:shadow-md hover:-translate-y-0.5 rounded-xl p-5 transition-all cursor-pointer flex flex-col gap-4 shadow-3xs"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg border ${persona.color}`}>
                  <IconComponent size={20} />
                </div>
                <div>
                  <h4 className="text-base font-header font-bold text-text-primary m-0">
                    {persona.name}
                  </h4>
                  <span className="text-xs text-text-muted font-medium">
                    {persona.domain}
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed m-0 flex-1">
                {persona.description}
              </p>
              <div className="text-[11px] font-semibold text-accent flex items-center gap-1.5 border-t border-border-primary/50 pt-3 mt-1">
                <span>View Rules & Downstream Guidance</span>
                <span className="text-[13px]">→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Modal Popup */}
      {selectedPersona && (
        <div
          onClick={() => setSelectedPersona(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-xs p-4 cursor-pointer transition-opacity animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[620px] bg-bg-primary rounded-2xl shadow-xl border border-border-primary flex flex-col relative max-h-[85vh] cursor-default overflow-hidden animate-in zoom-in-95 duration-250"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-primary bg-bg-secondary">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg border ${selectedPersona.color}`}
                >
                  <selectedPersona.icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-header font-bold text-text-primary m-0">
                    {selectedPersona.name} Settings
                  </h3>
                  <span className="text-xs text-text-muted font-medium">
                    {selectedPersona.domain}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPersona(null)}
                className="text-text-muted hover:text-text-primary p-1 bg-transparent border-none cursor-pointer focus:outline-none transition-colors"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Description */}
              <div className="text-sm text-text-secondary leading-relaxed bg-bg-secondary p-4 rounded-xl border border-border-primary">
                <strong>Persona Focus:</strong> {selectedPersona.description}
              </div>

              {/* 1. Discovery Prompts */}
              <div>
                <h4 className="text-xs font-bold uppercase text-text-muted tracking-wider mb-3 flex items-center gap-2">
                  <MessageSquareCode size={15} className="text-accent" />
                  1. Discovery Prompts (Requirements Gathering)
                </h4>
                <ul className="list-disc list-outside pl-4 space-y-2.5 text-xs text-text-secondary leading-relaxed">
                  {selectedPersona.discovery.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 2. Auditing Rules */}
              <div>
                <h4 className="text-xs font-bold uppercase text-text-muted tracking-wider mb-3 flex items-center gap-2">
                  <ShieldAlert size={15} className="text-danger-primary" />
                  2. Domain Auditing Rules (Adversarial Quality Gate)
                </h4>
                <div className="flex flex-col gap-3">
                  {selectedPersona.auditRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="bg-bg-secondary p-3 rounded-lg border border-border-primary flex items-start gap-3"
                    >
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5 border
                        ${
                          rule.severity === "Blocker"
                            ? "bg-danger-bg text-danger-primary border-danger-border"
                            : rule.severity === "Warning"
                              ? "bg-amber-50 text-amber-600 border-amber-200"
                              : "bg-blue-50 text-blue-600 border-blue-200"
                        }
                      `}
                      >
                        {rule.severity}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-text-primary">
                          {rule.rule}
                        </span>
                        <span className="text-[11px] text-text-secondary leading-normal">
                          {rule.detail}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Downstream Guidance */}
              <div>
                <h4 className="text-xs font-bold uppercase text-text-muted tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={15} className="text-success-primary" />
                  3. Downstream Guidance (Runnable Handoff Instructions)
                </h4>
                <div className="bg-success-bg/15 border border-success-border/40 p-4 rounded-xl">
                  <p className="text-[11px] text-success-primary font-semibold mb-3 leading-normal">
                    When the spec is locked, these directives are automatically
                    compiled with the deliverables into a runnable Downstream
                    Execution Prompt:
                  </p>
                  <ul className="list-decimal list-outside pl-4 space-y-2.5 text-xs text-text-secondary leading-relaxed">
                    {selectedPersona.downstream.map((item, idx) => (
                      <li key={idx} className="pl-0.5">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border-primary bg-bg-secondary flex justify-end">
              <button
                onClick={() => setSelectedPersona(null)}
                className="btn btn--secondary rounded px-5 py-2 text-xs font-semibold hover:bg-slate-100 transition-all border border-border-primary text-text-secondary"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

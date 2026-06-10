import { Terminal, Github } from 'lucide-react';
import TerminalSimulator from './components/TerminalSimulator';
import Flowchart from './components/Flowchart';
import InstallerSelector from './components/InstallerSelector';
import SpecExplorer from './components/SpecExplorer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-body antialiased flex flex-col items-center">
      {/* Header */}
      <header className="sticky top-0 w-full bg-bg-glass backdrop-blur-md border-b border-border-primary z-50">
        <div className="w-full max-w-[1100px] mx-auto px-6 py-3.5 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-text-primary font-header font-extrabold text-[1.2rem] tracking-tight">
            <Terminal className="text-accent" size={24} />
            <span>SFP</span>
          </a>
          <nav className="hidden md:flex gap-7">
            <a href="#why-specs" className="text-[0.9rem] font-medium text-text-secondary hover:text-text-primary transition-colors">Why Specs</a>
            <a href="#flow" className="text-[0.9rem] font-medium text-text-secondary hover:text-text-primary transition-colors">Protocol Flow</a>
            <a href="#install" className="text-[0.9rem] font-medium text-text-secondary hover:text-text-primary transition-colors">Installation</a>
            <a href="#explorer" className="text-[0.9rem] font-medium text-text-secondary hover:text-text-primary transition-colors">Spec Explorer</a>
            <a href="#standards" className="text-[0.9rem] font-medium text-text-secondary hover:text-text-primary transition-colors">Standards</a>
          </nav>
          <a href="https://github.com/awhipp/spec-first-protocol" target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--small flex items-center gap-2 px-4 py-2 rounded-md border border-border-primary text-[0.85rem] font-semibold hover:bg-slate-100 transition-colors">
            <span>GitHub</span>
            <Github size={16} />
          </a>
        </div>
      </header>

      <main className="w-full max-w-[1100px] mx-auto px-6 py-[80px] flex flex-col gap-[100px]">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center pt-[50px] pb-[20px]">
          <h1 className="text-[3.5rem] leading-[1.2] font-header font-extrabold tracking-tight max-w-[800px] mb-[18px]">
            <span className="gradient-text">Spec-First Protocol</span>
          </h1>
          <p className="text-[1.15rem] text-text-secondary max-w-[700px] mb-4">
            An informal precursor to Specification-Driven Development.
          </p>
          <p className="font-header text-[1.25rem] italic text-text-secondary max-w-[650px] mb-[32px] leading-relaxed">
            "Starting execution without a specification is the most expensive shortcut in any project."
          </p>
          <div className="flex gap-3">
            <a href="#install" className="btn bg-text-primary text-bg-primary font-header font-semibold px-6 py-3 rounded-md hover:bg-accent hover:shadow-[0_4px_12px_rgba(2,132,199,0.15)] transition-all">Install Now</a>
            <a href="https://github.com/awhipp/spec-first-protocol" target="_blank" rel="noopener noreferrer" className="btn bg-bg-secondary text-text-secondary border border-border-primary font-header font-semibold px-6 py-3 rounded-md hover:text-text-primary hover:border-border-hover transition-all">View on GitHub</a>
          </div>
        </section>

        {/* What is SFP */}
        <section className="flex flex-col gap-[16px] scroll-m-[80px]" id="about-sfp">
          <div className="max-w-[700px]">
            <h2 className="text-[2.25rem] font-header font-extrabold mb-[8px] text-text-primary tracking-tight">What is the Spec-First Protocol?</h2>
            <p className="text-[1.1rem] text-text-secondary">An automated, iterative pipeline that shifts the cognitive load of specification writing from the project owner to a structured discovery process.</p>
          </div>
          <div className="bg-bg-secondary border-l-4 border-accent py-[32px] px-[40px] rounded-[10px] w-full">
            <p className="font-header text-[1.35rem] font-medium leading-[1.6] text-text-primary m-0">
              The Spec-First Protocol (SFP) operates upstream of any execution framework. It acts as an adversarial validation layer, ensuring requirements are captured, audited, and locked before execution begins.
            </p>
          </div>
          
          <div className="w-full flex flex-col items-center mt-8">
            <div className="w-full max-w-4xl">
              <TerminalSimulator />
            </div>
            <p className="text-[0.95rem] text-text-muted text-center mt-4 italic max-w-2xl">
              Note: The terminal flow above is a simplified demonstration. The actual execution process depends on the specific tooling and workflows implemented in your environment.
            </p>
          </div>
        </section>

        {/* Why Specs Matter */}
        <section className="flex flex-col gap-[16px] scroll-m-[80px]" id="why-specs">
          <div className="max-w-[700px]">
            <h2 className="text-[2.25rem] font-header font-extrabold mb-[8px] text-text-primary tracking-tight">Why Specs Matter</h2>
            <p className="text-[1.1rem] text-text-secondary">Starting execution without a specification is the most expensive shortcut in any project.</p>
          </div>
          <div className="overflow-x-auto border border-border-primary rounded-[10px] bg-bg-primary shadow-sm">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-bg-secondary border-b border-border-primary">
                  <th className="py-[20px] px-[24px] font-header font-bold text-text-primary text-[1rem] w-1/2 border-r border-border-primary">Traditional Problems</th>
                  <th className="py-[20px] px-[24px] font-header font-bold text-text-primary text-[1rem] w-1/2">SFP Solutions</th>
                </tr>
              </thead>
              <tbody className="text-[1rem]">
                <tr className="border-b border-border-primary">
                  <td className="py-[20px] px-[24px] border-r border-border-primary bg-red-50/20">
                    <strong className="inline-block text-[1.05rem] mb-1 text-text-primary">Invisible Scope Creep</strong><br/>
                    <span className="text-text-secondary">Starting execution without a base specification causes silent requirement expansion and makes change tracking impossible.</span>
                  </td>
                  <td className="py-[20px] px-[24px] bg-green-50/25">
                    <strong className="inline-block text-[1.05rem] mb-1 text-success-primary">Structured Interview</strong><br/>
                    <span className="text-text-secondary">The discover skill captures and boundaries requirements before execution begins, forcing alignment on scope boundaries.</span>
                  </td>
                </tr>
                <tr className="border-b border-border-primary">
                  <td className="py-[20px] px-[24px] border-r border-border-primary bg-red-50/20">
                    <strong className="inline-block text-[1.05rem] mb-1 text-text-primary">Compounding Rework</strong><br/>
                    <span className="text-text-secondary">Starting execution with undefined requirements forces costly rework, structural breakages, and endless stop-and-ask cycles.</span>
                  </td>
                  <td className="py-[20px] px-[24px] bg-green-50/25">
                    <strong className="inline-block text-[1.05rem] mb-1 text-success-primary">Adversarial Audit</strong><br/>
                    <span className="text-text-secondary">The audit skill reviews specifications for gaps and contradictions before execution starts, catching issues early.</span>
                  </td>
                </tr>
                <tr className="border-b border-border-primary">
                  <td className="py-[20px] px-[24px] border-r border-border-primary bg-red-50/20">
                    <strong className="inline-block text-[1.05rem] mb-1 text-text-primary">Drift From Intent</strong><br/>
                    <span className="text-text-secondary">Executing from fragmented chat threads forces agents to guess, producing deliverables that miss the project owner's real needs.</span>
                  </td>
                  <td className="py-[20px] px-[24px] bg-green-50/25">
                    <strong className="inline-block text-[1.05rem] mb-1 text-success-primary">Zero Placeholder Invariant</strong><br/>
                    <span className="text-text-secondary">Guarantees that every section is either fully written or omitted. No stubs, TODOs, or empty headings survive.</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-[20px] px-[24px] border-r border-border-primary bg-red-50/20">
                    <strong className="inline-block text-[1.05rem] mb-1 text-text-primary">AI Context Drift</strong><br/>
                    <span className="text-text-secondary">Feeding entire raw chat histories to execution agents wastes token budgets and amplifies hallucination risk with every turn.</span>
                  </td>
                  <td className="py-[20px] px-[24px] bg-green-50/25">
                    <strong className="inline-block text-[1.05rem] mb-1 text-success-primary">Decoupled Lifecycle</strong><br/>
                    <span className="text-text-secondary">Locks a dense, structured specification. Downstream executors get exactly what they need, minimizing token bloat.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Protocol Flow */}
        <section className="flex flex-col gap-[16px] scroll-m-[80px]" id="flow">
          <div className="max-w-[700px]">
            <h2 className="text-[2.25rem] font-header font-extrabold mb-[8px] text-text-primary tracking-tight">The Protocol Flow</h2>
            <p className="text-[1.1rem] text-text-secondary">An interactive, cyclic pipeline that shapes ideas into locked specifications.</p>
          </div>
          <Flowchart />
        </section>



        {/* Installation */}
        <section className="flex flex-col gap-[16px] scroll-m-[80px]" id="install">
          <div className="max-w-[700px]">
            <h2 className="text-[2.25rem] font-header font-extrabold mb-[8px] text-text-primary tracking-tight">Installation & Setup</h2>
            <p className="text-[1.1rem] text-text-secondary">Set up SFP skills in your development environment or AI agent config in seconds.</p>
          </div>
          <InstallerSelector />
        </section>

        {/* Spec Explorer */}
        <section className="flex flex-col gap-[16px] scroll-m-[80px]" id="explorer">
          <div className="max-w-[700px]">
            <h2 className="text-[2.25rem] font-header font-extrabold mb-[8px] text-text-primary tracking-tight">Spec Explorer</h2>
            <p className="text-[1.1rem] text-text-secondary">Browse locked protocol artifacts. Inspect SFP's own implementation specifications.</p>
          </div>
          
          <h3 className="text-[1.5rem] font-header font-extrabold text-text-primary mt-2">Software Engineering</h3>
          
          <SpecExplorer 
            title="Skill Distribution"
            description="I need a way to distribute and install these agentic skills with one click."
            badge="Dependency-free installer scripts (install.sh / install.ps1) and release packaging workflows that distribute SFP skills to local project roots or user global directories."
            filePaths={[
              { label: 'Specification', path: '2026-06-01_SKILL-DISTRIBUTION_SPEC.md' }
            ]}
          />

          <SpecExplorer 
            title="SFP UI"
            description="I need a flashy, easy-to-update static marketing website under /docs to showcase Spec-First Protocol."
            badge="A responsive single-page marketing site under docs/ (React SPA) demonstrating SFP concepts, setup guides, and standard reference guides."
            filePaths={[
              { label: 'Specification', path: '2026-06-01_SFP-UI_SPEC.md' }
            ]}
          />

          <div className="mt-12 mb-6">
            <h3 className="text-[2rem] font-header font-extrabold text-text-primary flex items-center gap-2">Domain Expertise & Personas</h3>
            <p className="text-text-secondary mt-2 text-[1.1rem] leading-[1.6]">
              SFP is fundamentally domain-agnostic. By using <strong>Personas</strong>, SFP adopts domain-specific expertise, targeted discovery prompts, and specialized auditing rules without coupling the core skills to any single domain.
            </p>
          </div>

          <div className="overflow-x-auto border border-border-primary rounded-[10px] bg-bg-primary shadow-sm mb-8">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-bg-secondary border-b border-border-primary">
                  <th className="py-[16px] px-[24px] font-header font-bold text-text-primary border-r border-border-primary">Persona</th>
                  <th className="py-[16px] px-[24px] font-header font-bold text-text-primary border-r border-border-primary">Domain</th>
                  <th className="py-[16px] px-[24px] font-header font-bold text-text-primary">Specialization</th>
                </tr>
              </thead>
              <tbody className="text-[1rem] text-text-secondary">
                <tr className="border-b border-border-primary hover:bg-slate-50 transition-colors">
                  <td className="py-[16px] px-[24px] text-text-primary font-medium border-r border-border-primary">Curriculum Designer</td>
                  <td className="py-[16px] px-[24px] border-r border-border-primary">Education</td>
                  <td className="py-[16px] px-[24px]">Learning objectives, assessments, accessibility.</td>
                </tr>
                <tr className="border-b border-border-primary hover:bg-slate-50 transition-colors">
                  <td className="py-[16px] px-[24px] text-text-primary font-medium border-r border-border-primary">Event Planner</td>
                  <td className="py-[16px] px-[24px] border-r border-border-primary">Event Coordination</td>
                  <td className="py-[16px] px-[24px]">Vendor coordination, run-of-show, venue capacity.</td>
                </tr>
                <tr className="border-b border-border-primary hover:bg-slate-50 transition-colors">
                  <td className="py-[16px] px-[24px] text-text-primary font-medium border-r border-border-primary">Fitness Coach</td>
                  <td className="py-[16px] px-[24px] border-r border-border-primary">Health & Fitness</td>
                  <td className="py-[16px] px-[24px]">Biometrics, macros, progressive overload.</td>
                </tr>
                <tr className="border-b border-border-primary hover:bg-slate-50 transition-colors">
                  <td className="py-[16px] px-[24px] text-text-primary font-medium border-r border-border-primary">RPG Campaign Master</td>
                  <td className="py-[16px] px-[24px] border-r border-border-primary">Tabletop RPGs</td>
                  <td className="py-[16px] px-[24px]">Narrative arcs, NPC hooks, milestone leveling.</td>
                </tr>
                <tr className="border-b border-border-primary hover:bg-slate-50 transition-colors">
                  <td className="py-[16px] px-[24px] text-text-primary font-medium border-r border-border-primary">Stock Market Advisor</td>
                  <td className="py-[16px] px-[24px] border-r border-border-primary">Stock Trading</td>
                  <td className="py-[16px] px-[24px]">Risk tolerance, asset allocation, sector exclusions.</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-[16px] px-[24px] text-text-primary font-medium border-r border-border-primary">Travel Advisor</td>
                  <td className="py-[16px] px-[24px] border-r border-border-primary">Travel Planning</td>
                  <td className="py-[16px] px-[24px]">Logistics, strict budgets, daily itineraries.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SpecExplorer 
            title="Travel Advisor: Disney Vacation"
            description="I am looking to plan out my perfect 4 day vacation to Walt Disney World Florida with my family of 4."
            badge="A locked specification output directly by the Travel Advisor persona detailing park itineraries, budgeting constraints, logistical checklists, and packing lists."
            category="non-software"
            filePaths={[
              { label: 'Specification', path: 'non-software/2026-06-02_PERFECT-DISNEY-VACATION_SPEC.md' },
              { label: 'Booking Checklist', path: 'non-software/Disney_Booking_Checklist.md' },
              { label: 'Packing List', path: 'non-software/Disney_Packing_List_Family4.md' },
              { label: 'Discovery Notes', path: 'non-software/discovery_notes.md' }
            ]}
          />
        </section>

        {/* Reference Standards Table Section */}
        <section className="flex flex-col gap-[16px] scroll-m-[80px]" id="standards">
          <div className="max-w-[700px]">
            <h2 className="text-[2.25rem] font-header font-extrabold mb-[8px] text-text-primary tracking-tight">Skill Authoring Standards</h2>
            <p className="text-[1.1rem] text-text-secondary">Constraints and invariants enforced across the SFP ecosystem to guarantee token efficiency and processing reliability.</p>
          </div>

          <div className="overflow-x-auto border border-border-primary rounded-[10px] bg-bg-primary shadow-sm">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-bg-secondary border-b border-border-primary">
                  <th className="py-[20px] px-[24px] font-header font-bold text-text-primary text-[1rem] border-r border-border-primary">Constraint Name</th>
                  <th className="py-[20px] px-[24px] font-header font-bold text-text-primary text-[1rem] border-r border-border-primary">Limit / Threshold</th>
                  <th className="py-[20px] px-[24px] font-header font-bold text-text-primary text-[1rem]">Technical Rationale</th>
                </tr>
              </thead>
              <tbody className="text-[1rem] text-text-secondary">
                <tr className="border-b border-border-primary hover:bg-slate-50 transition-colors">
                  <td className="py-[20px] px-[24px] text-text-primary border-r border-border-primary"><strong><code className="font-mono bg-bg-secondary px-1.5 py-0.5 rounded text-[0.9rem] border border-border-primary">SKILL.md</code> Length</strong></td>
                  <td className="py-[20px] px-[24px] border-r border-border-primary"><span className="inline-flex items-center bg-cyan-50 text-cyan-700 text-[0.85rem] font-bold px-2.5 py-1 rounded-md border border-cyan-200 shadow-sm whitespace-nowrap">≤ 500 lines</span> <span className="text-text-muted ml-1 whitespace-nowrap">(~5k tokens)</span></td>
                  <td className="py-[20px] px-[24px]">Ensures agents can ingest core skill instructions within compact reasoning loops without saturating context limits.</td>
                </tr>
                <tr className="border-b border-border-primary hover:bg-slate-50 transition-colors">
                  <td className="py-[20px] px-[24px] text-text-primary border-r border-border-primary"><strong>YAML Description</strong></td>
                  <td className="py-[20px] px-[24px] border-r border-border-primary"><span className="inline-flex items-center bg-cyan-50 text-cyan-700 text-[0.85rem] font-bold px-2.5 py-1 rounded-md border border-cyan-200 shadow-sm whitespace-nowrap">≤ 200 characters</span></td>
                  <td className="py-[20px] px-[24px]">Strict boundary for reliable skill matching and dynamic routing across agent platforms.</td>
                </tr>
                <tr className="border-b border-border-primary hover:bg-slate-50 transition-colors">
                  <td className="py-[20px] px-[24px] text-text-primary border-r border-border-primary"><strong>Reference Document Size</strong></td>
                  <td className="py-[20px] px-[24px] border-r border-border-primary"><span className="inline-flex items-center bg-cyan-50 text-cyan-700 text-[0.85rem] font-bold px-2.5 py-1 rounded-md border border-cyan-200 shadow-sm whitespace-nowrap">≤ 300 lines</span> <span className="text-text-muted ml-1 whitespace-nowrap">(~6 KB) per file</span></td>
                  <td className="py-[20px] px-[24px]">Limits supplementary material to immediately absorbable lengths, preventing agent attention fragmentation.</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-[20px] px-[24px] text-text-primary border-r border-border-primary"><strong>Zero Placeholder Invariant</strong></td>
                  <td className="py-[20px] px-[24px] border-r border-border-primary"><span className="inline-flex items-center bg-purple-50 text-purple-700 text-[0.85rem] font-bold px-2.5 py-1 rounded-md border border-purple-200 shadow-sm whitespace-nowrap">100% strict</span></td>
                  <td className="py-[20px] px-[24px]">Prevents stale stubs, "TBD", or TODO items from surviving compilation gates, ensuring all downstream executors receive actionable instructions.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-bg-secondary border-t border-border-primary py-8 mt-10">
        <div className="w-full max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[1rem] text-text-secondary font-medium m-0">&copy; 2026 Spec-First Protocol. Released under the MIT License.</p>
          <div className="flex gap-6">
            <a href="https://github.com/awhipp/spec-first-protocol" target="_blank" rel="noopener noreferrer" className="text-[1rem] text-text-secondary hover:text-accent transition-colors font-medium">GitHub Repository</a>
            <a href="https://github.com/awhipp/spec-first-protocol/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-[1rem] text-text-secondary hover:text-accent transition-colors font-medium">License Details</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from "react";
import { marked } from "marked";
import Prism from "prismjs";
import mermaid from "mermaid";
import {
  FileText,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

// Force initialize mermaid on load
mermaid.initialize({ startOnLoad: false });

export default function SpecExplorer({
  title,
  description,
  badge,
  filePaths,
  category,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeFilePath = filePaths[activeTab].path;
  const localSpecPath = `${import.meta.env.BASE_URL}data/${activeFilePath}`;
  const githubFallbackUrl = `https://github.com/awhipp/spec-first-protocol/blob/main/examples/${activeFilePath}`;

  useEffect(() => {
    if (isExpanded) {
      const fetchSpec = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(localSpecPath);
          if (!res.ok) {
            throw new Error(`Failed to load: ${res.status} ${res.statusText}`);
          }
          const text = await res.text();
          setMarkdownContent(text);
        } catch (err) {
          console.error(
            `Spec-First Protocol Spec Explorer Error [${activeFilePath}]:`,
            err,
          );
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSpec();
    }
  }, [isExpanded, activeFilePath, localSpecPath]);

  useEffect(() => {
    // Re-highlight if content changes
    if (markdownContent && !isLoading && !error) {
      setTimeout(() => {
        Prism.highlightAll();

        // Handle mermaid
        const mermaidBlocks = document.querySelectorAll(".language-mermaid");
        mermaidBlocks.forEach((block) => {
          const pre = block.parentElement;
          if (pre && pre.tagName.toLowerCase() === "pre") {
            const div = document.createElement("div");
            div.className = "mermaid";
            div.textContent = block.textContent;
            pre.parentNode.replaceChild(div, pre);
          }
        });

        const mermaids = document.querySelectorAll(".mermaid");
        if (mermaids.length > 0) {
          mermaid.init(undefined, mermaids);
        }
      }, 0);
    }
  }, [markdownContent, isLoading, error]);

  const getHtmlContent = () => {
    if (error) return null;
    try {
      return { __html: marked.parse(markdownContent) };
    } catch {
      // Fallback
      return {
        __html: `<pre><code class="language-markdown">${markdownContent}</code></pre>`,
      };
    }
  };

  return (
    <div className={`mt-6 ${category === "non-software" ? "mb-10" : ""}`}>
      {/* Meta Header */}
      <div className="bg-bg-primary border border-border-primary rounded-t-xl p-5 border-b-0">
        <h4 className="text-[1.2rem] font-header font-bold text-text-primary mt-0 mb-4">
          {title}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1">
              Vague Starting Prompt
            </span>
            <p className="text-sm italic text-text-primary">"{description}"</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1">
              Final Spec Deliverables
            </span>
            <p className="text-sm text-text-primary">{badge}</p>
          </div>
        </div>
      </div>

      {/* Accordion Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-bg-secondary border border-border-primary hover:bg-[#f1f5f9] transition-colors cursor-pointer rounded-b-xl"
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          ...(isExpanded
            ? {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderBottom: "none",
              }
            : {}),
        }}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2 font-mono text-sm text-text-primary font-semibold">
          <FileText size={18} className="text-accent" />
          <span>examples/{activeFilePath}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
          Load Specification
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>

      {/* Content Area */}
      {isExpanded && (
        <div className="border border-border-primary border-t-0 rounded-b-xl overflow-hidden bg-bg-primary flex flex-col">
          {/* Tabs (if multiple files) */}
          {filePaths.length > 1 && (
            <div
              className="flex overflow-x-auto bg-[#1e293b] border-b border-[#334155]"
              role="tablist"
            >
              {filePaths.map((fp, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2.5 text-sm font-mono whitespace-nowrap border-r border-[#334155] transition-colors ${activeTab === idx ? "bg-[#0f172a] text-accent font-semibold border-t-2 border-t-accent" : "text-slate-400 hover:text-slate-200 hover:bg-[#0f172a]/50 border-t-2 border-t-transparent"}`}
                  role="tab"
                  aria-selected={activeTab === idx}
                >
                  {fp.label}
                </button>
              ))}
            </div>
          )}

          {/* Markdown Viewer */}
          <div className="p-6 overflow-y-auto max-h-[600px] bg-bg-primary text-text-primary prose prose-slate max-w-none text-[15px] leading-relaxed relative">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-text-secondary gap-3">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium text-sm">
                  Fetching specification from local repository...
                </span>
              </div>
            )}

            {!isLoading && error && (
              <div className="bg-danger-bg border border-danger-border p-5 rounded-lg flex flex-col gap-3">
                <h4 className="m-0 text-danger-primary flex items-center gap-2 text-base font-bold">
                  <AlertCircle size={20} />
                  Unable to Load Specification Content
                </h4>
                <p className="m-0 text-danger-primary/80 text-sm">
                  We encountered an issue fetching the example specification
                  file from the local repository directory (
                  <code>{localSpecPath}</code>).
                </p>
                <p className="m-0 text-danger-primary/70 text-xs">
                  Technical details: {error}
                </p>
                <a
                  href={githubFallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-danger-primary font-semibold text-sm hover:underline"
                >
                  View the raw file directly on GitHub{" "}
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {!isLoading && !error && (
              <div
                dangerouslySetInnerHTML={getHtmlContent()}
                className="spec-viewer"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

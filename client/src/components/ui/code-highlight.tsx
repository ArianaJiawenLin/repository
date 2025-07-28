import { useEffect, useRef } from "react";

interface CodeHighlightProps {
  code: string;
  language: string;
}

export default function CodeHighlight({ code, language }: CodeHighlightProps) {
  const codeRef = useRef<HTMLPreElement>(null);

  // Simple syntax highlighting for SPARQL and basic languages
  const highlightCode = (code: string, lang: string) => {
    if (lang === "sparql") {
      return code
        .replace(/(PREFIX|SELECT|WHERE|FILTER)/g, '<span class="text-purple-400">$1</span>')
        .replace(/([a-zA-Z]+:)/g, '<span class="text-blue-400">$1</span>')
        .replace(/(&lt;[^&]+&gt;)/g, '<span class="text-yellow-300">$1</span>')
        .replace(/(#[^\n]*)/g, '<span class="text-green-400">$1</span>')
        .replace(/(\?[a-zA-Z]+)/g, '<span class="text-blue-400">$1</span>')
        .replace(/(rdf:type|ui:hasPosition|robot:canPerform|geo:location)/g, '<span class="text-orange-400">$1</span>');
    }
    
    if (lang === "python") {
      return code
        .replace(/(def|class|import|from|return|if|else|elif|for|while|try|except|with)/g, '<span class="text-purple-400">$1</span>')
        .replace(/(#[^\n]*)/g, '<span class="text-green-400">$1</span>')
        .replace(/(".*?"|'.*?')/g, '<span class="text-yellow-300">$1</span>');
    }
    
    return code;
  };

  const highlightedCode = highlightCode(
    code.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
    language
  );

  return (
    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
      <pre ref={codeRef} className="text-slate-300 whitespace-pre-wrap">
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
}

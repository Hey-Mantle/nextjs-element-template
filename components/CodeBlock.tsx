"use client";

import { Card } from "@heymantle/litho";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language?: string;
  children: React.ReactNode;
}

// Map common language aliases to Prism language names
const languageMap: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "tsx",
  json: "json",
};

export default function CodeBlock({ language = "typescript", children }: CodeBlockProps) {
  // Convert children to string (handles both string and React nodes)
  const codeString = typeof children === "string" ? children : String(children);
  
  // Normalize language name
  const normalizedLanguage = languageMap[language.toLowerCase()] || language.toLowerCase();

  return (
    <Card>
      <SyntaxHighlighter
        language={normalizedLanguage}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderRadius: "4px",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        showLineNumbers={false}
      >
        {codeString}
      </SyntaxHighlighter>
    </Card>
  );
}

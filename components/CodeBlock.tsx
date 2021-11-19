import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";

type CodeBlockProps = {
  language?: string;
  className?: string;
  children: React.ReactNode;
};

export function CodeBlock({
  language = "javascript",
  className = "",
  children,
}: CodeBlockProps) {
  return (
    <SyntaxHighlighter className={className} language={language} style={style}>
      {children}
    </SyntaxHighlighter>
  );
}

const style = {
  "hljs-comment": {
    color: "#006d5b",
  },
  "hljs-string": {
    color: "#4cc38a",
  },
  "hljs-keyword": {
    color: "#30a46c",
  },
  hljs: {
    display: "block",
    overflowX: "auto",
    color: "#e7fcf7",
    fontSize: "14px",
    lineHeight: 1.4,
    padding: "16px",
  },
  "hljs-emphasis": {
    fontStyle: "italic",
  },
  "hljs-strong": {
    fontWeight: "bold",
  },
};

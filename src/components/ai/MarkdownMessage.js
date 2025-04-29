import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { FiCopy, FiCheck } from "react-icons/fi";
import "highlight.js/styles/base16/tomorrow-night.css";

import "./MarkdownMessage.css";

const MarkdownMessage = ({ content }) => {
  const [copied, setCopied] = useState(false);
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          const handleCopy = () => {
            navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          };

          return !inline && match ? (
            <div className="code-block-wrapper">
              <div className="code-toolbar">
                <span className="language-label">{match[1]}</span>
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <FiCheck style={{ marginRight: "5px" }} /> Copied
                    </>
                  ) : (
                    <>
                      <FiCopy style={{ marginRight: "5px" }} /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className={`hljs ${className}`} {...props}>
                <code>{codeString}</code>
              </pre>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default MarkdownMessage;

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { User, ChevronDown, ChevronRight, Loader2, Check, AlertCircle } from "lucide-react";
import LogoMark from "./LogoMark";

function FunctionDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const status = toolCall.status || "";
  const isPending = ["pending", "running", "in_progress"].includes(status);
  const isFailed = ["failed", "error"].includes(status);

  let parsedResults = toolCall.results;
  try {
    if (typeof toolCall.results === "string") parsedResults = JSON.parse(toolCall.results);
  } catch (e) {
    /* keep raw */
  }

  const dp = toolCall.display_projection || {};
  const hideDetails = dp.hide_details && dp.details_redacted;
  const label = isFailed
    ? dp.error_label || "Failed"
    : isPending
    ? dp.active_label || "Working…"
    : dp.label || "Completed";
  const toolName = (toolCall.name || "tool").replace(/_/g, " ");
  const StatusIcon = isFailed ? AlertCircle : isPending ? Loader2 : Check;

  return (
    <div className="mt-2.5 text-xs">
      <button
        onClick={() => !hideDetails && setExpanded(!expanded)}
        disabled={hideDetails}
        className="flex items-center gap-2 px-2.5 py-1.5 bg-secondary rounded-lg text-ink/60 hover:text-ink transition-colors"
      >
        {!hideDetails && (expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
        <StatusIcon
          className={`w-3 h-3 ${isPending ? "animate-spin" : ""} ${isFailed ? "text-red-500" : "text-sage"}`}
        />
        <span className="capitalize">{toolName}</span>
        <span className="text-ink/40">· {label}</span>
      </button>
      {expanded && !hideDetails && (
        <div className="mt-1.5 ml-5 space-y-1.5">
          {toolCall.arguments_string && (
            <div>
              <p className="text-ink/40 uppercase tracking-wider text-[10px] mb-0.5">Parameters</p>
              <pre className="bg-secondary p-2 rounded-lg overflow-x-auto text-[11px] text-ink/70 whitespace-pre-wrap break-words">
                {toolCall.arguments_string}
              </pre>
            </div>
          )}
          {parsedResults != null && (
            <div>
              <p className="text-ink/40 uppercase tracking-wider text-[10px] mb-0.5">Result</p>
              <pre className="bg-secondary p-2 rounded-lg overflow-x-auto text-[11px] text-ink/70 whitespace-pre-wrap break-words">
                {typeof parsedResults === "string" ? parsedResults : JSON.stringify(parsedResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdvisorMessageBubble({ message }) {
  const navigate = useNavigate();
  const isUser = message.role === "user";

  const Avatar = () =>
    isUser ? (
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ink/10 flex items-center justify-center mt-1">
        <User className="w-4 h-4 text-ink" />
      </div>
    ) : (
      <LogoMark size={32} className="mt-1" />
    );

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar />}
      <div className="max-w-[80%]">
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser ? "bg-ink text-white rounded-tr-sm" : "bg-white border border-border text-ink rounded-tl-sm"
          }`}
        >
          {message.content &&
            (isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="text-sm leading-relaxed text-ink/80">
                <ReactMarkdown
                  components={{
                    a: ({ node, href, ...props }) => (
                      <a
                        {...props}
                        href={href}
                        onClick={(e) => {
                          if (href && href.startsWith("/")) {
                            e.preventDefault();
                            navigate(href);
                          }
                        }}
                        className="text-sage font-medium hover:underline"
                      />
                    ),
                    p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                    ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />,
                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />,
                    li: ({ node, ...props }) => <li {...props} className="leading-relaxed" />,
                    strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-ink" />,
                    h3: ({ node, ...props }) => <h3 {...props} className="font-display text-base text-ink mt-3 mb-1" />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ))}
          {message.tool_calls?.map((tc, idx) => (
            <FunctionDisplay key={idx} toolCall={tc} />
          ))}
        </div>
      </div>
      {isUser && <Avatar />}
    </div>
  );
}
import React from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { User, Loader2 } from "lucide-react";
import LogoMark from "./LogoMark";

// Tool calls are internal to the agent. We only show a subtle "working" indicator
// while a call is in flight; completed/failed calls are hidden from the user.
function ToolCallIndicator({ toolCall }) {
  const status = toolCall.status || "";
  const isPending = ["pending", "running", "in_progress"].includes(status);
  if (!isPending) return null;
  return (
    <div className="mt-2.5 text-xs flex items-center gap-2 text-ink/40">
      <Loader2 className="w-3 h-3 animate-spin text-sage" />
      <span>Searching the catalog…</span>
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
    <div className={`flex gap-2 md:gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar />}
      <div className="max-w-[85%] md:max-w-[80%]">
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
            <ToolCallIndicator key={idx} toolCall={tc} />
          ))}
        </div>
      </div>
      {isUser && <Avatar />}
    </div>
  );
}
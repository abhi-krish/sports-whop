"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";

export function ChatInterface() {
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const exampleQueries = [
    { text: "Today's NBA games" },
    { text: "NFL standings" },
    { text: "MLB scores" },
    { text: "NHL injury report" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage({ text: message });
  };

  const handleExampleClick = async (query: string) => {
    if (isLoading) return;
    setInput("");
    await sendMessage({ text: query });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-1">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-a3 bg-gray-2">
        <img
          src="/statline-icon.png"
          alt="StatLine"
          className="w-10 h-10 rounded-xl shadow-lg"
        />
        <div>
          <h1 className="text-base font-semibold text-gray-12">StatLine</h1>
          <p className="text-xs text-gray-10">Live sports data</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12">
            <img
              src="/statline-icon.png"
              alt="StatLine"
              className="w-16 h-16 rounded-2xl shadow-xl mb-6"
            />
            <h2 className="text-xl font-semibold text-gray-12 mb-2">
              What do you want to know?
            </h2>
            <p className="text-sm text-gray-10 mb-8 text-center max-w-md">
              Real-time scores, stats, standings, and injury reports
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {exampleQueries.map((query) => (
                <button
                  key={query.text}
                  type="button"
                  onClick={() => handleExampleClick(query.text)}
                  disabled={isLoading}
                  className="px-4 py-3 bg-gray-3 hover:bg-gray-4 border border-gray-a3 rounded-xl text-left transition-all disabled:opacity-50 group"
                >
                  <span className="text-sm text-gray-11 group-hover:text-gray-12">
                    {query.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-emerald-600 text-white rounded-2xl rounded-br-md px-4 py-3">
                      <p className="text-sm">
                        {message.parts?.map((part, i) =>
                          part.type === "text" ? (
                            <span key={i}>{part.text}</span>
                          ) : null
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <img
                      src="/statline-icon.png"
                      alt="StatLine"
                      className="w-8 h-8 rounded-lg flex-shrink-0 shadow"
                    />
                    <div className="flex-1 bg-gray-3 border border-gray-a3 rounded-2xl rounded-tl-md px-4 py-3 overflow-x-auto">
                      <div className="text-sm text-gray-12 prose prose-sm prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0 prose-headings:my-3 prose-pre:bg-gray-2 prose-pre:border prose-pre:border-gray-a3">
                        {message.parts?.map((part, i) =>
                          part.type === "text" ? (
                            <span key={i} className="whitespace-pre-wrap">
                              {part.text}
                            </span>
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <img
                  src="/statline-icon.png"
                  alt="StatLine"
                  className="w-8 h-8 rounded-lg flex-shrink-0 shadow"
                />
                <div className="bg-gray-3 border border-gray-a3 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                    <span className="text-xs text-gray-10">Searching...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error.message || "Something went wrong"}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-a3 bg-gray-2 p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about scores, stats, standings..."
            className="flex-1 px-4 py-3 bg-gray-3 border border-gray-a4 rounded-xl text-sm text-gray-12 placeholder-gray-9 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-4 disabled:text-gray-8 text-white rounded-xl font-medium transition-all text-sm shadow-lg shadow-emerald-500/20 disabled:shadow-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </span>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

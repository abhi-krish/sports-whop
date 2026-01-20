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
    "What are today's NBA games?",
    "Show me the NFL standings",
    "Latest MLB trade rumors",
    "NHL injury reports",
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
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-a4">
        <h1 className="text-6 font-bold text-gray-12">Sports Analytics Bot</h1>
        <p className="text-3 text-gray-10">
          Real-time sports data for NFL, NBA, MLB, NHL, and MLS
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6 font-semibold text-gray-11 mb-2">
              Ask me anything about sports
            </div>
            <p className="text-3 text-gray-9 mb-6">
              I can fetch real-time scores, stats, standings, injury reports,
              and more.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {exampleQueries.map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => handleExampleClick(query)}
                  disabled={isLoading}
                  className="px-3 py-2 text-3 bg-gray-a3 hover:bg-gray-a4 rounded-lg text-gray-11 transition-colors disabled:opacity-50"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-a3 text-gray-12"
              }`}
            >
              <div className="text-3 whitespace-pre-wrap leading-relaxed">
                {message.parts?.map((part, i) => {
                  if (part.type === "text") {
                    return <span key={i}>{part.text}</span>;
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-a3 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-gray-10">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-8 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-gray-8 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-8 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-3">Searching for latest data...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-3">
              Error: {error.message || "Something went wrong"}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-a4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about scores, stats, standings, injuries..."
            className="flex-1 px-4 py-3 bg-gray-a2 border border-gray-a4 rounded-xl text-gray-12 placeholder-gray-8 focus:outline-none focus:border-gray-a6 text-3"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-a4 disabled:text-gray-8 text-white rounded-xl font-medium transition-colors text-3"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

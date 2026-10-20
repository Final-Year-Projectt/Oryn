
import { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  UserRound,
  Lightbulb,
  TrendingUp,
  Package,
  Users,
  RotateCcw,
} from "lucide-react";

const suggestions = [
  {
    icon: TrendingUp,
    title: "Improve sales",
    prompt: "How can I identify problems affecting my sales?",
  },
  {
    icon: Package,
    title: "Reduce inventory costs",
    prompt: "How can I reduce inventory holding costs?",
  },
  {
    icon: Users,
    title: "Customer retention",
    prompt: "How can I improve my customer retention rate?",
  },
];

const welcomeMessage = {
  role: "assistant",
  text: "Hi! I'm ORYN AI Assistant. I can help you explore business problems and understand possible solutions. What would you like to investigate today?",
};

export default function AIAssistant() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");

  const sendMessage = (text = input) => {
    const question = text.trim();

    if (!question) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
      {
        role: "assistant",
        text: "Your question has been added to this demo conversation. Connect the ORYN AI backend to generate an actual business-specific answer.",
      },
    ]);

    setInput("");
  };

  const resetChat = () => {
    setMessages([welcomeMessage]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#F3F7F4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0D9488]">
          Workspace / AI Tools
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#19382F] sm:text-3xl">
              AI Assistant
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Explore business questions and potential solutions.
            </p>
          </div>

          <button
            type="button"
            onClick={resetChat}
            className="flex w-fit items-center gap-2 rounded-xl border border-[#D8E5DC] bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            New Conversation
          </button>
        </div>

        <div className="mt-7 overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E2ECE6] px-5 py-4 sm:px-6">
            <div className="rounded-xl bg-[#E1F5EB] p-3 text-[#16866B]">
              <Bot size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-[#19382F]">
                ORYN Business Assistant
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Demo mode · AI backend not connected
              </p>
            </div>

            <Sparkles size={20} className="text-[#0D9488]" />
          </div>

          <div className="flex min-h-[420px] flex-col gap-5 bg-[#FAFCFA] p-4 sm:p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  "flex items-start gap-3 " +
                  (message.role === "user" ? "flex-row-reverse" : "")
                }
              >
                <div
                  className={
                    "shrink-0 rounded-xl p-2.5 " +
                    (message.role === "user"
                      ? "bg-[#285C49] text-white"
                      : "bg-[#E1F5EB] text-[#16866B]")
                  }
                >
                  {message.role === "user" ? (
                    <UserRound size={19} />
                  ) : (
                    <Bot size={19} />
                  )}
                </div>

                <div
                  className={
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] " +
                    (message.role === "user"
                      ? "rounded-tr-sm bg-[#285C49] text-white"
                      : "rounded-tl-sm border border-[#E2ECE6] bg-white text-gray-600")
                  }
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="border-t border-[#E2ECE6] px-4 py-5 sm:px-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#19382F]">
                <Lightbulb size={17} className="text-[#0D9488]" />
                Try asking
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {suggestions.map(({ icon: Icon, title, prompt }) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="flex items-start gap-3 rounded-xl border border-[#E2ECE6] p-3 text-left transition hover:border-[#B8D9C8] hover:bg-[#F5FBF7]"
                  >
                    <Icon
                      size={19}
                      className="mt-0.5 shrink-0 text-[#16866B]"
                    />
                    <span>
                      <span className="block text-sm font-medium text-[#19382F]">
                        {title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        {prompt}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="border-t border-[#E2ECE6] bg-white p-4 sm:p-5"
          >
            <div className="flex items-end gap-3 rounded-xl border border-[#D8E5DC] bg-[#FAFCFA] p-2 focus-within:border-[#16866B]">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                placeholder="Ask about your business problems..."
                className="max-h-32 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="rounded-lg bg-[#285C49] p-3 text-white transition hover:bg-[#1E4939] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={18} />
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-gray-400">
              Demo responses only. Verify business decisions with actual data.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

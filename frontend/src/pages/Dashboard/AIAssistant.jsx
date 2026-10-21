
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GiKnockedOutStars } from "react-icons/gi";
import {
  Bot,
  MessageCircle,
  X,
  Minus,
  Send,
  UserRound,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Package,
  Users,
  Megaphone,
} from "lucide-react";

const welcomeMessage = {
  id: "oryn-welcome",
  role: "assistant",
  kind: "welcome",
  text: "Hi! I'm ORYN AI.",
  detail:
    "Ask about sales, inventory, customer retention, or marketing. I'll help you explore possible causes and practical next steps.",
};

const suggestedPrompts = [
  {
    icon: TrendingUp,
    title: "Sales decline",
    prompt: "How can I investigate a decline in sales?",
  },
  {
    icon: Package,
    title: "Inventory costs",
    prompt: "How can I reduce inventory holding costs?",
  },
  {
    icon: Users,
    title: "Customer retention",
    prompt: "How can I improve customer retention?",
  },
  {
    icon: Megaphone,
    title: "Marketing ROI",
    prompt: "How can I investigate low marketing campaign ROI?",
  },
];

function buildReply(question) {
  const q = question.toLowerCase();

  if (
    ["sales", "revenue", "orders", "decline", "declining"].some((word) =>
      q.includes(word)
    )
  ) {
    return {
      title: "Investigate the sales trend",
      summary:
        "First identify when and where sales declined. Compare relevant metrics before assuming a cause.",
      steps: [
        "Compare recent sales with a suitable historical baseline.",
        "Break results down by product, region, channel, and customer segment.",
        "Review order volume, average order value, discounts, and stock availability.",
      ],
      data: "Date, revenue, order count, product, region, channel, and discounts.",
    };
  }

  if (
    ["inventory", "stock", "warehouse", "holding cost", "sku"].some((word) =>
      q.includes(word)
    )
  ) {
    return {
      title: "Review inventory efficiency",
      summary:
        "Inventory costs should be assessed alongside demand, stock age, and replenishment patterns.",
      steps: [
        "Identify products with high stock and low recent sales.",
        "Compare stock on hand with demand and supplier lead times.",
        "Review purchasing, replenishment, and stock transfer options.",
      ],
      data: "Product/SKU, stock quantity, unit cost, sales by period, and supplier lead time.",
    };
  }

  if (
    ["customer", "retention", "churn", "loyalty", "repeat purchase"].some(
      (word) => q.includes(word)
    )
  ) {
    return {
      title: "Understand customer retention",
      summary:
        "Identify which customer groups stopped returning and when the change started.",
      steps: [
        "Compare repeat purchase rates across consistent time periods.",
        "Segment customers by recency, frequency, and purchase value.",
        "Check service issues, product availability, and campaign changes.",
      ],
      data: "Customer ID, order date, order value, product category, and segment.",
    };
  }

  if (
    ["marketing", "campaign", "roi", "advertising", "conversion", "cac"].some(
      (word) => q.includes(word)
    )
  ) {
    return {
      title: "Investigate marketing performance",
      summary:
        "Compare campaign spending with conversions and revenue before changing budgets.",
      steps: [
        "Compare spend, clicks, conversions, and revenue by channel.",
        "Check attribution windows and tracking data quality.",
        "Identify underperforming campaigns and customer segments.",
      ],
      data: "Campaign, channel, spend, impressions, clicks, conversions, and revenue.",
    };
  }

  return {
    title: "Turn your question into an investigation",
    summary:
      "Define the business outcome you want to improve, then investigate the relevant metrics and possible contributing factors.",
    steps: [
      "Define the metric, target, and time period.",
      "Compare results across relevant products, regions, or customer groups.",
      "Validate data quality before deciding on corrective action.",
    ],
    data: "Relevant dates, business metrics, and category or segment fields.",
  };
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, isOpen, isMinimized]);

  const sendMessage = (value = input) => {
    const question = value.trim();
    if (!question) return;

    const timestamp = Date.now();

    const userMessage = {
      id: `user-${timestamp}`,
      role: "user",
      text: question,
    };

    const assistantMessage = {
      id: `assistant-${timestamp}`,
      role: "assistant",
      ...buildReply(question),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  };

  const resetChat = () => {
    setMessages([welcomeMessage]);
    setInput("");
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="ORYN AI Assistant"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={`fixed z-[70] flex flex-col overflow-hidden border border-[#DFEBE5] bg-white shadow-[0_20px_60px_-20px_rgba(19,64,53,0.3)] ${
              isMinimized
                ? "right-4 bottom-[88px] h-[60px] w-[min(370px,calc(100vw-2rem))] rounded-2xl"
                : "inset-x-3 top-3 bottom-[88px] rounded-2xl sm:inset-x-auto sm:top-auto sm:right-5 sm:bottom-[88px] sm:h-[min(600px,calc(100vh-7.5rem))] sm:w-[370px] sm:rounded-3xl"
            }`}
          >
            {/* Compact header */}
            <header className="flex h-[60px] shrink-0 items-center gap-2.5 border-b border-[#E8EFEB] bg-white px-3">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E1F5EB] text-[#0D9488]">
                <GiKnockedOutStars size={23} />
                <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  className="truncate text-[#19382F]"
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: "19px",
                    fontWeight: 700,
                  }}
                >
                  ORYN AI Assistant
                </h2>
                <p
                  className="truncate text-[#0D9488]"
                  style={{
                    margin: 0,
                    fontSize: "10px",
                    lineHeight: "14px",
                  }}
                >
                  Business copilot · Demo mode
                </p>
              </div>

              <button
                type="button"
                onClick={resetChat}
                title="New conversation"
                aria-label="New conversation"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#EAF7F3] hover:text-[#0D9488]"
              >
                <RotateCcw size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized((previous) => !previous)}
                title={isMinimized ? "Expand chat" : "Minimize chat"}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#EAF7F3] hover:text-[#0D9488]"
              >
                {isMinimized ? (
                  <MessageCircle size={17} />
                ) : (
                  <Minus size={17} />
                )}
              </button>

              <button
                type="button"
                onClick={closeChat}
                title="Close chat"
                aria-label="Close chat"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <X size={17} />
              </button>
            </header>

            {!isMinimized && (
              <>
                {/* Scrollable conversation area */}
                <div className="min-h-0 flex-1 overflow-y-auto bg-[#F6FAF8] px-3 py-4 sm:px-4">
                  <div className="space-y-4">
                    {messages.map((message) =>
                      message.role === "user" ? (
                        <div
                          key={message.id}
                          className="flex items-start justify-end gap-2"
                        >
                          <div className="max-w-[84%] break-words rounded-2xl rounded-tr-sm bg-[#176F66] px-3.5 py-2.5 text-[13px] leading-5 text-white">
                            {message.text}
                          </div>

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#DDF7EA] text-[#176F66]">
                            <UserRound size={16} />
                          </div>
                        </div>
                      ) : (
                        <div
                          key={message.id}
                          className="flex items-start gap-2"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#DCEBE4] bg-white text-[#0D9488]">
                            <Bot size={16} />
                          </div>

                          <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-[#E2ECE6] bg-white p-3.5 shadow-sm">
                            {message.kind === "welcome" ? (
                              <>
                                <p className="text-[13px] font-semibold leading-5 text-[#19382F]">
                                  {message.text}
                                </p>

                                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                                  {message.detail}
                                </p>

                                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#0D9488]">
                                  <Sparkles size={13} />
                                  Business-focused guidance
                                </p>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-800">
                                  Demo response
                                </span>

                                <h3 className="mt-2 text-[13px] font-bold leading-5 text-slate-900">
                                  {message.title}
                                </h3>

                                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                                  {message.summary}
                                </p>

                                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-teal-800">
                                  Suggested checks
                                </p>

                                <ol className="mt-2 space-y-2.5">
                                  {message.steps.map((step, index) => (
                                    <li
                                      key={`${message.id}-${index}`}
                                      className="flex items-start gap-2 text-xs leading-5 text-slate-600"
                                    >
                                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal-800">
                                        {index + 1}
                                      </span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>

                                <div className="mt-3 rounded-xl bg-[#F2FAF7] p-2.5">
                                  <p className="text-[10px] font-bold text-slate-800">
                                    Helpful data to review
                                  </p>
                                  <p className="mt-1 break-words text-[11px] leading-5 text-slate-600">
                                    {message.data}
                                  </p>
                                </div>

                                <p className="mt-2 text-[10px] leading-4 text-slate-400">
                                  Example guidance only. This isn't a live
                                  analysis of uploaded data.
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      )
                    )}

                    {/* Suggested prompts before the first question */}
                    {messages.length === 1 && (
                      <div className="pl-10">
                        <p className="mb-2 text-[11px] font-semibold text-slate-600">
                          Try asking about
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {suggestedPrompts.map((item) => {
                            const Icon = item.icon;

                            return (
                              <button
                                key={item.title}
                                type="button"
                                onClick={() => sendMessage(item.prompt)}
                                className="inline-flex max-w-full items-center gap-1.5 rounded-xl border border-[#DCEBE4] bg-white px-2.5 py-2 text-left text-[11px] font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/30"
                              >
                                <Icon size={13} className="shrink-0" />
                                {item.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Fixed composer */}
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage();
                  }}
                  className="shrink-0 border-t border-[#E2ECE6] bg-white p-3"
                >
                  <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-[#FBFDFC] p-2 transition focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-600/10">
                    <label
                      htmlFor="oryn-floating-message"
                      className="sr-only"
                    >
                      Ask ORYN a business question
                    </label>

                    <textarea
                      ref={textareaRef}
                      id="oryn-floating-message"
                      rows={1}
                      maxLength={1200}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          !event.shiftKey &&
                          !event.nativeEvent.isComposing
                        ) {
                          event.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Ask ORYN something..."
                      className="max-h-24 min-h-10 min-w-0 flex-1 resize-y bg-transparent px-2 py-2 text-[13px] leading-5 text-slate-700 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="submit"
                      disabled={!input.trim()}
                      aria-label="Send message"
                      className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0D9488] text-white transition hover:bg-[#0B7F75] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      <Send size={15} />
                    </button>
                  </div>

                  <p className="mt-2 text-center text-[10px] leading-4 text-slate-400">
                    Demo guidance · Enter to send
                  </p>
                </form>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating launcher */}
      {!isOpen && (
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open ORYN AI chat"
          title="Chat with ORYN AI"
          className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#0D9488] text-white shadow-[0_12px_30px_-8px_rgba(13,148,136,0.6)] transition hover:bg-[#0B7F75] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/30"
        >
          <MessageCircle size={24} />
        </motion.button>
      )}
    </>
  );
}

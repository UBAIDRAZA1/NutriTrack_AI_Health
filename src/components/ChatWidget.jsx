import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (!apiKey) throw new Error("Missing Gemini API key");

      // Updated model (Gemini 2.5 Flash)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are NutriTrack, an AI health assistant. Reply to this user query in a friendly and informative way about diet, calories, or nutrition: "${input}"`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log("🧠 Gemini API response:", data);

      const botResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No valid response from NutriTrack AI.";

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (err) {
      console.error("❌ ChatWidget error:", err);
      const fallback =
        "Error: Could not connect to NutriTrack AI. (Check API key or network)";
      setMessages((prev) => [...prev, { sender: "bot", text: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-full max-w-[90vw] h-[60vh] sm:w-80 sm:h-96 bg-white shadow-xl rounded-xl p-3 sm:p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-emerald-700">
              NutriTrack AI Chat
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-emerald-700"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-2 px-2 sm:px-3">
            {messages.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                Ask about calories, diet plans, or nutrition tips!
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 text-sm ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <span className="mr-1">
                    {msg.sender === "user" ? "🧍‍♀️" : "🤖"}
                  </span>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left text-sm">
                <div className="inline-block p-2 rounded-lg bg-gray-100 text-gray-800 max-w-[80%]">
                  🤖 Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ask about nutrition or meal plans..."
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-emerald-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
        >
          💬
        </button>
      )}
    </div>
  );
}

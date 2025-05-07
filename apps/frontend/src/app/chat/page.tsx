"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { Send } from "lucide-react";
import { useSocket } from "../../helpers/SocketProvider";
import { useSearchParams } from "next/navigation";

const App = () => {
  const { sendMessage: socketSendMessage, messages: socketMessages } = useSocket();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [socketMessages]);

  const sendMessage = () => {
    if (input.trim()) {
      socketSendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 p-5">
      {/* Main Chat Area */}
      <div className="w-full max-w-4xl mx-auto flex flex-col bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
          <div>
            <h2 className="text-xl font-semibold text-white">Chat</h2>
          </div>
          <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            New Chat
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {socketMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md p-3 rounded-xl ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {msg}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Send />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense>
      <App />
    </Suspense>
  );
};

export default Page;
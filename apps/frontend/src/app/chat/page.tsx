// 'use client'
// import { useSocket } from '../../helpers/SocketProvider';
// import { useState } from 'react';
// import styles from '../../app/page.module.css'

// export default function Home() {
//   const { sendMessage, messages } = useSocket();
//   const [message, setMessage] = useState('');

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       console.log('Message to send:', message); // Debugging log
//       sendMessage(message);
//       setMessage(''); // Clear the input after sending the message
//     } else {
//       console.warn('Message is empty'); // Debugging log
//     }
//   };

//   return (
//     <div>
//       <div>
//         <input
//           type="text"
//           className={styles.chatInput}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button className={styles.button} onClick={handleSendMessage}>
//           Send Message
//         </button>
//       </div>
//       <div>
//         <ul>
//           {messages.map((e, index) => (
//             <li key={index}>{e}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { Video, Mic, User, Send } from "lucide-react";
import { useSocket } from "../../helpers/SocketProvider";
import { useSearchParams } from "next/navigation";

const App = () => {
  const { sendMessage: socketSendMessage, messages: socketMessages } =
    useSocket();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  console.log("id: ", id);
  const [input, setInput] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
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
      {/* Left Partition */}
      <div className="flex flex-col w-1/3 border-r border-gray-700">
        {/* User Window */}
        <div className="flex flex-col flex-1 border-b border-gray-700 p-4 bg-gray-800">
          <div className="flex-1 flex items-center justify-center text-white border rounded-lg bg-gray-700">
            {isVideoCall ? (
              <div className="text-center">Video Call (User)</div>
            ) : (
              <User className="text-6xl text-gray-400" size={96} />
            )}
          </div>
          <div className="flex justify-around mt-4">
            <button className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Mic /> Voice Chat
            </button>
            <button
              className="flex items-center gap-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => setIsVideoCall(!isVideoCall)}
            >
              <Video /> {isVideoCall ? "End Video" : "Video Chat"}
            </button>
          </div>
        </div>

        {/* Remote User Window */}
        <div className="flex flex-col flex-1 p-4 bg-gray-800">
          <div className="flex-1 flex items-center justify-center text-white border rounded-lg bg-gray-700">
            {isVideoCall ? (
              <div className="text-center">Video Call (Remote User)</div>
            ) : (
              <User className="text-6xl text-gray-400" size={96} />
            )}
          </div>
          <div className="flex justify-around mt-4">
            <button className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Mic /> Voice Chat
            </button>
            <button
              className="flex items-center gap-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => setIsVideoCall(!isVideoCall)}
            >
              <Video /> {isVideoCall ? "End Video" : "Video Chat"}
            </button>
          </div>
          <button className="p-2 bg-red-600 text-white rounded-lg mt-4 hover:bg-red-700 transition-colors">
            Next Match
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center">
            <User className="text-4xl text-gray-400 mr-3" size={40} />
            <div>
              <h2 className="text-xl font-semibold text-white">Remote User</h2>
              <p className="text-sm text-gray-400">
                {isVideoCall ? "Video Call Active" : "Text Chat"}
              </p>
            </div>
          </div>
          <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            Next Match
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {socketMessages.map((msg:any, index) => (
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
    <Suspense >
      <App />
    </Suspense>
  )
}

export default Page;

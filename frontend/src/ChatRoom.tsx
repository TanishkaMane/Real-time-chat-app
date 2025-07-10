import "./ChatRoom.scss";
import React, { useEffect, useRef, useState } from "react";
import { ColorCodes } from "./constants";

interface Props {
  username: string;
}

interface ChatMessage {
  username: string;
  message: string;
  color?: string;
}

const ChatRoom: React.FC<Props> = ({ username }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [assignedColor, setAssignedColor] = useState<Record<string, string>>({});
  const [showInfoDropdown, setShowInfoDropdown] = useState<boolean>(false);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/ws");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📥 Received:", data);

      setMessages((prev) => [...prev, data]);
      setAssignedColor((prevColorMap) => {
        if (!(data.username in prevColorMap)) {
          const nextColor = ColorCodes[Object.keys(prevColorMap).length % ColorCodes.length]
          return {
            ...prevColorMap,
            [data.username]: nextColor
          };
        }
        return prevColorMap
      })
    };

    ws.current.onerror = (err) => {
      console.error("[Websocket error]:", err);
    };

    // return () => {
    //   ws.current?.close();
    // };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("Messafe", messages);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const msg: ChatMessage = {
      username,
      message: input.trim(),
    };

    ws.current?.send(JSON.stringify(msg));
    setInput("");
  };

  return (
    <div className="chat-room">
      <div className="title-container">
        <img src="./public/arrow_left.svg" alt="" />
        <span className="title">Chat Room </span>
        <img src="./public/ic_info.svg" alt="" />
      </div>
      <div className="messages">
        {messages.length === 0 ? (
          <p className="placeholder">No messages yet</p>
        ) : (
          messages.map((msg, idx) => {
            const prev = messages[idx - 1];

            return (
              <div
                ref={messagesEndRef}
                key={idx}
                className={`message-container ${
                  msg.username === username ? "own" : "sender"
                }`}
              >
                {msg.username !== username && prev.username != msg.username && (
                  <div className="username">{msg.username}</div>
                )}
                <div style={{backgroundColor: assignedColor[msg.username]}} className="message">{msg.message}</div>
              </div>
            );
          })
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;

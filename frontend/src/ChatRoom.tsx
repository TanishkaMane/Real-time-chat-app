import "./ChatRoom.scss";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  username: string;
}

interface ChatMessage {
  username: string;
  message: string;
}

const ChatRoom: React.FC<Props> = ({ username }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://10.14.159.4:8080/ws");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📥 Received:", data);
      setMessages((prev) => [...prev, data]);
    };

    ws.current.onerror = (err) => {
      console.error("[Websocket error]:", err);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
          <span className="title">Chat Room</span>
      </div>
      <div className="messages">
        {messages.length === 0 ? (
          <p className="placeholder">No messages yet</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message-container ${
                msg.username === username ? "own" : "sender"
              }`}
            >
              {msg.username !== username && (
                <div className="username">{msg.username}</div>
              ) }
              <div className="message">{msg.message}</div>l
            </div>
          ))
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

import React, { useState } from "react";

const TradeAIchatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "AI Bot", text: "Hello! I can help you trade." },
    { sender: "You", text: "Buy BTC at $50,000" },
    { sender: "AI Bot", text: "Order placed!" },
  ]);

  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim() !== "") {
      setMessages([...messages, { sender: "You", text: inputText }]);
      setInputText("");
    }
  };

  return (
    <div className="chat-bot">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === "You" ? "user-message" : "bot-message"
            }`}
          >
            <p>
              {message.sender}: {message.text}
            </p>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          style={{ background: "white" }}
          className="form-control"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <i className="bi bi-send send-icon" onClick={handleSend} />
      </div>
    </div>
  );
};

export default TradeAIchatbot;

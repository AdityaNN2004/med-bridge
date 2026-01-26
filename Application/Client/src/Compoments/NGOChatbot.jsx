import React, { useEffect, useState } from "react";
import { fetchMessages, sendMessage } from "../Services/ChatService";
import {
  chatContainer,
  messagesBox,
  inputBox,
  messageLeft,
  messageRight,
} from "./chatStyles";

const NGOChatbot = ({ ngoId, donarId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loadMessages = async () => {
    const res = await fetchMessages(ngoId, donarId);
    setMessages(res.data);
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({
      ngoId,
      donarId,
      senderType: "NGO",
      senderId: ngoId,
      message: text,
    });

    setText("");
    loadMessages();
  };

  return (
    <div style={chatContainer}>
      <div style={messagesBox}>
        {messages.map((msg) => (
          <div
            key={msg.messageId}
            style={msg.senderType === "NGO" ? messageRight : messageLeft}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <div style={inputBox}>
        <input
          style={{ flex: 1, padding: "10px" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default NGOChatbot;

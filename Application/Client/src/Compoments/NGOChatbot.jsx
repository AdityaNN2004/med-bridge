import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "./ReduxSliceCart";
import styles from "./chatStyles";

const donorId = "donor1";
const ngoId = "ngo1";

export default function NGOChatBot() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const messages = useSelector(
    state => state.chat.chats[`${ngoId}_${donorId}`] || []
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    dispatch(
      sendMessage({
        ngoId,
        donorId,
        sender: "ngo",
        message: text
      })
    );

    setText("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>🏥 NGO Chat</div>

      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={msg.sender === "ngo" ? styles.donorMsg : styles.ngoMsg}
          >
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a reply..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button style={styles.sendBtn} onClick={handleSend}>➤</button>
      </div>
    </div>
  );
}

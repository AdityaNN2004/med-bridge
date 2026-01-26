export const chatContainer = {
  width: "100%",
  maxWidth: "500px",
  height: "100%",
  border: "1px solid #ddd",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  fontSize: "13px",          // ✅ overall chat font smaller
};

export const messagesBox = {
  flex: 1,
  padding: "10px",
  overflowY: "auto",
  fontSize: "13px",          // ✅ message font size
};

export const inputBox = {
  display: "flex",
  borderTop: "1px solid #ddd",
  padding: "6px",            // slightly reduced
};

export const messageLeft = {
  background: "#f1f1f1",
  padding: "6px 10px",       // reduced padding
  borderRadius: "10px",
  marginBottom: "6px",
  maxWidth: "70%",
  wordBreak: "break-word",
  fontSize: "13px",          // ✅ left bubble text smaller
  lineHeight: "1.4",
};

export const messageRight = {
  background: "#dcf8c6",
  padding: "6px 10px",       // reduced padding
  borderRadius: "10px",
  marginBottom: "6px",
  maxWidth: "70%",
  marginLeft: "auto",
  wordBreak: "break-word",
  fontSize: "13px",          // ✅ right bubble text smaller
  lineHeight: "1.4",
};

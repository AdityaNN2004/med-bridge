const styles = {
  container: {
    width: "100%",
    maxWidth: "600px",
    height: "220px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    boxShadow: "0 10px 28px rgba(0,0,0,0.12)", // ✅ soft widget shadow
    overflow: "hidden",
    fontFamily: "Inter, system-ui, sans-serif"
  },

  header: {
    padding: "12px 14px",
    background: "#2563eb",
    color: "white",
    fontWeight: "600",
    fontSize: "14px"
  },

  subtitle: {
    fontSize: "11px",
    opacity: 0.9,
    marginTop: "2px"
  },

  messages: {
    flex: 1,
    padding: "14px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#f8fafc"
  },

  botMsg: {
    alignSelf: "flex-start",
    background: "#ffffff",
    padding: "10px 12px",
    borderRadius: "12px",
    maxWidth: "80%",
    fontSize: "13px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.08)"
  },

  userMsg: {
    alignSelf: "flex-end",
    background: "#2563eb",
    color: "white",
    padding: "10px 12px",
    borderRadius: "12px",
    maxWidth: "80%",
    fontSize: "13px"
  },

  inputBox: {
    display: "flex",
    gap: "8px",
    padding: "10px",
    background: "#ffffff",
    borderTop: "1px solid #e5e7eb"
  },

  input: {
    flex: 1,
    borderRadius: "999px",
    border: "1px solid #e5e7eb",
    padding: "10px 14px",
    fontSize: "13px",
    outline: "none"
  },

  sendBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "14px"
  }
};

export default styles;

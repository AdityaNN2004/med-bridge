import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

export const sendMessage = (payload) => {
  return API.post("/api/chats/send", payload);
};

export const fetchMessages = (ngoId, donarId) => {
  return API.get("/api/chats", {
    params: { ngoId, donarId },
  });
};

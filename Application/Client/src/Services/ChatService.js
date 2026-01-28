import axiosInstance from "../utils/axiosInstance ";

export const sendMessage = (payload) => {
  return axiosInstance.post("/api/chats/send", payload);
};

export const fetchMessages = (ngoId, donarId) => {
  return axiosInstance.get("/api/chats", {
    params: { ngoId, donarId },
  });
};

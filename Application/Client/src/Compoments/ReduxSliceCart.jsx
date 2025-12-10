import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: {
    // "ngo1_donor1": [
    //   { sender: "donor", message: "Hi NGO!" }
    // ]
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      const { ngoId, donorId, sender, message } = action.payload;
      const key = `${ngoId}_${donorId}`;

      if (!state.chats[key]) {
        state.chats[key] = [];
      }

      state.chats[key].push({
        sender,
        message
      });
    }
  }
});

export const { sendMessage } = chatSlice.actions;
export default chatSlice.reducer;

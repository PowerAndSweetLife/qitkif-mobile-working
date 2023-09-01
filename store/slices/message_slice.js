import {createSlice} from '@reduxjs/toolkit';

export const MessageSlice = createSlice({
  name: 'message',
  initialState: {
    contents: [],
  },
  reducers: {
    setContents: (state, action) => {
      state.contents = action.payload;
    },
    pushContent: (state, action) => {
      state.contents.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const {setContents, pushContent} = MessageSlice.actions;

export default MessageSlice.reducer;

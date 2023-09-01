import {createSlice} from '@reduxjs/toolkit';

export const UnreadSlice = createSlice({
  name: 'unread',
  initialState: {
    message: 0,
    notification: 0,
  },
  reducers: {
    setUnreadMessage: (state, action) => {
      state.message = action.payload;
    },
    setUnreadNotification: (state, action) => {
      state.notification = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUnreadMessage, setUnreadNotification} = UnreadSlice.actions;

export default UnreadSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

export const ScreenSlice = createSlice({
  name: 'screen',
  initialState: {
    message: false,
    notification: false,
    message_service_id: 0,
  },
  reducers: {
    setScreenMessage: (state, action) => {
      state.message = action.payload;
    },
    setScreenNotification: (state, action) => {
      state.notification = action.payload;
    },
    setMessageServiceId: (state, action) => {
      state.message_service_id = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setScreenMessage, setScreenNotification, setMessageServiceId} =
  ScreenSlice.actions;

export default ScreenSlice.reducer;

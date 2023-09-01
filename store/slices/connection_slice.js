import {createSlice} from '@reduxjs/toolkit';

export const ConnectionSlice = createSlice({
  name: 'connection',
  initialState: {
    socket: null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setSocket} = ConnectionSlice.actions;

export default ConnectionSlice.reducer;

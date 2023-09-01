import {createSlice} from '@reduxjs/toolkit';

export const LoginSlice = createSlice({
  name: 'login',
  initialState: {
    username: null,
    code: null,
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUsername, setCode} = LoginSlice.actions;

export default LoginSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

export const RegisterSlice = createSlice({
  name: 'register',
  initialState: {
    id: null,
  },
  reducers: {
    setIdRegister: (state, action) => {
      state.id = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setIdRegister} = RegisterSlice.actions;

export default RegisterSlice.reducer;

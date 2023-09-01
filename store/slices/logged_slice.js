import {createSlice} from '@reduxjs/toolkit';

export const LoggedSlice = createSlice({
  name: 'logged',
  initialState: {
    pseudo: null,
    id: null,
    numeros: [],
  },
  reducers: {
    setPseudo: (state, action) => {
      state.pseudo = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setNumeros: (state, action) => {
      state.numeros = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setPseudo, setId, setNumeros} = LoggedSlice.actions;

export default LoggedSlice.reducer;

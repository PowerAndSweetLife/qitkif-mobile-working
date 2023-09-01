import {createSlice} from '@reduxjs/toolkit';

export const AchatSlice = createSlice({
  name: 'achat',
  initialState: {
    user: {
      id: null,
      pseudo: null,
      email: null,
      phone: null,
      photo: null,
    },
    categorie: {
      id: null,
      nom: null,
      icon: null,
      type: null,
    },
    remise: null,
    nomObjet: null,
    message: null,
    montant: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setMontant: (state, action) => {
      state.montant = action.payload;
    },
    setCategorie: (state, action) => {
      state.categorie = action.payload;
    },
    setRemise: (state, action) => {
      state.remise = action.payload;
    },
    setNomObjet: (state, action) => {
      state.nomObjet = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUser,
  setMontant,
  setCategorie,
  setRemise,
  setNomObjet,
  setMessage,
} = AchatSlice.actions;

export default AchatSlice.reducer;

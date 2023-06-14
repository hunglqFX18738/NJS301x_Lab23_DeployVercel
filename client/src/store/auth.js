import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = { isAuthenticated: false, fullName: '' };

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    isAuth(state, action) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.fullName = action.payload.fullName;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

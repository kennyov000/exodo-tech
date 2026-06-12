import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  role: "student" | "teacher" | null;
  name: string | null;
}

const initialState: AuthState = { token: null, role: null, name: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; role: "student" | "teacher"; name: string }>) {
      state.token = action.payload.token;
      state.role  = action.payload.role;
      state.name  = action.payload.name;
    },
    logout(state) {
      state.token = null;
      state.role  = null;
      state.name  = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

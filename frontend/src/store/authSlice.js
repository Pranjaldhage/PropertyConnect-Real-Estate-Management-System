import { createSlice } from "@reduxjs/toolkit";

const tokenFromStorage = localStorage.getItem("token");
const userIdFromStorage = localStorage.getItem("userId");
const roleFromStorage = localStorage.getItem("role");

const savedCountFromStorage =
  Number(localStorage.getItem("savedCount")) || 0;

const initialState = {
  token: tokenFromStorage,

  user:
    tokenFromStorage && userIdFromStorage
      ? {
          id: Number(userIdFromStorage),
          role: roleFromStorage,
        }
      : null,

  // 🔥 mark loaded if token exists
  loaded: !!tokenFromStorage,

  // ADMIN UI STATE
  pendingCount: 0,

  // 💾 CART badge
  savedCount:
    roleFromStorage === "CUSTOMER"
      ? savedCountFromStorage
      : 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loaded = true;

      const { id, role } = action.payload.user;

      // 🔥 persist auth
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", id);
      localStorage.setItem("role", role);

      // 🔥 reset cart count if not customer
      if (role !== "CUSTOMER") {
        state.savedCount = 0;
        localStorage.removeItem("savedCount");
      }
    },

    setUser(state, action) {
      state.user = action.payload;
      state.loaded = true;

      const { id, role } = action.payload;

      localStorage.setItem("userId", id);
      localStorage.setItem("role", role);

      if (role !== "CUSTOMER") {
        state.savedCount = 0;
        localStorage.removeItem("savedCount");
      }
    },

    clearAuth(state) {
      state.token = null;
      state.user = null;
      state.loaded = true;

      state.pendingCount = 0;
      state.savedCount = 0;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("savedCount");
    },

    /* =========================
       ADMIN BADGE
    ========================= */

    setPendingCount(state, action) {
      state.pendingCount = action.payload;
    },

    decrementPendingCount(state) {
      if (state.pendingCount > 0) {
        state.pendingCount -= 1;
      }
    },

    /* =========================
       💾 CART BADGE
    ========================= */

    setSavedCount(state, action) {
      state.savedCount = action.payload;

      localStorage.setItem(
        "savedCount",
        String(action.payload)
      );
    },

    incrementSavedCount(state) {
      state.savedCount += 1;

      localStorage.setItem(
        "savedCount",
        String(state.savedCount)
      );
    },

    decrementSavedCount(state) {
      if (state.savedCount > 0) {
        state.savedCount -= 1;

        localStorage.setItem(
          "savedCount",
          String(state.savedCount)
        );
      }
    },
  },
});

/* ======================
   SELECTORS
====================== */

export const selectAuth = (state) => state.auth;

export const selectUser = (state) => state.auth.user;

export const selectRole = (state) =>
  state.auth.user?.role;

export const selectIsLoggedIn = (state) =>
  !!state.auth.token;

export const selectIsAdmin = (state) =>
  state.auth.user?.role === "ADMIN";

export const selectIsCustomer = (state) =>
  state.auth.user?.role === "CUSTOMER";

export const selectPendingCount = (state) =>
  state.auth.pendingCount;

export const selectSavedCount = (state) =>
  state.auth.savedCount;

export const {
  setAuth,
  setUser,
  clearAuth,

  setPendingCount,
  decrementPendingCount,

  setSavedCount,
  incrementSavedCount,
  decrementSavedCount,
} = authSlice.actions;

export default authSlice.reducer;

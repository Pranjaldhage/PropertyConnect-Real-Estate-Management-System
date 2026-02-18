import { createSlice } from "@reduxjs/toolkit";

/* ============================
   LOCAL STORAGE SAFE READ
============================ */

const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const tokenFromStorage = safeGet("token");
const userIdFromStorage = safeGet("userId");
const roleFromStorage = safeGet("role");

const savedCountFromStorage = Number(
  safeGet("savedCount")
) || 0;

const hasSession =
  !!tokenFromStorage &&
  !!userIdFromStorage &&
  !!roleFromStorage;

/* ============================
   INITIAL STATE
============================ */

const initialState = {
  token: hasSession ? tokenFromStorage : null,

  user: hasSession
    ? {
        id: Number(userIdFromStorage),
        role: roleFromStorage,
      }
    : null,

  // hydrated from storage, not validated yet
  loaded: true,

  // ADMIN badge
  pendingCount: 0,

  // CART badge
  savedCount:
    hasSession && roleFromStorage === "CUSTOMER"
      ? savedCountFromStorage
      : 0,

  // session meta
  logoutReason: null,
};

/* ============================
   SLICE
============================ */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      const { token, user } = action.payload || {};

      if (!token || !user) {
        return;
      }

      state.token = token;
      state.user = user;
      state.loaded = true;
      state.logoutReason = null;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);

      if (user.role !== "CUSTOMER") {
        state.savedCount = 0;
        localStorage.removeItem("savedCount");
      }
    },

    setUser(state, action) {
      const user = action.payload;

      if (!user) return;

      state.user = user;
      state.loaded = true;

      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);

      if (user.role !== "CUSTOMER") {
        state.savedCount = 0;
        localStorage.removeItem("savedCount");
      }
    },

    clearAuth(state, action) {
      state.token = null;
      state.user = null;
      state.pendingCount = 0;
      state.savedCount = 0;
      state.logoutReason =
        action?.payload?.reason || "manual";

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("savedCount");
    },

    /* =========================
       ADMIN BADGE
    ========================= */

    setPendingCount(state, action) {
      state.pendingCount = action.payload || 0;
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
      const value = Number(action.payload) || 0;
      state.savedCount = value;

      localStorage.setItem(
        "savedCount",
        String(value)
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

export const selectLogoutReason = (state) =>
  state.auth.logoutReason;

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

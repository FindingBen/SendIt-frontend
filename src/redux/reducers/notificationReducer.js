import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action) {
      const incoming = action.payload;

      // Prevent duplicates (critical for websocket reconnects)
      const exists = state.items.some(n => n.id === incoming.id);
      if (exists) return;

      state.items.unshift({
        ...incoming,
        read: false,
        createdAt: incoming.createdAt || new Date().toISOString(),
      });
    },

    markAsRead(state, action) {
      const id = action.payload;
      const notif = state.items.find(n => n.id === id);
      if (notif) notif.read = true;
    },

    markAllAsRead(state) {
      state.items.forEach(n => {
        n.read = true;
      });
    },

    removeNotification(state, action) {
      state.items = state.items.filter(n => n.id !== action.payload);
    },

    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

export const selectNotifications = state => state.notifications.items;

export const selectUnreadNotifications = state =>
  state.notifications.items.filter(n => !n.read);

export const selectUnreadCount = state =>
  state.notifications.items.filter(n => !n.read).length;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemsById: {},
  order: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    upsertNotification(state, action) {
  const notif = action.payload;
  if (!notif || !notif.id) {
    console.warn("Skipping invalid notification payload:", notif);
    return;
  }

  const id = notif.id;
  const exists = Boolean(state.itemsById && state.itemsById[id]);

  state.itemsById = state.itemsById || {}; // make sure itemsById exists

  state.itemsById[id] = {
    ...(state.itemsById[id] || {}), // default empty object
    ...notif,
  };

  if (!exists) {
    state.order = state.order || [];
    state.order.unshift(id);
  }
},


    upsertManyNotifications(state, action) {
      action.payload.forEach(notif => {
        const id = notif.id;
        const exists = Boolean(state.itemsById[id]);

        state.itemsById[id] = {
          ...state.itemsById[id],
          ...notif,
        };

        if (!exists) {
          state.order.push(id);
        }
      });

      // newest first
      state.order.sort(
        (a, b) =>
          new Date(state.itemsById[b].created_at) -
          new Date(state.itemsById[a].created_at)
      );
    },

    markAsRead(state, action) {
      const id = action.payload;
      if (state.itemsById[id]) {
        state.itemsById[id].read = true;
      }
    },

    markAllAsRead(state) {
      Object.values(state.itemsById).forEach(n => {
        n.read = true;
      });
    },

    clearNotifications(state) {
      state.itemsById = {};
      state.order = [];
    },
  },
});

export const {
  upsertNotification,
  upsertManyNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
export const selectNotifications = (state) => {
  const notifications = state.notifications;
  if (!notifications || !Array.isArray(notifications.order) || !notifications.itemsById) {
    return [];
  }

  return notifications.order
    .map(id => notifications.itemsById[id])
    .filter(Boolean);
};


export const selectUnreadNotifications = (state) =>
  selectNotifications(state).filter(n => !n.read);

export const selectUnreadCount = (state) =>
  selectUnreadNotifications(state).length;



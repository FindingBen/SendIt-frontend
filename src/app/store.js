import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import thunk from "redux-thunk";
import formReducer from "../features/modal/formReducer";
import modalReducer from "../features/modal/modalReducer";
import elementReducer from "../features/elements/elementReducer";
import editPageReducer from "../features/elements/editPageReducer";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  formState: formReducer,
  modalState: modalReducer,
  elementState: elementReducer,
  editPageState: editPageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, apiSlice.middleware],
  devTools: true,
});

export const persistor = persistStore(store);

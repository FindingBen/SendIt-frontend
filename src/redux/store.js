import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./reducers/authSlice";

import formReducer from "./reducers/formReducer";
import modalReducer from "./reducers/modalReducer";
import elementReducer from "./reducers/elementReducer";
import editPageReducer from "./reducers/editPageReducer";
import packageReducer from "./reducers/packageReducer";
import messageReducer from "./reducers/messageReducer";
import contactListReducer from "./reducers/contactListReducer";

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
  packageState: packageReducer,
  messages: messageReducer,
  contactLists: contactListReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: false,
});

export const persistor = persistStore(store);

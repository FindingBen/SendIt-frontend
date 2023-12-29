import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./reducers/authSlice";
import thunk from "redux-thunk";
import formReducer from "./reducers/formReducer";
import modalReducer from "./reducers/modalReducer";
import elementReducer from "./reducers/elementReducer";
import editPageReducer from "./reducers/editPageReducer";
import packageReducer from "./reducers/packageReducer";
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
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: false,
});

export const persistor = persistStore(store);

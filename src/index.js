import React from "react";
import ReactDOM from "react-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import { store, persistor } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { registerLicense } from "@syncfusion/ej2-base";
import App from "./App";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";


if (process.env.NODE_ENV === "production") disableReactDevTools();


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

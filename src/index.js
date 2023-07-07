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

registerLicense(
  "Mgo+DSMBaFt+QHJqVEZrXVNbdV5dVGpAd0N3RGlcdlR1fUUmHVdTRHRcQlpjT35bckdgXn1XdXU=;Mgo+DSMBPh8sVXJ1S0R+XVFPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXlTcEVrXX1dd3dURGE=;ORg4AjUWIQA/Gnt2VFhiQlBEfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5UdkNjUXtcc3NWRWNd;MjU1MDAxM0AzMjMxMmUzMDJlMzBZa2d2YkltZ2VBV2c1c2tKNlFCT1MvODFrZlBiYTV6b2MvRkROcnhLZHdjPQ==;MjU1MDAxNEAzMjMxMmUzMDJlMzBYUWtiQVJvb0FDVHk5azZ2bHdYQUpkc0J4cmhEQkg1T0NObldOOHZnSnJzPQ==;NRAiBiAaIQQuGjN/V0d+Xk9FdlRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TcUVlWXdacndSQmJZUA==;MjU1MDAxNkAzMjMxMmUzMDJlMzBXMmxJM05rS2ptWFhZS3FyZkRnSjBQL0xsb0lJam9sM0J5cGJXRVdVd1QwPQ==;MjU1MDAxN0AzMjMxMmUzMDJlMzBpWTNYN3NnYmF6RDNRUkdYZk5xRmFDdDl1YXEzTElhZUM5RFdicFhhRDE0PQ==;Mgo+DSMBMAY9C3t2VFhiQlBEfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5UdkNjUXtcc3NQRmVd;MjU1MDAxOUAzMjMxMmUzMDJlMzBMK2xyN1VoRXllMVNqVndDTGdkNGlVUy83QVZGMGNpV2VETlVwZkQrYkdnPQ==;MjU1MDAyMEAzMjMxMmUzMDJlMzBpc0dnNFBiNS9QeVk3Ym9wa0xXQzdBWjUvczliTjJMbS8wSHVCM1AwQW5BPQ==;MjU1MDAyMUAzMjMxMmUzMDJlMzBXMmxJM05rS2ptWFhZS3FyZkRnSjBQL0xsb0lJam9sM0J5cGJXRVdVd1QwPQ=="
);

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

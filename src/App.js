import "flowbite";
import { Route, Routes } from "react-router-dom";
import React from "react";
import ContactLists from "./pages/ContactLists";
import ContactList from "./pages/ContactList";
import CreateMessage from "./pages/CreateMessage";
import EditMessage from "./pages/EditMessage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import SmsEditor from "./pages/SmsEditor";
import { ElementProvider } from "./context/ElementContext";
import MessageView from "./pages/MessageView";
import UserPage from "./pages/UserPage";
import PasswordReset from "./utils/PasswordReset";
import PasswordResetConfirm from "./utils/PasswordResetConfirm";
import ReactGA from "react-ga";
import Plans from "./components/AccountSettings/Plans";
import ErrorPage from "./pages/ErrorPage";
import CampaignsStatsPage from "./pages/CampaignsStatsPage";
import SuccessPayment from "./pages/SuccessPayment";
import CancelPayment from "./pages/CancelPayment";
import AnalyticsPage from "./pages/AnalyticsPage";
import Archives from "./pages/Archives";
import DemoPage from "./pages/DemoPage";
import { AppProvider } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import createApp from "@shopify/app-bridge";
import PurchaseHistory from "./pages/PurchaseHistory";
import UnsubscribePage from "./pages/UnsubscribePage";
import ActivationEmailSuccess from "./pages/ActivationEmailSuccess";
import QRsignUpPage from "./pages/QRsignUpPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const TRACKING_ID = "G-FPHE42LL46";
ReactGA.initialize(TRACKING_ID);

const shopifyConfig = {
  apiKey: "YOUR_SHOPIFY_API_KEY",
  host: new URLSearchParams(window.location.search).get("host"), // Get shop info from URL
  forceRedirect: true, // Ensures redirection to Shopify
};

const app = createApp(shopifyConfig);

async function fetchSessionToken() {
  const token = await getSessionToken(app);
  console.log("Session Token:", token);
  return token;
}

function App() {
  return (
    <AppProvider config={shopifyConfig}>
      <section>
        <div className="main"></div>
        <Routes>
          <Route
            path="/register/qrr/:id"
            element={<QRsignUpPage></QRsignUpPage>}
          ></Route>
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy></PrivacyPolicy>}
          ></Route>
          <Route path="/view/:id" element={<MessageView></MessageView>}></Route>
          <Route
            path="/opt-out/:id"
            element={<UnsubscribePage></UnsubscribePage>}
          ></Route>
          <Route
            path="/activate_email/:token_id/:user_id/"
            element={<ActivationEmailSuccess></ActivationEmailSuccess>}
          ></Route>
          <Route path="/err/spp" element={<ErrorPage></ErrorPage>}></Route>
        </Routes>
        <div className="App">
          <ElementProvider>
            <Routes>
              <Route path="register" element={<DemoPage />} />
              {/* <Route path="register" element={<RegisterPage />} /> */}
              <Route path="login" element={<Login></Login>} />
              <Route
                path="reset_password"
                element={<PasswordReset></PasswordReset>}
              />

              <Route
                path="reset_password_confirm/:uid/:token"
                element={<PasswordResetConfirm></PasswordResetConfirm>}
              />
              <Route path="/" element={<Layout />}>
                <Route element={<PrivateRoute />}>
                  <Route path="analytics/:id" element={<AnalyticsPage />} />
                  <Route path="home" element={<HomePage />} />
                  <Route path="create_note" element={<CreateMessage />} />
                  <Route
                    path="purchase_history"
                    element={<PurchaseHistory />}
                  />
                  <Route
                    path="/contact_lists"
                    element={<ContactLists></ContactLists>}
                  />
                  <Route
                    path="/contact_list/:id"
                    element={<ContactList></ContactList>}
                  />
                  <Route path="/plans/" element={<Plans></Plans>} />
                  <Route
                    path="/campaign_stats/"
                    element={<CampaignsStatsPage />}
                  />
                  <Route
                    path="/edit_message/:id"
                    element={<EditMessage></EditMessage>}
                  />

                  <Route
                    path="/sms_editor/:id"
                    element={<SmsEditor></SmsEditor>}
                  />
                  <Route
                    path="/account_settings/:id"
                    element={<UserPage></UserPage>}
                  />
                  <Route path="/archive/" element={<Archives></Archives>} />
                  <Route
                    path="/stripe/"
                    element={<SuccessPayment></SuccessPayment>}
                  ></Route>
                  <Route
                    path="/stripe_cancel/"
                    element={<CancelPayment></CancelPayment>}
                  ></Route>
                </Route>
              </Route>
            </Routes>
          </ElementProvider>
        </div>
      </section>
    </AppProvider>
  );
}

export default App;

import "flowbite";
import { Route, Routes, Navigate } from "react-router-dom";
import ContactLists from "./pages/ContactLists";
import ContactList from "./pages/ContactList";
import EditMessage from "./pages/EditMessage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
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
import CreateCampaign from "./pages/CreateCampaign";
import PurchaseHistory from "./pages/PurchaseHistory";
import UnsubscribePage from "./pages/UnsubscribePage";
import ActivationEmailSuccess from "./pages/ActivationEmailSuccess";
import QRsignUpPage from "./pages/QRsignUpPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SmsSendingPage from "./pages/SmsSendingPage";
import WelcomePage from "./pages/WelcomePage";
import ProductOptimizationPage from "./pages/ProductOptimizationPage";
import ShopifyChargeConfPage from "./pages/ShopifyChargeConfPage";
import { ShopifyProductsPage } from "./pages/ShopifyProductsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useRedux } from "./constants/reduxImports";

const TRACKING_ID = "G-FPHE42LL46";
ReactGA.initialize(TRACKING_ID);

function App() {
  const { currentShopifyToken } = useRedux();
  return (
    <section>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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
          <div className="flex-1 w-22">
            <Routes>
              <Route path="register" element={<DemoPage />} />
              {/* <Route path="register" element={<RegisterPage />} /> */}
              <Route path="login" element={<Login></Login>} />
              {/* <Route
              path="shopify-login"
              element={<ShopifyLogin></ShopifyLogin>}
            /> */}
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
                  <Route path="dashboard" element={<HomePage />} />
                  <Route path="home" element={<WelcomePage></WelcomePage>} />
                  <Route path="/create_campaign" element={<CreateCampaign />} />
                  <Route
                    path="/sending_flow/:id"
                    element={<SmsSendingPage />}
                  />
                  <Route
                    path="/product_optimize/:id"
                    element={<ProductOptimizationPage />}
                  />
                  {/* <Route path="create_note" element={<CreateMessage />} /> */}
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
                  {currentShopifyToken && (
                    <Route
                      path="/products_shopify"
                      element={<ShopifyProductsPage />}
                    />
                  )}
                  <Route path="/plans/" element={<Plans></Plans>} />
                  {/* <Route
                    path="/campaign_stats/"
                    element={<CampaignsStatsPage />}
                  /> */}
                  <Route
                    path="/edit_message/:id"
                    element={<EditMessage></EditMessage>}
                  />
                  <Route
                    path="/account_settings/:id"
                    element={<UserPage></UserPage>}
                  />
                  <Route
                    path="/shopify/charge/confirmation"
                    element={<ShopifyChargeConfPage />}
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </ElementProvider>
      </div>
    </section>
  );
}

export default App;

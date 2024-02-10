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
import SuccessPayment from "./pages/SuccessPayment";
import CancelPayment from "./pages/CancelPayment";
import AnalyticsPage from "./pages/AnalyticsPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import ActivationEmailSuccess from "./pages/ActivationEmailSuccess";

const TRACKING_ID = "G-FPHE42LL46";
ReactGA.initialize(TRACKING_ID);

function App() {
  return (
    <section>
      <div className="main"></div>
      <Routes>
        <Route path="/view/:id" element={<MessageView></MessageView>}></Route>
        <Route
          path="/opt-out/:id"
          element={<UnsubscribePage></UnsubscribePage>}
        ></Route>
        <Route
          path="/activate_email/:token_id/:user_id/"
          element={<ActivationEmailSuccess></ActivationEmailSuccess>}
        ></Route>
      </Routes>
      <div className="App">
        <ElementProvider>
          <Routes>
            <Route path="register" element={<RegisterPage />} />
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
                  path="/contact_lists"
                  element={<ContactLists></ContactLists>}
                />
                <Route
                  path="/contact_list/:id"
                  element={<ContactList></ContactList>}
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
  );
}

export default App;

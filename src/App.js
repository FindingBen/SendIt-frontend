import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
import ContactLists from "./pages/ContactLists";
import ContactList from "./pages/ContactList";
import CreateMessage from "./pages/CreateMessage";
import EditMessage from "./pages/EditMessage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout";
import DeleteMessage from "./pages/DeleteMessage";
import Login from "./features/auth/Login";
import HomePage from "./pages/HomePage";
import SmsEditor from "./pages/SmsEditor";
import { ElementProvider } from "./context/ElementContext";
import MessageView from "./pages/MessageView";
import UserPage from "./pages/UserPage";
import CreateList from "./pages/CreateList";
import PackagePlan from "./pages/PackagePlan";
import PasswordReset from "./utils/PasswordReset";
import PasswordResetConfirm from "./utils/PasswordResetConfirm";
import ReactGA from "react-ga";
import SuccessPayment from "./pages/SuccessPayment";
import CancelPayment from "./pages/CancelPayment";

const TRACKING_ID = "G-RZ6J50WZSE";
ReactGA.initialize(TRACKING_ID, { debug: true });

function App() {
  // useEffect(() => {
  //   history.listen((location) => {
  //     ReactGA.set({ page: location.pathname });
  //     ReactGA.pageview(location.pathname)
  //   }
  // );
  // }, []);

  return (
    <div>
      <Routes>
        <Route
          path="/message_view/:id"
          element={<MessageView></MessageView>}
        ></Route>
      </Routes>
      <div className="App" style={({ height: "100vh" }, { display: "flex" })}>
        <ElementProvider>
          <Routes>
            {/* <Route
              path="/message_view/:id"
              element={<MessageView></MessageView>}
            ></Route> */}
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
                <Route path="home" element={<HomePage />} />
                <Route path="create_note" element={<CreateMessage />} />
                <Route
                  path="/contact_lists"
                  element={<ContactLists></ContactLists>}
                />
                <Route
                  path="/create_list/"
                  element={<CreateList></CreateList>}
                ></Route>
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
                  path="/package_plan/"
                  element={<PackagePlan></PackagePlan>}
                />
                <Route
                  path="/delete_message/:id"
                  element={<DeleteMessage></DeleteMessage>}
                ></Route>
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
    </div>
  );
}

export default App;

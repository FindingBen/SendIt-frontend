import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ContactLists from "./pages/ContactLists";
import ContactList from "./pages/ContactList";
import CreateContact from "./pages/CreateContact";
import CreateNote from "./pages/CreateNote";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import IFrame from "./components/IFrame";
import Image from "./components/Image";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./utils/PrivateRoute";
import MessageView from "./pages/MessageView";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="App" style={({ height: "100vh" }, { display: "flex" })}>
      <Router>
        <AuthProvider>
          {/* <Header /> */}

          <Routes>
            <Route path="message_view" element={<MessageView />} />
            <Route element={<Layout />}>
              <Route path="*" element={<PrivateRoute></PrivateRoute>} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="login" element={<LoginPage></LoginPage>} />

              <Route
                path="/create_note"
                element={
                  <CreateNote>
                    <Image></Image>
                  </CreateNote>
                }
              />
              <Route
                path="/contact_lists"
                element={<ContactLists></ContactLists>}
              />
              <Route
                path="/contact_list/:id"
                element={<ContactList></ContactList>}
              />
              <Route
                path="/create_contact/:id"
                element={<CreateContact></CreateContact>}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ContactLists from "./pages/ContactLists";
import ContactList from "./pages/ContactList";
import CreateContact from "./pages/CreateContact";
import CreateMessage from "./pages/CreateMessage";
import EditMessage from "./pages/EditMessage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout";
import DeleteMessage from "./pages/DeleteMessage";
import Login from "./features/auth/Login";
import HomePage from "./pages/HomePage";
import { ElementProvider } from "./context/ElementContext";
function App() {
  return (
    <div>
      <div className="App" style={({ height: "100vh" }, { display: "flex" })}>
        <ElementProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* <Route path="*" element={<PrivateRoute></PrivateRoute>} /> */}
              <Route path="register" element={<RegisterPage />} />
              <Route path="login" element={<Login></Login>} />

              <Route element={<PrivateRoute />}>
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
                  path="/create_contact/:id"
                  element={<CreateContact></CreateContact>}
                />
                <Route
                  path="/edit_message/:id"
                  element={<EditMessage></EditMessage>}
                />
                <Route
                  path="/delete_message/:id"
                  element={<DeleteMessage></DeleteMessage>}
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

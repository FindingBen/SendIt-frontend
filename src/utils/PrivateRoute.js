import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CreateNote from "../pages/CreateNote";
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children, ...rest }) => {
  let { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route {...rest}>
        {!user ? (
          <Route path="*" element={<Navigate replace to="/login" />} />
        ) : (
          <Route path="*" element={<HomePage></HomePage>} />
        )}
      </Route>
    </Routes>
  );
};

export default PrivateRoute;

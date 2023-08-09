import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import HomePage from "../pages/HomePage";

import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const PrivateRoute = () => {
  // const token = useSelector(selectCurrentToken);
  // const location = useLocation();
  // return (
  //   <Routes>
  //     {!token && <Route path="*" element={<Navigate replace to="/login" />} />}
  //     {token && (
  //       <Route path="*" element={<Outlet />}>
  //         <Route index element={<HomePage />} />
  //       </Route>
  //     )}
  //   </Routes>
  // );
  const token = useSelector(selectCurrentToken);

  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

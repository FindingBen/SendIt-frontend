import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useRedux } from "../constants/reduxImports";

const PrivateRoute = () => {
  const { currentToken } = useRedux();

  const location = useLocation();

  return currentToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

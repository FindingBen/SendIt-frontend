import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();

  // Add any routes where the header should be hidden
  const hideHeaderRoutes = [
    "/create_campaign/",
    
  ];

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Outlet />
    </>
  );
};

export default Layout;
